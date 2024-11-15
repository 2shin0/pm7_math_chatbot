from flask import Flask, request, jsonify, render_template
import base64
from io import BytesIO
import requests

# GPT 모델과 RAG 관련 라이브러리 임포트
from langchain.chains import AnalyzeDocumentChain
from langchain.chains.question_answering import load_qa_chain
from langchain.chat_models import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings

# .env 환경 변수 로드
from dotenv import load_dotenv
import os
import openai
from PIL import Image

# Flask 앱 설정
app = Flask(__name__)

# 환경 설정
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

# GPT 모델 설정
model = ChatOpenAI(model="gpt-4o")
qa_chain = load_qa_chain(model, chain_type="map_reduce")
qa_document_chain = AnalyzeDocumentChain(combine_docs_chain=qa_chain)

# 벡터 데이터베이스를 이용한 검색 함수
def search_documents(query, k=5):
    faiss_data = FAISS.load_local("./faiss_data", OpenAIEmbeddings(), allow_dangerous_deserialization=True)
    retriever = faiss_data.as_retriever(search_type='mmr', search_kwargs={'k': k})
    
    # Query the vector store to retrieve matching documents
    search_results = retriever.get_relevant_documents(query)
    return [result.page_content for result in search_results]

# GPT 모델을 이용한 응답 생성 함수
def get_response(prompt):
    relevant_docs = search_documents(prompt)
    combined_docs = "\n".join(relevant_docs)
    response = qa_document_chain.run(input_document=combined_docs, question=prompt)
    return response

# initial_content 수정
initial_content = """너는 중학교 1학년 수학 선생님이야. 중학교 1학년 학생에게 
                    설명하듯 친절하게 답변을 해줘. 존댓말을 쓰고 ~~합니다 보다는 ~~에요 말투를 써
                    사용자가 추가 설명을 요청하면 더 이해하기 쉽도록 작은 변화를 주어서 설명해줘. 중학교 1학년의 수준에서  벗어나는 용어는 사용하지 마.    
                    수학적 개념과 그 정의를 100자 이내로설명해 줘. 가능하다면 그 예를 들어 줘.
                    읽기 편하도록 적절한 문단 구분을 해줘.
                    예시 : 소수는 '1과 자신 이외의 어떤 수로도 나눠지지 않는 수' 를 말해요. 예를 들면 2, 5, 13, 281 등이 있어요.     
                    """

# 기본 라우트
@app.route('/')
def page1():
    return render_template('chatbot.html')

# "모르는 개념이 있어요" : 확인 O
@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    full_prompt = initial_content + user_input
    response = get_response(full_prompt)
    response = response.replace("\n", "<br>") 
    return jsonify({'message': response})

def handle_image(file):
    file = request.files.get("file")
    image = Image.open(file)
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return image_base64

import json

# "문제 풀이에서 도움이 필요해요" 
@app.route("/problem", methods=["POST"])
def make_strategy():
    system_prompt = """
                    그림이 주어진 문제라면, 주어진 그림에는 표현되어있지 않지만 문제를 읽었을 때 알 수 있는 조건도 고려해.
                    주어진 문제가 도형이나 공간에 관한 문제라면 다음을 출력해 : 죄송해요, 도형에 관한 문제는 아직 준비중이에요. 
                    문제 형식이 객관식이면서 문제에 답의 개수가 설명되고있거나 답이 여러개라는 말, 모두 고르라는 말이 없다면 정답의 개수는 하나야.
                    입체도형에 관한 문제는 3차원 공간의 모든 방향에서 도형을 고려해.  
                    문제에서 구하려는 것이 무엇인지 생각해.
                    문제에 대한 전략을 3단계로 구조화해서 알려줘. 
                    각 단계 별 100자 이내로 생각해.
                    방금 생각한 각 단계별 전략에 맞춰 문제 풀이를 하고 답도 알려줘.

    답변 형식 ----------------

    전략 1단계 : ~~ (너의 답변)

    풀이 1단계 : ~~ (너의 답변)

    전략 2단계 : ~~ (너의 답변)

    풀이 2단계 : ~~ (너의 답변)

    전략 3단계 : ~~ (너의 답변)

    풀이 3단계 : ~~ (너의 답변)

    답 : ~~ (너가 생각하는 답)
    
    -----------------
    반드시 위 형식에 맞춰서 답변해.

    다음은 답변 42를 소인수 분해하는 문제에 대한 답변 예시야.

    답변 예시 ----------------

    전략 1단계 : 42를 나눌 수 있는 자연수를 찾아봅시다!

    풀이 1단계 : 42를 나눌 수 있는 자연수는 1, 2, 3, 6, 7, 14, 21, 42가 있습니다!

    전략 2단계 : 42를 나눌 수 있는 소인수를 찾아봅시다!

    풀이 2단계 : 42를 나눌 수 있는 소인수는 2, 3, 7이 있습니다!

    전략 3단계 : 소인수의 곱으로 42를 표현해봅시다!

    풀이 3단계 : 42 = 2*3*7 로 표현 가능합니다!

    답 : 따라서 답은 42입니다!
    
    -----------------
    """

    file = request.files.get("file")

    if not file:
        return jsonify({"message": "파일이 없습니다."})
    
    try:
        image_base64 = handle_image(file)

        print("======solution")

        print("File received:", file.filename)

        # GPT 모델에 전달할 메시지 준비
        messages = [
            {"role": "system", "content": system_prompt+initial_content},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}  # 이미지 포함
                ]
            }
        ]

        # GPT에 요청하여 단계별 풀이 생성
        response_content = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=1000
        )
        print(response_content)
        # response_content = response_content.replace("\n", "<br>") 

        # 응답 텍스트를 단계별로 나누어 JSON 형식으로 변환
        steps = {}
        step_texts = response_content.choices[0].message.content.strip().split('\n\n')
        print(step_texts)

        for step_text in step_texts:
            if "전략 1단계" in step_text:
                steps["strategy1"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "전략 2단계" in step_text:
                steps["strategy2"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "전략 3단계" in step_text:
                steps["strategy3"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "풀이 1단계" in step_text:
                steps["step1"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "풀이 2단계" in step_text:
                steps["step2"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "풀이 3단계" in step_text:
                steps["step3"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')
            elif "답" in step_text:
                steps["answer"] = step_text.split(":", 1)[1].strip().replace('\n', '<br>')

        # JSON으로 변환
        strategy_json = json.dumps(steps, ensure_ascii=False, indent=2)
        print("Steps in JSON format:", strategy_json)

        return jsonify({"response_content": strategy_json})

    except Exception as e:
        return jsonify({"message": f"오류가 발생했습니다: {str(e)}"})

# "문제 풀이 전략이 궁금해요"
@app.route("/strategy", methods=["POST"])
def question_strategy():
    try:
        strategy_json = request.json  
        steps = strategy_json.get("steps", {})
        message = request.json.get("message", "")

        result = ""
        if message == "문제 풀이 전략이 궁금해요" and "strategy1" in steps:
            result = steps["strategy1"].replace("전략 1단계 : ", "")
        elif message == "다음 전략(2/3)" and "strategy2" in steps:
            result = steps["strategy2"].replace("전략 2단계 : ", "")
        elif message == "다음 전략(3/3)" and "strategy3" in steps:
            result = steps["strategy3"].replace("전략 3단계 : ", "")
        elif message == "문제에 맞춘 구체적인 풀이가 필요해요" and "step1" in steps:
            result = steps["step1"].replace("풀이 1단계 : ", "")
        elif message == "다음 풀이(2/3)" and "step2" in steps:
            result = steps["step2"].replace("풀이 2단계 : ", "")
        elif message == "다음 풀이(3/3)" and "step3" in steps:
            result = steps["step3"].replace("풀이 3단계 : ", "")
        elif message == "정답확인" and "step1" in steps:
            result = steps["answer"].replace("답 : ", "")
        
        return jsonify({"message": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# 전략에서 "문제에 맞춘 구체적인 풀이가 필요해요" 클릭 시
@app.route("/strategy_solution", methods=["POST"])
def strategy_solution():
        try:
            solution_json = request.json  # assuming strategy_json is the full JSON sent from the frontend
            steps = solution_json.get("steps", {})
            message = request.json.get("message", "")

            result = ""

            # 각 단계에 맞는 구체적인 풀이를 반환
            if message == "문제에 맞춘 구체적인 풀이가 필요해요":
                if "step1" in steps:  # 1단계 풀이
                    result = steps["step1"]
                elif "step2" in steps:  # 2단계 풀이
                    result = steps["step2"]
                elif "step3" in steps:  # 3단계 풀이
                    result = steps["step3"]

            return jsonify({"message": result})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

# 풀이에 사용된 개념이 궁금해요
@app.route("/question_concept", methods=["POST"])
def concept_question():

    print("====개념개념")

    file = request.files.get("file")
    # image_base64 = handle_image(file)
    previous_answer = request.form.get("previous_answer")

    print("File received:", file.filename)

    system_prompt = f""" 너는 중학교 1학년 수학 선생님이야. 중학교 1학년 학생에게 
                    설명하듯 친절하게 답변을 해줘. 존댓말을 쓰고 ~~합니다 보다는 ~~에요 말투를 써
                    사용자가 추가 설명을 요청하면 더 이해하기 쉽도록 작은 변화를 주어서 설명해줘. 
                    중학교 1학년의 수준에서  벗어나는 용어는 사용하지 마.    
                    읽기 편하도록 적절한 문단 구분을 해줘.             
                    {previous_answer} 을 참고하여 답변을 줘.
                      풀이와 답은 절대 알려주지 말고 핵심 개념에 대해서만 설명해야 해.   
                      
                     """

    full_prompt = initial_content + system_prompt
    response = get_response(full_prompt)
    return jsonify({'response': response})

# "문제에 맞춘 구체적인 풀이가 필요해요"
@app.route("/solution", methods=["POST"])
def question_solution():
    try:
        solution_json = request.json
        steps = solution_json.get("steps", {})
        message = request.json.get("message", "")
        previous_answer = request.json.get("previous_answer", "")

        result = ""

        # previous_answer가 각 strategy의 값에 포함되어 있는지 확인
        if previous_answer in steps.get("strategy1", "") and "step1" in steps:
            result = steps["step1"].replace("풀이 1단계 : ", "")
        elif previous_answer in steps.get("strategy2", "") and "step2" in steps:
            result = steps["step2"].replace("풀이 2단계 : ", "")
        elif previous_answer in steps.get("strategy3", "") and "step3" in steps:
            result = steps["step3"].replace("풀이 3단계 : ", "")
        elif message == "정답확인" and "answer" in steps:
            result = steps["answer"].replace("답 : ", "")

        return jsonify({"message": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 질문이 있어요
@app.route("/chatImage", methods=["POST"])
def chat_image():
    print("=============")
    message = request.form.get("message") 
    file = request.files.get("file")  

    print("File received:", file.filename if file else "No file")
    print("message: ", message)

    image_base64 = handle_image(file)
    previous_answer = request.form.get("previous_answer")

    print("======solution")

    print("File received:", file.filename)
    print("File received:", previous_answer)
    system_prompt = f"""
    너는 중학교 1학년 수학 선생님이야. 
    {previous_answer}를 참고해서 학생의 질문에 답해줘.
    설명하듯 친절하게 답변을 해줘. 존댓말을 쓰고 ~~합니다 보다는 ~~에요 말투를 써
    사용자가 추가 설명을 요청하면 더 이해하기 쉽도록 작은 변화를 주어서 설명해줘. 중학교 1학년의 수준에서  벗어나는 용어는 사용하지 마. 
    읽기 편하도록 적절한 문단 구분을 해줘.
    질문 내용은 다음과 같아. {message}
    답변의 마지막에 다음 내용을 추가해 줘 :
    """

    full_prompt = initial_content + system_prompt
    response = get_response(full_prompt)
    response = response.replace("\n", "<br>") 

    return jsonify({'response': response})

# 의도를 모르겠어요
@app.route("/intention", methods=["POST"])
def chat_intention():

    print("=============")
    message = request.form.get("message") 
    file = request.files.get("file")  

    print("File received:", file.filename if file else "No file")
    print("message: ", message)

    image_base64 = handle_image(file)

    system_prompt = f"""
                    학생이 문제 푸는 접근법을 몰라 질문을 한 상황이야. 
                    답이나 풀이는 알려주지 말고, 문제의 수학적 의도만 200자 이내의 문장으로 답변해 줘.
                    예시 : 이 문제는 일차방정식을 이용하여 아버지의 나이를 구하는 문제예요. 
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_base64}"}}
            ]
        }
    ]

    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=100
    )

    print("=========", response.choices[0].message.content)

    response_message = {
        "response": response.choices[0].message.content
    }

    return jsonify(response_message), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
## 생성형 AI를 활용한 중등 수학 개념 및 풀이
---
### ✅ 개요
KDT 개발 멘토로 참여한 결과물입니다.<br>
**📌 팀원**<br>
기획 : PM 7기 김민정, 김지민, 김화영, 유영채, 윤수정 님<br>
개발 멘토 : [김현경](https://github.com/beubeu95), [이신영](https://github.com/2shin0) 님<br>
**📌 기간**<br>
2024/11/7(목) ~ 11/14(목) 총 6일, 개발 약 4일

### ✅ 기획
<details>
  <summary>**📌 기획 발표자료**</summary>
  
  <p align="center">
    <img src="https://github.com/user-attachments/assets/d5b211fc-391a-4489-b606-770729b453da" width="45%" />
    <img src="https://github.com/user-attachments/assets/329fbb80-a861-4981-bbdd-0ecd9300baeb" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/eba2010c-58a3-400a-84cb-2724ad2ca3c4" width="45%" />
    <img src="https://github.com/user-attachments/assets/c6095827-5489-4358-ae2b-8eec07f4141d" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/6fc2f42a-6aa8-4067-b151-402e253b0f38" width="45%" />
    <img src="https://github.com/user-attachments/assets/9af8db2c-5393-4738-a379-e5ca365ffc4e" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/8359e8c3-b586-462a-b798-2edda6c11518" width="45%" />
    <img src="https://github.com/user-attachments/assets/100a1257-35ac-463e-9396-7ab2e76a1328" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/ecd770ea-2952-4ffa-9fc3-80af57946cec" width="45%" />
  </p>
  
</details>

### ✅ 개발
<details>
  <summary>**📌 개발 발표자료**</summary>
  
  <p align="center">
    <img src="https://github.com/user-attachments/assets/63830cfc-46b5-44e1-89be-0dc52c782f9f" width="45%" />
    <img src="https://github.com/user-attachments/assets/63370a05-fd85-420b-a822-4515a2155044" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/8eaa9dba-de1f-4dfd-b6a3-88a7a60cdf7f" width="45%" />
    <img src="https://github.com/user-attachments/assets/fbdecc6a-2230-4a34-a967-ee801c667783" width="45%" />
  </p>
  <p align="center">
    <img src="https://github.com/user-attachments/assets/dfd84f78-38ff-4cac-83b1-a0040939ff5c" width="45%" />
    <img src="https://github.com/user-attachments/assets/4b271fe9-2ba6-4d5a-a38b-7b8e6b000c5a" width="45%" />
  </p>

</details>

<details>
  <summary>**📌 실행**</summary>
  
  1. 개발 환경
  - VSCode
  - Python 3.10.0

  2. OpenAI API KEY 준비
  - API 키를 발급받아 .env에 넣어주세요.

  3. RAG 문서를 PDF 폴더에 넣어주세요.

  4. 다음 명령어를 순서대로 실행하여 주세요.
  ```
# 가상환경 생성(괄호는 실제 입력 x)
python -m venv (가상환경 이름)

# 가상환경 활성화(괄호는 실제 입력 x)
(가상환경 이름)/Scrips/activate

# 패키지 설치
pip install - r requirements.txt

# PDF 청킹, 임베딩, 벡터DB에 저장
python file_trans.py

# 챗봇 실행
python main.py
  ```

</details>

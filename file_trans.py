from langchain.chat_models import ChatOpenAI
from langchain.chains import AnalyzeDocumentChain
from langchain.chains.question_answering import load_qa_chain
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter

import os
from dotenv import load_dotenv

load_dotenv()


#### PDF 위치 지정 및 텍스트 변환
loader = PyPDFDirectoryLoader('./pdf/')
raw_text = loader.load_and_split()


def split_text(raw_text):
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=100,
        chunk_overlap=30,
        encoding_name='cl100k_base'  
    )

    text = text_splitter.split_documents(raw_text)
    return text

texts = split_text(raw_text)

embedding = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(
    texts,
    embedding=embedding,
    distance_strategy=DistanceStrategy.COSINE
)
vectorstore.save_local('./faiss_data')
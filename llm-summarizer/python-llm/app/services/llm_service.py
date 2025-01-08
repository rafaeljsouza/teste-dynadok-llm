from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_huggingface import HuggingFaceEndpoint
from transformers import pipeline
from langchain_community.llms import HuggingFacePipeline
import os
from dotenv import load_dotenv

load_dotenv()

# Create a summarization pipeline
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    token=os.getenv("HF_TOKEN")
)

# Wrap it in a LangChain compatible format
llm = HuggingFacePipeline(pipeline=summarizer)

# Create prompt templates
summarize_prompt = PromptTemplate(
    input_variables=["text"],
    template="""Summarize the key points from this text in 2-3 sentences:

{text}

Summary:"""
)

translate_prompt = PromptTemplate(
    input_variables=["text", "language"],
    template="""Translate to {language}:

{text}

Translation:"""
)

async def generate_summary(text: str) -> str:
    try:
        # Split text into smaller chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,  # Reduced chunk size
            chunk_overlap=50
        )
        docs = text_splitter.create_documents([text])
        
        # Create and run the summarization chain
        chain = load_summarize_chain(
            llm=llm,
            chain_type="stuff",
            prompt=summarize_prompt
        )
        
        # Use invoke instead of run to avoid HF errors
        summary = chain.invoke({"input_documents": docs})
        return summary['output_text'].strip()
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        raise Exception(f"Failed to generate summary: {str(e)}")

async def translate_text(text: str, target_lang: str) -> str:
    try:
        lang_map = {
            'pt': 'Portuguese',
            'es': 'Spanish',
            'en': 'English'
        }
        
        # Create translation prompt
        prompt = PromptTemplate(
            template=f"Translate to {lang_map[target_lang]}: {{text}}",
            input_variables=["text"]
        )
        
        # Use direct LLM call for translation
        result = llm.invoke(prompt.format(text=text))
        return result.strip()
    except Exception as e:
        print(f"Error translating text: {str(e)}")
        raise Exception(f"Failed to translate text: {str(e)}")
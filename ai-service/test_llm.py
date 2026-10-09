from app.services.llm_service import generate_answer


context = """
FastAPI is a Python web framework.
It is commonly used to build APIs with Python.
"""


question = "What is FastAPI?"


answer = generate_answer(
    question=question,
    context=context
)


print(answer)
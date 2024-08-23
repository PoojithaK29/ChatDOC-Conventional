from flask import Flask, render_template, request, jsonify
import pdfplumber
from transformers import pipeline

app = Flask(__name__)

# Load the pre-trained QA pipeline using BERT model fine-tuned on SQuAD
qa_pipeline = pipeline("question-answering", model="deepset/bert-large-uncased-whole-word-masking-squad2", tokenizer="deepset/bert-large-uncased-whole-word-masking-squad2")

# PDF path
pdf_path = 'C:/Users/pkathi/Desktop/Sample Document Assistant/Local Memory Unit (LMU) (6).pdf'

# Extract text from the PDF
with pdfplumber.open(pdf_path) as pdf:
    pdf_text = "".join([page.extract_text() for page in pdf.pages])

# Cache to store previously computed answers
cached_answers = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_question = request.json['user_question']

    # Check if the answer is cached
    if user_question in cached_answers:
        answer = cached_answers[user_question]
    else:
        # Compute the answer
        answer = qa_pipeline(question=user_question, context=pdf_text)
        # Cache the answer
        cached_answers[user_question] = answer

    return jsonify({'answer': answer['answer']})

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
from flask_cors import CORS

nltk.download('vader_lexicon')

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello, World!"


sia = SentimentIntensityAnalyzer()

def classify_sentiment(compound):
    if compound <= -0.6:
        return "Strongly Negative 😡"
    elif compound <= -0.2:
        return "Slightly Negative 😕"
    elif compound < 0.2:
        return "Neutral 😐"
    elif compound < 0.6:
        return "Slightly Positive 🙂"
    else:
        return "Strongly Positive 😄"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')

    scores = sia.polarity_scores(text)
    sentiment = classify_sentiment(scores['compound'])
    confidence = round(abs(scores['compound']) * 100)

    return jsonify({
        'sentiment': sentiment,
        'compound_score': scores['compound'],
        'confidence': f"{confidence}%",
        'details': scores
    })

if __name__ == '__main__':
    app.run(debug=True)


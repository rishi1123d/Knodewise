from flask import Flask, request, jsonify
from flask_cors import CORS
from math_voice_tutor import MathVoiceTutor
import logging
import os
import pyttsx3
import time
import subprocess
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Debug environment variables
logger.info("Checking environment variables...")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"OPENAI_API_KEY present: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
if os.getenv('OPENAI_API_KEY'):
    logger.info(f"OPENAI_API_KEY length: {len(os.getenv('OPENAI_API_KEY'))}")

# Simple CORS configuration
CORS(app, supports_credentials=True)

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Initialize text-to-speech engine
try:
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    voices = engine.getProperty('voices')
    for voice in voices:
        if "samantha" in voice.name.lower() or "alex" in voice.name.lower() or "victoria" in voice.name.lower():
            engine.setProperty('voice', voice.id)
            break
    logger.info("Text-to-speech engine initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize text-to-speech: {e}")
    engine = None

# Initialize the math tutor
try:
    logger.info("Starting math tutor initialization...")
    logger.info(f"OpenAI API Key present: {'Yes' if os.getenv('OPENAI_API_KEY') else 'No'}")
    if os.getenv('OPENAI_API_KEY'):
        logger.info(f"API Key length: {len(os.getenv('OPENAI_API_KEY'))}")
    tutor = MathVoiceTutor()
    logger.info("Math tutor initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize math tutor: {str(e)}")
    logger.error(f"Error type: {type(e).__name__}")
    import traceback
    logger.error(f"Full traceback: {traceback.format_exc()}")
    tutor = None

def speak_text(text):
    """Speak text using available text-to-speech methods"""
    try:
        if engine:
            logger.info("Using pyttsx3 for speech...")
            sentences = text.split('.')
            for sentence in sentences:
                if sentence.strip():
                    logger.info(f"Saying: {sentence.strip()}")
                    engine.say(sentence.strip() + '.')
                    engine.runAndWait()
                    time.sleep(0.5)
        else:
            logger.info("Using system text-to-speech...")
            sentences = text.split('.')
            for sentence in sentences:
                if sentence.strip():
                    logger.info(f"Saying: {sentence.strip()}")
                    subprocess.run(['say', sentence.strip() + '.'])
                    time.sleep(0.5)
    except Exception as e:
        logger.error(f"Error in text-to-speech: {e}")

@app.route('/ask', methods=['POST', 'OPTIONS'])
def ask_question():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        if not tutor:
            return jsonify({'error': 'Math tutor not initialized'}), 500

        logger.info("Received question request")
        data = request.get_json()
        logger.info(f"Received data: {data}")
        
        if not data:
            logger.error("No JSON data received")
            return jsonify({'error': 'No data provided'}), 400
            
        question = data.get('question')
        logger.info(f"Processing question: {question}")
        
        if not question:
            logger.error("No question in request data")
            return jsonify({'error': 'No question provided'}), 400
            
        # Get explanation from the tutor
        explanation = tutor.get_math_explanation(question)
        logger.info(f"Got explanation: {explanation}")
        
        # Speak the response
        speak_text(explanation)
        
        return jsonify({
            'success': True, 
            'response': explanation,
            'question': question
        })
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'status': 'API is working'})

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', debug=True, port=port) 
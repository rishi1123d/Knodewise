import speech_recognition as sr
import pyttsx3
import openai
import os
from dotenv import load_dotenv
import time
import random
import subprocess

# Load environment variables
load_dotenv()

class MathVoiceTutor:
    def __init__(self):
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        
        # Initialize text-to-speech engine
        try:
            print("Initializing text-to-speech engine...")
            self.engine = pyttsx3.init()
            
            # Set speech rate
            self.engine.setProperty('rate', 150)
            
            # Get available voices
            voices = self.engine.getProperty('voices')
            print(f"Available voices: {[voice.name for voice in voices]}")
            
            # Try to set a more natural voice
            for voice in voices:
                if "samantha" in voice.name.lower():
                    print(f"Using voice: {voice.name}")
                    self.engine.setProperty('voice', voice.id)
                    break
                elif "alex" in voice.name.lower():
                    print(f"Using voice: {voice.name}")
                    self.engine.setProperty('voice', voice.id)
                    break
                elif "victoria" in voice.name.lower():
                    print(f"Using voice: {voice.name}")
                    self.engine.setProperty('voice', voice.id)
                    break
            
            # Test the voice
            print("Testing voice...")
            self.engine.say("Hello! I'm your math tutor.")
            self.engine.runAndWait()
            print("Voice test successful!")
            
        except Exception as e:
            print(f"Error initializing text-to-speech: {e}")
            print("Trying alternative initialization...")
            try:
                self.engine = pyttsx3.init(driverName='nsss')
                print("Successfully initialized with nsss driver")
            except Exception as e2:
                print(f"Failed to initialize with nsss driver: {e2}")
                self.engine = None
        
        # Initialize OpenAI
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        if not os.getenv('OPENAI_API_KEY'):
            raise ValueError("OpenAI API key not found. Please set it in the .env file.")
        
        # System prompt for math tutoring with personality
        self.system_prompt = """You are a math tutor focused on providing clear, step-by-step solutions.
        For each question:
        1. State the key concept or formula needed
        2. Break down the solution into numbered steps
        3. Show all calculations clearly
        4. Explain each step briefly but clearly
        5. State the final answer
        
        Keep responses concise and focused on solving the problem.
        If the question is unclear, ask for clarification.
        If the question is not about math, politely redirect to math topics."""
    
    def speak_response(self, text):
        """Convert text response to speech with personality"""
        try:
            if self.engine is not None:
                print("Speaking response...")
                # Split the text into smaller chunks for better speech synthesis
                sentences = text.split('.')
                for sentence in sentences:
                    if sentence.strip():
                        print(f"Saying: {sentence.strip()}")
                        self.engine.say(sentence.strip() + '.')
                        self.engine.runAndWait()
                        time.sleep(0.5)  # Small pause between sentences
            else:
                print("Using system text-to-speech...")
                # Use system's say command as fallback
                sentences = text.split('.')
                for sentence in sentences:
                    if sentence.strip():
                        print(f"Saying: {sentence.strip()}")
                        subprocess.run(['say', sentence.strip() + '.'])
                        time.sleep(0.5)
            print(text)
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
            print("Here's the text response:")
            print(text)
    
    def listen_for_question(self):
        """Listen for user's math question using microphone"""
        with sr.Microphone() as source:
            print("Listening for your math question...")
            self.recognizer.adjust_for_ambient_noise(source)
            audio = self.recognizer.listen(source)
            
            try:
                text = self.recognizer.recognize_google(audio)
                print(f"You asked: {text}")
                return text
            except sr.UnknownValueError:
                print("Sorry, I couldn't understand that.")
                return None
    
    def get_math_explanation(self, question):
        """Get step-by-step math explanation from GPT"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": question}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error getting explanation: {e}")
            return "I apologize, but I'm having trouble processing your question. Please try again."
    
    def run_tutoring_session(self):
        """Main loop for the tutoring session"""
        print("Math Voice Tutor is ready! Press Ctrl+C to exit.")
        
        while True:
            try:
                # Listen for question
                question = self.listen_for_question()
                if not question:
                    continue
                
                # Get explanation
                explanation = self.get_math_explanation(question)
                
                # Speak the explanation
                print("\nTutor's response:")
                self.speak_response(explanation)
                
            except KeyboardInterrupt:
                print("\nEnding tutoring session...")
                self.speak_response("Thanks for hanging out! Math is awesome, and you're doing great!")
                break
            except Exception as e:
                print(f"An error occurred: {e}")
                self.speak_response("Oops! Something went wrong, but don't worry! Let's try that again!")

if __name__ == "__main__":
    tutor = MathVoiceTutor()
    tutor.run_tutoring_session() 
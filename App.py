from flask import Flask, render_template
import requests
import re

app = Flask(__name__)

# Replace with your desired TfL API endpoint
API_URL = "https://api.tfl.gov.uk/Line/Mode/tube/Status"

# Read words from the words.txt file
with open('words.txt', 'r') as f:
    words = f.read().splitlines()

def check_api_response(api_url, words):
    """
    Checks an API response for words from a given list.

    Args:
        api_url: The URL of the API endpoint.
        words: A list of words to check.

    Returns:
        A list of words found in the API response.
    """

    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise exception for non-200 status codes
    except requests.exceptions.RequestException as e:
        return None, "Error fetching data from TfL API."

    # Create regular expression pattern to match any of the words
    word_pattern = r'\b(' + '|'.join(words) + r')\b'

    # Find matches in the response text
    matches = re.findall(word_pattern, response.text, re.IGNORECASE)

    return matches, None


@app.route('/')
def index():
    found_words, error_message = check_api_response(API_URL, words)

    return render_template('index.html', found_words=found_words, error_message=error_message)

if __name__ == '__main__':
    app.run(debug=True)

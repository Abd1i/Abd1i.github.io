from flask import Flask, request, render_template, redirect, flash
import requests
import re

app = Flask(__name__)

# Replace with your desired TfL API endpoint
API_URL = "https://api.tfl.gov.uk/Line/Mode/tube/Status"

def check_api_response(api_url, words_file):
    """
    Checks an API response for words from a given file.

    Args:
        api_url: The URL of the API endpoint.
        words_file: The uploaded words file.

    Returns:
        A list of words found in the API response.
    """

    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise exception for non-200 status codes
    except requests.exceptions.RequestException as e:
        return None, "Error fetching data from TfL API."

    # Read words from the file
    words = words_file.read().decode('utf-8').splitlines()

    # Create regular expression pattern to match any of the words
    word_pattern = r'\b(' + '|'.join(words) + r')\b'

    # Find matches in the response text
    matches = re.findall(word_pattern, response.text, re.IGNORECASE)

    return matches, None


@app.route('/', methods=['GET', 'POST'])
def index():
    found_words, error_message = None, None

    if request.method == 'POST':
        words_file = request.files['words_file']

        if words_file and words_file.filename.endswith('.txt'):
            found_words, error_message = check_api_response(API_URL, words_file)
        else:
            error_message = "Please upload a valid text file."

    return render_template('index.html', found_words=found_words, error_message=error_message)

if __name__ == '__main__':
    app.run(debug=True)

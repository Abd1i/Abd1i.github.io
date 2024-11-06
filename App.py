from flask import Flask, request, render_template, redirect, flash
import requests
import re

app = Flask(__name__)

# Example of a public TfL API endpoint for bus stop information
API_URL = "https://api.tfl.gov.uk/StopPoint/490007627T/Arrivals"

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
        flash("Error fetching data from TfL API.", 'error')
        return []

    # Create regular expression pattern to match any of the words
    word_pattern = r'\b(' + '|'.join(words) + r')\b'

    # Find matches in the response text
    matches = re.findall(word_pattern, response.text, re.IGNORECASE)

    return matches


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        words = request.form['words'].split(',')
        found_words = check_api_response(API_URL, words)
        return render_template('results.html', found_words=found_words)

    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)

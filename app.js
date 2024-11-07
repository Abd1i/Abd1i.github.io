const API_URL = "https://api.tfl.gov.uk/Line/Mode/tube/Status";
let words = []; // Will store words from words.txt

// Load words from words.txt
async function loadWords() {
  try {
    const response = await fetch("words.txt");
    if (!response.ok) throw new Error("Error fetching words file");
    const text = await response.text();
    words = text.split("\n").map(word => word.trim()).filter(Boolean); // Split by new lines, trim, and filter empty words
    checkApiData();
  } catch (error) {
    console.error("Error loading words:", error);
    document.getElementById("results").textContent = "Error loading words file.";
  }
}

async function checkApiData() {
  if (words.length === 0) return;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching data");
    const data = await response.json();

    const wordPattern = new RegExp("\\b(" + words.join("|") + ")\\b", "gi");
    const matches = JSON.stringify(data).match(wordPattern);

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = matches
      ? `<p>Found: <ul>${matches.map(word => `<li>${word}</li>`).join("")}</ul></p>`
      : "No matching words found.";
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("results").textContent = "Error fetching API data.";
  }
}

// Load words from the text file and then check API data
loadWords();

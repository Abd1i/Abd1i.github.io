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

    const wordPattern = new RegExp(`(\\S+\\s+)?(${words.join("|")})(\\s+\\S+)?`, "gi"); // Regex to match word with one word before and after it
    const jsonResponse = JSON.stringify(data);  // Convert the entire API response to a string
    const matches = [...jsonResponse.matchAll(wordPattern)]; // Use matchAll to find all matches

    const resultsElement = document.getElementById("results");
    if (matches.length > 0) {
      // Display matches with context (before and after words)
      resultsElement.innerHTML = `<p>Found the following matches:</p><ul>` + matches.map(match => {
        const before = match[1] ? match[1].trim() : ""; // Word before the match
        const after = match[3] ? match[3].trim() : ""; // Word after the match
        return `<li>...${before} <strong>${match[2]}</strong> ${after}...</li>`;
      }).join("") + `</ul>`;
    } else {
      resultsElement.textContent = "No matching words found.";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("results").textContent = "Error fetching API data.";
  }
}

// Load words from the text file and then check API data
loadWords();

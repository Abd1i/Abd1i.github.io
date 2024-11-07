const API_URL = "https://api.tfl.gov.uk/Line/Mode/tube/Status";
let words = [];

async function loadWords() {
  try {
    const response = await fetch("words.txt");
    if (!response.ok) throw new Error("Error fetching words file");
    const text = await response.text();
    words = text.split("\n").map(word => word.trim()).filter(Boolean);
    checkApiData();
  } catch (error) {
    console.error(error);
    document.getElementById("results").textContent = "Error loading words file.";
  }
}

async function checkApiData() {
  if (!words.length) return;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching API");
    const data = await response.json();
    const rawData = JSON.stringify(data, null, 2); // Pretty print the API response

    // Display raw API response in the <pre> element
    document.getElementById("api-response").textContent = rawData;

    // Regex to find words with context (1 word before, the word itself, 1 word after)
    const wordPattern = new RegExp(`(\\S+\\s+)?(${words.join("|")})(\\s+\\S+)?`, "gi");
    const matches = [...rawData.matchAll(wordPattern)];

    const resultsElement = document.getElementById("results");
    if (matches.length > 0) {
      resultsElement.innerHTML = `<ul>` + matches.map(match => {
        const before = match[1] ? match[1].trim() : "";
        const after = match[3] ? match[3].trim() : "";
        return `<li>...${before} <strong>${match[2]}</strong> ${after}...</li>`;
      }).join("") + `</ul>`;
    } else {
      resultsElement.textContent = "No matches found.";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("results").textContent = "Error fetching data.";
  }
}

loadWords();

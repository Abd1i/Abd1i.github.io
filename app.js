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
    const data = JSON.stringify(await response.json());
    
    const wordPattern = new RegExp(`(\\S+\\s+)?(${words.join("|")})(\\s+\\S+)?`, "gi");
    const matches = [...data.matchAll(wordPattern)];

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = matches.length
      ? `<ul>${matches.map(match => `<li>...${match[1] || ""} <strong>${match[2]}</strong> ${match[3] || ""}...</li>`).join("")}</ul>`
      : "No matches found.";
  } catch (error) {
    console.error(error);
    document.getElementById("results").textContent = "Error fetching data.";
  }
}

loadWords();

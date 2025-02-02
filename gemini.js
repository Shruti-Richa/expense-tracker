const apiKey = 'AIzaSyD2DIcygUrsYdaq7fERXDaiuWE2moKgOBI'; // ***REPLACE WITH YOUR REAL API KEY***

async function generateText(prompt) {
    try {
        if (!apiKey) {
            throw new Error("Gemini API key is missing. Please update gemini.js.");
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0 || !data.candidates[0].content.parts[0].text) {
            throw new Error("Unexpected response format from Gemini API.");
        }

        const text = data.candidates[0].content.parts[0].text;
        const formattedText = formatText(text);
        return formattedText;

    } catch (error) {
        console.error("Error in generateText:", error);
        throw error;
    }
}

function formatText(text) {
    const blocks = text.split(/\*\*/);

    let formattedHTML = "";
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i].trim();
        if (block) {
            if (i % 2 === 0) { // Heading
                formattedHTML += `<h2 class="text-lg font-semibold mb-2 md:text-xl lg:text-xl">${block}</h2>`; // Adjusted font sizes
            } else { // Paragraph
                formattedHTML += `<p class="mb-4">${block}</p>`;
            }
        }
    }
    return formattedHTML;
}

export { generateText };
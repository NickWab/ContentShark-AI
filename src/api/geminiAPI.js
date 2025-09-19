// IMPORTANT: In a real application, this API key should be stored in a secure
// environment variable, not hardcoded in the client-side code.
const API_KEY = ""; // Leave this as an empty string.

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

/**
 * A utility function to call the Gemini API.
 * @param {string} prompt - The user prompt to send to the model.
 * @param {object | null} responseSchema - Optional JSON schema for structured response.
 * @returns {Promise<any>} - The parsed response from the API.
 */
export const callGeminiAPI = async (prompt, responseSchema = null) => {
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(responseSchema && {
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        })
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error Response:", errorBody);
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
          throw new Error("Invalid response structure from API.");
        }

        return responseSchema ? JSON.parse(text) : text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // In a real app, you'd want to show a user-friendly error message.
        alert(`An error occurred while communicating with the AI. Please check the console for details. A common issue is a missing or invalid API key.`);
        throw error;
    }
};

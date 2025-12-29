const API_URL = `/api/ai/generate`;

/**
 * A utility function to call the Gemini API via our backend.
 * @param {string} prompt - The user prompt to send to the model.
 * @param {object | null} responseSchema - Optional JSON schema for structured response.
 * @returns {Promise<any>} - The parsed response from the API.
 */
export const callGeminiAPI = async (prompt, responseSchema = null) => {
    // Note: responseSchema handling is simplified here for now, assuming string response from backend
    // The backend service currently returns { text: "generated content" } or similar.

    const payload = {
        prompt: prompt
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
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error || 'Unknown error'}`);
        }

        const result = await response.json();
        // The backend returns { text: "..." }
        const text = result.text;

        if (!text) {
            throw new Error("Invalid response structure from API.");
        }

        return responseSchema ? JSON.parse(text) : text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // In a real app, you'd want to show a user-friendly error message.
        alert(`An error occurred while communicating with the AI. Please ensure the backend server is running.`);
        throw error;
    }
};

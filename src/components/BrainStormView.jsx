import React, { useState } from 'react';
import { LoaderIcon, LightbulbIcon } from '../assets/icons.jsx';
import { callGeminiAPI } from '../api/geminiAPI.js';

export default function BrainstormView({ onSelectIdea }) {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        const prompt = `Brainstorm 5 creative blog post titles based on the topic: "${topic}". Return the response as a JSON array of strings. For example: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"]`;
        try {
            const response = await callGeminiAPI(prompt);
             // Basic cleanup to get to the JSON part
            const jsonString = response.substring(response.indexOf('['), response.lastIndexOf(']') + 1);
            const generatedIdeas = JSON.parse(jsonString);
            setIdeas(generatedIdeas);
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            setIdeas(["Sorry, there was an error generating ideas."]);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Brainstorm Ideas</h1>
            <p className="text-gray-400 mb-6">Enter a topic, and let the AI generate some creative blog post ideas for you.</p>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The Future of Renewable Energy"
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                    {isLoading ? (
                        <>
                            <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
                            Generating...
                        </>
                    ) : (
                         <>
                            <LightbulbIcon className="h-5 w-5 mr-2" />
                            Generate Ideas
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-4">
                {ideas.map((idea, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors"
                    >
                        <p className="text-gray-300">{idea}</p>
                        <button
                            onClick={() => onSelectIdea(idea)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-1 px-3 rounded-md transition-colors"
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}


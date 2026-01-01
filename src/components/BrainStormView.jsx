import React, { useState } from 'react';
import { LoaderIcon, LightbulbIcon } from '../assets/icons.jsx';
import { callGeminiAPI } from '../api/geminiAPI.js';

export default function BrainstormView({ onSelectIdea, projectSettings }) {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsLoading(true);
        
        // Generate structured ideas with title and description
        const prompt = `Brainstorm 5 creative blog post ideas based on the topic: "${topic}". 
        
Return the response as a JSON array of objects, each with "title" and "description" fields. The description should be 1-2 sentences explaining the article angle.

Example format:
[
  {"title": "10 Ways AI is Transforming Healthcare", "description": "Explore cutting-edge AI applications in diagnostics, treatment planning, and patient care."},
  {"title": "The Ethics of Machine Learning", "description": "A deep dive into bias, fairness, and accountability in AI systems."}
]

Return ONLY the JSON array, no additional text.`;

        try {
            const response = await callGeminiAPI(prompt);
            // Extract JSON from response
            const jsonString = response.substring(response.indexOf('['), response.lastIndexOf(']') + 1);
            const generatedIdeas = JSON.parse(jsonString);
            setIdeas(generatedIdeas);
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            setIdeas([{ title: "Error generating ideas", description: "Please try again with a different topic." }]);
        }
        setIsLoading(false);
    };

    const handleSelectIdea = (idea) => {
        // Pass structured idea object to parent
        onSelectIdea({
            title: idea.title,
            description: idea.description
        });
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
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
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
                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1 mr-4">
                                <h3 className="text-lg font-semibold text-white mb-1">{idea.title}</h3>
                                <p className="text-gray-400 text-sm">{idea.description}</p>
                            </div>
                            <button
                                onClick={() => handleSelectIdea(idea)}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-2 px-4 rounded-md transition-colors flex-shrink-0"
                            >
                                Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


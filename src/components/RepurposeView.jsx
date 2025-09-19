import React, { useState } from "react";
import { LoaderIcon, TwitterIcon, LinkedinIcon, MailIcon, ShareIcon, SparklesIcon } from "/src/assets/icons.jsx";
import { callGeminiAPI } from "/src/api/geminiAPI.js";

const SocialCard = ({ platform, icon, content, isLoading }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg flex-1 min-w-[280px]">
            <div className="flex items-center mb-3">
                {icon}
                <h3 className="font-bold ml-2">{platform}</h3>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <LoaderIcon className="animate-spin h-8 w-8 text-indigo-400" />
                </div>
            ) : (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{content}</p>
            )}
        </div>
    );
};

export default function RepurposeView({ originalDraft }) {
    const [repurposedContent, setRepurposedContent] = useState({ twitter: '', linkedin: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRepurpose = async () => {
        setIsLoading(true);
        const prompt = `Repurpose the following blog post draft into three separate pieces of content: 
        1. A concise and engaging Twitter thread (max 3 tweets).
        2. A professional LinkedIn post.
        3. A friendly and informative email newsletter.
        
        Return the response as a JSON object with keys "twitter", "linkedin", and "email".
        
        Original Draft:
        ---
        ${originalDraft}`;
        
        try {
            const response = await callGeminiAPI(prompt);
            // Basic cleanup to get to the JSON part
            const jsonString = response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1);
            const parsedContent = JSON.parse(jsonString);
            setRepurposedContent(parsedContent);
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            // Set some error state or default text if parsing fails
            setRepurposedContent({
                twitter: 'Error generating content.',
                linkedin: 'Error generating content.',
                email: 'Error generating content.'
            });
        }

        setIsLoading(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Repurpose Content</h1>
                <button
                    onClick={handleRepurpose}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    {isLoading ? 'Repurposing...' : 'Repurpose with AI'}
                </button>
            </div>

            <div className="flex flex-wrap gap-6">
                <SocialCard 
                    platform="Twitter"
                    icon={<TwitterIcon className="h-6 w-6 text-sky-400" />}
                    content={repurposedContent.twitter}
                    isLoading={isLoading}
                />
                <SocialCard 
                    platform="LinkedIn"
                    icon={<LinkedinIcon className="h-6 w-6 text-blue-500" />}
                    content={repurposedContent.linkedin}
                    isLoading={isLoading}
                />
                <SocialCard 
                    platform="Email Newsletter"
                    icon={<MailIcon className="h-6 w-6 text-green-400" />}
                    content={repurposedContent.email}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}


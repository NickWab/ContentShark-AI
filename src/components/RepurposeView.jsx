import React, { useState } from "react";
import { LoaderIcon, XIcon, LinkedinIcon, MailIcon, ShareIcon, SparklesIcon, FacebookIcon } from "/src/assets/icons.jsx";
import { callGeminiAPI } from "/src/api/geminiAPI.js";

const SocialCard = ({ platform, icon, content, isLoading, onCopy }) => {
    const isTwitter = platform === 'X (Twitter)';
    const hasContent = isTwitter ? (Array.isArray(content) && content.length > 0) : !!content;

    return (
        <div className="bg-gray-800 p-4 rounded-lg flex-1 min-w-[300px] flex flex-col border border-gray-700 h-full">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    {icon}
                    <h3 className="font-bold ml-2 text-white">{platform}</h3>
                </div>
                {!isLoading && hasContent && (
                    <button
                        onClick={() => onCopy(content)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded transition-colors"
                    >
                        Copy
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-40 flex-grow">
                    <LoaderIcon className="animate-spin h-8 w-8 text-indigo-400" />
                </div>
            ) : (
                <div className="text-gray-300 text-sm whitespace-pre-wrap flex-grow overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
                    {hasContent ? (
                        isTwitter ? (
                            <div className="space-y-4">
                                {content.map((tweet, i) => (
                                    <div key={i} className="bg-gray-900/50 p-3 rounded border border-gray-700 relative">
                                        <p>{tweet}</p>
                                        <span className="absolute top-2 right-2 text-xs text-gray-500">{i + 1}/{content.length}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>{content}</p>
                        )
                    ) : (
                        <p className="text-gray-500 italic">Content will appear here...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default function RepurposeView({ draftContent, projectSettings, showToast }) {
    const [repurposedContent, setRepurposedContent] = useState({ twitter: [], linkedin: '', facebook: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRepurpose = async () => {
        setIsLoading(true);
        const context = `
            Project Context:
            - Brand Name: ${projectSettings?.name || 'My Brand'}
            - Target Audience: ${projectSettings?.audience || 'General'}
            - Tone: ${projectSettings?.tone || 'Professional'}
        `;

        const prompt = `${context}

        Repurpose the following blog post draft into four separate pieces of content optimized for their respective platforms: 
        1. X (Twitter) Thread: Break the key points into a thread of 3-5 engaging tweets.
        2. LinkedIn Post: Professional, industry-focused, approximately 200 words. Utilize formatting.
        3. Facebook Post: Engaging, slightly more casual but informative, aiming for shares.
        4. Email Newsletter: A friendly, value-packed email introducing the topic and encouraging clicks.
        
        Return the response as a valid JSON object with keys: "twitter", "linkedin", "facebook", and "email".
        "twitter" MUST be an array of strings (one string per tweet).
        "linkedin", "facebook", and "email" should be strings.
        
        Original Draft:
        ---
        ${draftContent}`;

        try {
            const response = await callGeminiAPI(prompt);
            const jsonString = response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1);
            const parsedContent = JSON.parse(jsonString);
            setRepurposedContent({
                twitter: Array.isArray(parsedContent.twitter) ? parsedContent.twitter : [parsedContent.twitter],
                linkedin: parsedContent.linkedin || '',
                facebook: parsedContent.facebook || '',
                email: parsedContent.email || ''
            });
            if (showToast) showToast('Content repurposed successfully!', 'success');
        } catch (e) {
            console.error("Failed to parse AI response:", e);
            if (showToast) showToast('Failed to generate content. Please try again.', 'error');
        }
        setIsLoading(false);
    };

    const handleCopy = async (content) => {
        const textToCopy = Array.isArray(content) ? content.join('\n\n') : content;
        try {
            await navigator.clipboard.writeText(textToCopy);
            if (showToast) showToast('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (!draftContent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <ShareIcon className="h-16 w-16 text-gray-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-300">No content to repurpose</h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    Please go to the <strong>Draft Editor</strong> and generate a draft first. Once you have a draft, come back here to magically transform it into social media posts!
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Repurpose Content</h1>
                    <p className="text-gray-400 mt-1">Transform your draft into optimized posts for every platform.</p>
                </div>
                <button
                    onClick={handleRepurpose}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg flex items-center transition-colors shadow-lg"
                >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    {isLoading ? 'Generating magic...' : 'Repurpose with AI'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                <SocialCard
                    platform="X (Twitter)"
                    icon={<XIcon className="h-6 w-6 text-white" />}
                    content={repurposedContent.twitter}
                    isLoading={isLoading}
                    onCopy={handleCopy}
                />
                <SocialCard
                    platform="LinkedIn"
                    icon={<LinkedinIcon className="h-6 w-6 text-blue-500" />}
                    content={repurposedContent.linkedin}
                    isLoading={isLoading}
                    onCopy={handleCopy}
                />
                <SocialCard
                    platform="Facebook"
                    icon={<FacebookIcon className="h-6 w-6 text-blue-600" />}
                    content={repurposedContent.facebook}
                    isLoading={isLoading}
                    onCopy={handleCopy}
                />
                <SocialCard
                    platform="Email Newsletter"
                    icon={<MailIcon className="h-6 w-6 text-green-400" />}
                    content={repurposedContent.email}
                    isLoading={isLoading}
                    onCopy={handleCopy}
                />
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 text-center">
                <p className="text-gray-400 text-sm">
                    🚀 <strong>Coming Soon:</strong> Direct publishing to X, LinkedIn, and Facebook! For now, simply copy the generated content and post it manually.
                </p>
            </div>
        </div>
    );
}


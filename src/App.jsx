import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProjectSettingsView from './components/ProjectSettingsView.jsx';
import BrainstormView from './components/BrainstormView.jsx';
import DraftEditorView from './components/DraftEditorView.jsx';
import RepurposeView from './components/RepurposeView.jsx';
import { callGeminiAPI } from './api/geminiAPI.js';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('project'); // project, brainstorm, draft, repurpose
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [draftContent, setDraftContent] = useState(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [projectSettings, setProjectSettings] = useState({
      name: "My SaaS Project",
      topics: "Spring Boot, AI, Microservices, SaaS",
      audience: "Mid-to-Senior level software developers interested in modern backend technologies and AI integration. They are technically proficient and appreciate in-depth, practical examples.",
      tone: "Professional & Authoritative"
  });

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Reset state on logout
    setDraftContent(null);
    setSelectedIdea(null);
    setActiveView('project');
  };

  const handleSelectIdea = useCallback(async (idea) => {
    setSelectedIdea(idea);
    setActiveView('draft');
    setDraftContent(null); 
    setIsDrafting(true);

    const prompt = `
        You are a skilled content writer with a ${projectSettings.tone} tone of voice.
        Your target audience is: ${projectSettings.audience}.
        
        Write a comprehensive, well-structured blog post draft based on the following idea:
        Title: "${idea.title}"
        Description: "${idea.description}"
        
        The draft should be in Markdown format. It should have a clear introduction, body, and conclusion. Use headings, bold text, and lists where appropriate to improve readability.
    `;

    try {
        const generatedDraft = await callGeminiAPI(prompt);
        setDraftContent(generatedDraft);
    } catch (error) {
        console.error("Failed to generate draft:", error);
        setDraftContent("Failed to generate draft. Please try again.");
    } finally {
        setIsDrafting(false);
    }
  }, [projectSettings]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
        case 'project':
            return <ProjectSettingsView projectSettings={projectSettings} setProjectSettings={setProjectSettings} />;
        case 'brainstorm':
            return <BrainstormView onSelectIdea={handleSelectIdea} projectSettings={projectSettings} />;
        case 'draft':
            return <DraftEditorView selectedIdea={selectedIdea} draftContent={draftContent} isDrafting={isDrafting}/>;
        case 'repurpose':
            return <RepurposeView draftContent={draftContent} projectSettings={projectSettings} />;
        default:
            return <ProjectSettingsView projectSettings={projectSettings} setProjectSettings={setProjectSettings} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white font-sans">
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-800">
            {/* Header can go here if needed */}
            <div className="p-4">{renderActiveView()}</div>
        </main>
    </div>
  );
}



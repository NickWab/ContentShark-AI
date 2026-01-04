import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import ProjectSettingsView from './components/ProjectSettingsView.jsx';
import BrainstormView from './components/BrainstormView.jsx';
import DraftEditorView from './components/DraftEditorView.jsx';
import RepurposeView from './components/RepurposeView.jsx';
import { ToastContainer } from './components/Toast.jsx';
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

  // Toast State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Brainstorming State (Lifted)
  const [brainstormState, setBrainstormState] = useState({
    topic: '',
    ideas: [],
    isLoading: false
  });

  // Update specific brainstorm state
  const updateBrainstormState = (updates) => {
    setBrainstormState(prev => ({ ...prev, ...updates }));
  };

  // Load presets from local storage on initial render
  const [savedPresets, setSavedPresets] = useState(() => {
    const saved = localStorage.getItem('projectSettingsPresets');
    return saved ? JSON.parse(saved) : [];
  });

  // Save preset to local storage
  const savePresetsToStorage = (presets) => {
    localStorage.setItem('projectSettingsPresets', JSON.stringify(presets));
  };

  const handleSavePreset = (name) => {
    const newPreset = { ...projectSettings, id: Date.now(), presetName: name };
    const newPresets = [...savedPresets, newPreset];
    setSavedPresets(newPresets);
    savePresetsToStorage(newPresets);
    showToast(`Preset "${name}" saved!`, 'success');
  };

  const handleLoadPreset = (preset) => {
    // Exclude id and presetName when loading back into projectSettings
    const { id, presetName, ...settings } = preset;
    setProjectSettings(settings);
    showToast(`Preset "${presetName}" loaded!`, 'info');
  };

  const handleDeletePreset = (id) => {
    const newPresets = savedPresets.filter(p => p.id !== id);
    setSavedPresets(newPresets);
    savePresetsToStorage(newPresets);
    showToast('Preset deleted.', 'error');
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    // Reset state on logout
    setDraftContent(null);
    setSelectedIdea(null);
    setActiveView('project');
  };

  // Generate draft for a given idea with optional length settings
  const generateDraft = useCallback(async (idea, lengthSettings = null) => {
    setDraftContent(null);
    setIsDrafting(true);

    // Build length constraint text for prompt
    let lengthConstraint = '';
    if (lengthSettings && (lengthSettings.chars || lengthSettings.paragraphs)) {
      const constraints = [];
      if (lengthSettings.chars) {
        constraints.push(`approximately ${lengthSettings.chars} characters`);
      }
      if (lengthSettings.paragraphs) {
        constraints.push(`${lengthSettings.paragraphs} paragraphs maximum`);
      }
      lengthConstraint = `\n        IMPORTANT: Keep the post concise - target ${constraints.join(' and ')}. Focus on the key points only.`;
    }

    const prompt = `
        You are a skilled content writer with a ${projectSettings.tone} tone of voice.
        Your target audience is: ${projectSettings.audience}.
        
        Write a well-structured blog post draft based on the following idea:
        Title: "${idea.title}"
        Description: "${idea.description}"${lengthConstraint}
        
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

  // Handle selecting an idea from brainstorm view
  const handleSelectIdea = useCallback(async (idea) => {
    setSelectedIdea(idea);
    setActiveView('draft');
    await generateDraft(idea);
  }, [generateDraft]);

  // Handle regenerating the draft with the same idea (accepts length settings from DraftEditorView)
  const handleRegenerateDraft = useCallback(async (lengthSettings = null) => {
    if (selectedIdea) {
      await generateDraft(selectedIdea, lengthSettings);
    }
  }, [selectedIdea, generateDraft]);

  // Handle updating draft content when user edits
  const handleUpdateDraft = useCallback((newContent) => {
    setDraftContent(newContent);
  }, []);

  // Handle repurposing content
  const handleRepurpose = useCallback((content) => {
    setDraftContent(content);
    setActiveView('repurpose');
  }, []);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'project':
        return (
          <ProjectSettingsView
            projectSettings={projectSettings}
            setProjectSettings={setProjectSettings}
            savedPresets={savedPresets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        );
      case 'brainstorm':
        return (
          <BrainstormView
            onSelectIdea={handleSelectIdea}
            projectSettings={projectSettings}
            brainstormState={brainstormState}
            onUpdateBrainstormState={updateBrainstormState}
          />
        );
      case 'draft':
        return (
          <DraftEditorView
            selectedIdea={selectedIdea}
            draftContent={draftContent}
            isDrafting={isDrafting}
            onRegenerateDraft={handleRegenerateDraft}
            onRepurpose={handleRepurpose}
            onUpdateDraft={handleUpdateDraft}
            showToast={showToast}
          />
        );
      case 'repurpose':
        return <RepurposeView draftContent={draftContent} projectSettings={projectSettings} showToast={showToast} />;
      default:
        return (
          <ProjectSettingsView
            projectSettings={projectSettings}
            setProjectSettings={setProjectSettings}
            savedPresets={savedPresets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        );
    }
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto bg-gray-800 w-full relative">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden p-4 flex items-center border-b border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 font-bold text-lg">ContentShark AI</span>
        </div>

        <div className="p-4 md:p-8">
          {renderActiveView()}
        </div>
      </main>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

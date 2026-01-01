import React, { useState, useEffect } from 'react';
import { LoaderIcon, FileTextIcon, ShareIcon, RefreshIcon } from '/src/assets/icons.jsx';

// Length presets
const LENGTH_PRESETS = {
  full: { label: 'Full Post', chars: null, paragraphs: null },
  short: { label: 'Short Post', chars: 1500, paragraphs: 5 },
  custom: { label: 'Custom', chars: 2000, paragraphs: 6 }
};

export default function DraftEditorView({ selectedIdea, draftContent, isDrafting, onRegenerateDraft, onRepurpose, onUpdateDraft }) {
  const [editedContent, setEditedContent] = useState('');
  const [lengthPreset, setLengthPreset] = useState('full');
  const [customChars, setCustomChars] = useState(2000);
  const [customParagraphs, setCustomParagraphs] = useState(6);

  // Sync edited content with generated draft
  useEffect(() => {
    if (draftContent) {
      setEditedContent(draftContent);
    }
  }, [draftContent]);

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
    if (onUpdateDraft) {
      onUpdateDraft(e.target.value);
    }
  };

  // Get current length settings
  const getLengthSettings = () => {
    if (lengthPreset === 'custom') {
      return { chars: customChars, paragraphs: customParagraphs };
    }
    return LENGTH_PRESETS[lengthPreset];
  };

  // Handle regenerate with length settings
  const handleRegenerateWithSettings = () => {
    const settings = getLengthSettings();
    onRegenerateDraft(settings);
  };

  // Calculate paragraph count
  const paragraphCount = editedContent.split(/\n\n+/).filter(p => p.trim()).length;

  // Check if content exceeds limits
  const settings = getLengthSettings();
  const charsExceeded = settings.chars && editedContent.length > settings.chars;
  const paragraphsExceeded = settings.paragraphs && paragraphCount > settings.paragraphs;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FileTextIcon className="h-8 w-8 mr-3 text-indigo-400" />
            Draft Editor
          </h1>
          {selectedIdea && (
            <p className="text-gray-400 mt-1 text-sm">
              Drafting: <span className="text-indigo-300 font-medium">{selectedIdea.title}</span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRegenerateWithSettings}
            disabled={isDrafting}
            className="bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <RefreshIcon className="h-5 w-5 mr-2" />
            Regenerate
          </button>
          <button
            onClick={() => onRepurpose && onRepurpose(editedContent)}
            disabled={isDrafting || !editedContent}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Repurpose Content
          </button>
        </div>
      </div>

      {/* Length Controls */}
      <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-gray-300 font-medium">Post Length:</span>
          <div className="flex gap-2">
            {Object.entries(LENGTH_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setLengthPreset(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${lengthPreset === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {lengthPreset === 'custom' && (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Max Chars:</label>
                <input
                  type="number"
                  value={customChars}
                  onChange={(e) => setCustomChars(parseInt(e.target.value) || 0)}
                  className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-400 text-sm">Max Paragraphs:</label>
                <input
                  type="number"
                  value={customParagraphs}
                  onChange={(e) => setCustomParagraphs(parseInt(e.target.value) || 0)}
                  className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {lengthPreset !== 'full' && (
          <p className="text-gray-400 text-xs mt-2">
            Target: ~{settings.chars} characters, ~{settings.paragraphs} paragraphs. Click Regenerate to apply.
          </p>
        )}
      </div>

      <div className={`bg-gray-800 rounded-lg border min-h-[55vh] ${charsExceeded || paragraphsExceeded ? 'border-yellow-500' : 'border-gray-700'
        }`}>
        {isDrafting ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[55vh]">
            <LoaderIcon className="animate-spin h-12 w-12 text-indigo-400 mb-4" />
            <p className="text-gray-400">Generating your draft...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment...</p>
          </div>
        ) : (
          <textarea
            value={editedContent}
            onChange={handleContentChange}
            placeholder="Your AI-generated draft will appear here. You can edit it directly."
            className="w-full h-full min-h-[55vh] bg-transparent p-6 text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset rounded-lg font-mono text-sm leading-relaxed"
          />
        )}
      </div>

      {!isDrafting && editedContent && (
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className={charsExceeded ? 'text-yellow-400 font-medium' : 'text-gray-500'}>
              {editedContent.length} characters
              {settings.chars && ` / ${settings.chars} max`}
            </span>
            <span className={paragraphsExceeded ? 'text-yellow-400 font-medium' : 'text-gray-500'}>
              {paragraphCount} paragraphs
              {settings.paragraphs && ` / ${settings.paragraphs} max`}
            </span>
          </div>
          <span className="text-gray-500">Tip: Edit content above, then click "Repurpose Content"</span>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { LoaderIcon, FileTextIcon, ShareIcon, RefreshIcon } from '/src/assets/icons.jsx';

export default function DraftEditorView({ selectedIdea, draftContent, isDrafting, onRegenerateDraft, onRepurpose, onUpdateDraft }) {
  const [editedContent, setEditedContent] = useState('');

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
            onClick={onRegenerateDraft}
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

      <div className="bg-gray-800 rounded-lg border border-gray-700 min-h-[60vh]">
        {isDrafting ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
            <LoaderIcon className="animate-spin h-12 w-12 text-indigo-400 mb-4" />
            <p className="text-gray-400">Generating your draft...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a moment...</p>
          </div>
        ) : (
          <textarea
            value={editedContent}
            onChange={handleContentChange}
            placeholder="Your AI-generated draft will appear here. You can edit it directly."
            className="w-full h-full min-h-[60vh] bg-transparent p-6 text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset rounded-lg font-mono text-sm leading-relaxed"
          />
        )}
      </div>

      {!isDrafting && editedContent && (
        <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
          <span>{editedContent.length} characters</span>
          <span>Tip: Edit the content above, then click "Repurpose Content" to create social posts</span>
        </div>
      )}
    </div>
  );
}


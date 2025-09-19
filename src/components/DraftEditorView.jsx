import React from 'react';
import { LoaderIcon, FileTextIcon, ShareIcon } from '/src/assets/icons.jsx';

export default function DraftEditorView({ draft, onRepurpose, isLoading }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
            <FileTextIcon className="h-8 w-8 mr-3 text-indigo-400"/>
            Draft Editor
        </h1>
        <button 
          onClick={onRepurpose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <ShareIcon className="h-5 w-5 mr-2"/>
          Repurpose Content
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 min-h-[60vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh]">
            <LoaderIcon className="animate-spin h-12 w-12 text-indigo-400 mb-4" />
            <p className="text-gray-400">Generating your draft...</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white whitespace-pre-wrap">
            {draft}
          </div>
        )}
      </div>
    </div>
  );
}


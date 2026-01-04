import React from 'react';

const ProjectSettingsView = ({
    projectSettings,
    setProjectSettings,
    savedPresets = [],
    onSavePreset,
    onLoadPreset,
    onDeletePreset
}) => {
    const [newPresetName, setNewPresetName] = React.useState('');

    const handleSaveClick = () => {
        if (newPresetName.trim()) {
            onSavePreset(newPresetName);
            setNewPresetName('');
        }
    };

    return (
        <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">Project Settings</h1>
                <p className="text-gray-400 mb-8">Define your project's voice. The AI will use this context for all content generation.</p>
                <div className="max-w-2xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project Name / Brand</label>
                        <input type="text" value={projectSettings.name} onChange={e => setProjectSettings({ ...projectSettings, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Core Topics (comma-separated)</label>
                        <input type="text" value={projectSettings.topics} onChange={e => setProjectSettings({ ...projectSettings, topics: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                        <textarea rows="3" value={projectSettings.audience} onChange={e => setProjectSettings({ ...projectSettings, audience: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tone of Voice</label>
                        <select value={projectSettings.tone} onChange={e => setProjectSettings({ ...projectSettings, tone: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Professional & Authoritative</option>
                            <option>Friendly & Conversational</option>
                            <option>Technical & In-depth</option>
                            <option>Witty & Engaging</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Presets Sidebar */}
            <div className="w-full lg:w-80 bg-gray-900 p-6 rounded-xl border border-gray-700 h-fit">
                <h2 className="text-xl font-bold text-white mb-4">Saved Presets</h2>

                <div className="mb-6 space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Save Current Settings</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Preset Name"
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={handleSaveClick}
                            disabled={!newPresetName.trim()}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Your Presets</h3>
                    {savedPresets.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No settings saved yet.</p>
                    ) : (
                        savedPresets.map(preset => (
                            <div key={preset.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-white">{preset.presetName}</h4>
                                    <button
                                        onClick={() => onDeletePreset(preset.id)}
                                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Preset"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 mb-2">
                                    <span className="block truncate">Topics: {preset.topics}</span>
                                    <span className="block">Tone: {preset.tone}</span>
                                </div>
                                <button
                                    onClick={() => onLoadPreset(preset)}
                                    className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 text-indigo-400 text-xs font-medium rounded transition-colors"
                                >
                                    Load Settings
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectSettingsView;

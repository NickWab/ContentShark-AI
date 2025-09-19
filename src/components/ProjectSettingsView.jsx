import React from 'react';

const ProjectSettingsView = ({ projectSettings, setProjectSettings }) => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Project Settings</h1>
        <p className="text-gray-400 mb-8">Define your project's voice. The AI will use this context for all content generation.</p>
        <div className="max-w-2xl space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Project Name / Brand</label>
                <input type="text" value={projectSettings.name} onChange={e => setProjectSettings({...projectSettings, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Core Topics (comma-separated)</label>
                <input type="text" value={projectSettings.topics} onChange={e => setProjectSettings({...projectSettings, topics: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                <textarea rows="3" value={projectSettings.audience} onChange={e => setProjectSettings({...projectSettings, audience: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tone of Voice</label>
                <select value={projectSettings.tone} onChange={e => setProjectSettings({...projectSettings, tone: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option>Professional & Authoritative</option>
                    <option>Friendly & Conversational</option>
                    <option>Technical & In-depth</option>
                    <option>Witty & Engaging</option>
                </select>
            </div>
            <div className="pt-4">
                <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105">Save Settings</button>
            </div>
        </div>
    </div>
);

export default ProjectSettingsView;

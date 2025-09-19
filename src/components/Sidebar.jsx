import React from 'react';
import { SparklesIcon, SettingsIcon, LightbulbIcon, FileTextIcon, ShareIcon } from '../assets/icons.jsx';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'project', icon: SettingsIcon, label: 'Project Settings' },
        { id: 'brainstorm', icon: LightbulbIcon, label: 'Brainstorm Ideas' },
        { id: 'draft', icon: FileTextIcon, label: 'Draft Editor' },
        { id: 'repurpose', icon: ShareIcon, label: 'Repurpose Content' },
    ];

    return (
        <div className="flex flex-col w-64 bg-gray-900 text-gray-300">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <SparklesIcon className="w-8 h-8 text-indigo-400" />
                <span className="ml-3 text-2xl font-bold">ContentSpark</span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <a key={item.id} href="#" onClick={() => setActiveView(item.id)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                            activeView === item.id 
                            ? 'bg-indigo-600 text-white' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="ml-4 font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-800">
                 <button onClick={onLogout} className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="ml-4 font-medium">Logout</span>
                 </button>
            </div>
        </div>
    );
};

export default Sidebar;


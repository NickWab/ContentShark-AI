import React from 'react';
import { SettingsIcon, LightbulbIcon, FileTextIcon, ShareIcon } from '../assets/icons.jsx';
import ContentSharkLogo from '../assets/ContentSharkLogo.jpg';

const Sidebar = ({ activeView, setActiveView, onLogout, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { id: 'project', icon: SettingsIcon, label: 'Project Settings' },
        { id: 'brainstorm', icon: LightbulbIcon, label: 'Brainstorm Ideas' },
        { id: 'draft', icon: FileTextIcon, label: 'Draft Editor' },
        { id: 'repurpose', icon: ShareIcon, label: 'Repurpose Content' },
    ];

    const handleNavClick = (id) => {
        setActiveView(id);
        if (setIsSidebarOpen) setIsSidebarOpen(false);
    }

    return (
        <div className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-gray-300 
            transition-transform duration-300 transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 border-r border-gray-800 flex flex-col h-full
        `}>
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-800">
                <div className="flex items-center">
                    <img src={ContentSharkLogo} alt="ContentShark Logo" className="w-10 h-10 rounded-full object-cover" />
                    <span className="ml-3 text-2xl font-bold">ContentShark</span>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
                    className="md:hidden text-gray-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <a key={item.id} href="#" onClick={() => handleNavClick(item.id)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${activeView === item.id
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-gray-800'
                            }`}
                    >
                        <item.icon className="w-6 h-6 flex-shrink-0" />
                        <span className="ml-4 font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-800">
                <button onClick={onLogout} className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="ml-4 font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

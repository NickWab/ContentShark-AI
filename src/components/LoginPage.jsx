import React from 'react';
import { SparklesIcon } from '../assets/icons.jsx';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                 <SparklesIcon className="w-10 h-10 text-indigo-400" />
                 <h1 className="text-4xl font-bold tracking-tight">ContentSpark AI</h1>
            </div>
          <p className="text-gray-400">Your AI-powered content marketing assistant.</p>
        </div>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required defaultValue="demo@contentspark.ai"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required defaultValue="password"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-transform transform hover:scale-105">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


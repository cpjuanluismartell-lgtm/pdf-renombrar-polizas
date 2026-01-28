
import React from 'react';
import { FileTextIcon, BoltIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="inline-block bg-indigo-500/10 p-4 rounded-full">
                <FileTextIcon className="w-12 h-12 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-4 flex items-center justify-center gap-3 flex-wrap">
                PDF Policy Renamer
                <span className="flex items-center text-sm font-semibold text-green-400 bg-green-900/50 px-3 py-1 rounded-full">
                    <BoltIcon className="w-4 h-4 mr-2" />
                    Private &amp; Instant
                </span>
            </h1>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
                Upload your PDF policy files. They are processed instantly and securely in your browser. Then, download them all in a single ZIP file.
            </p>
        </header>
    );
};

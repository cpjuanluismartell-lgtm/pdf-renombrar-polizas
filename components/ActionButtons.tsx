
import React from 'react';
import { ArrowPathIcon, ArrowDownTrayIcon, TrashIcon } from './Icons';

interface ActionButtonsProps {
    onDownload: () => void;
    onClear: () => void;
    isProcessing: boolean;
    isZipping: boolean;
    canDownload: boolean;
    canClear: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    onDownload,
    onClear,
    isProcessing,
    isZipping,
    canDownload,
    canClear,
}) => {
    const baseButtonClasses = "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
    const secondaryButtonClasses = "text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-indigo-500";

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 min-h-[50px]">
            {isProcessing ? (
                <div className="flex items-center text-gray-400 px-6 py-3">
                    <ArrowPathIcon className="w-5 h-5 mr-3 animate-spin" />
                    Processing files...
                </div>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={onDownload}
                        disabled={!canDownload || isZipping}
                        className={`${baseButtonClasses} ${secondaryButtonClasses}`}
                    >
                        {isZipping ? (
                             <ArrowPathIcon className="w-5 h-5 mr-3 -ml-1 animate-spin" />
                        ) : (
                            <ArrowDownTrayIcon className="w-5 h-5 mr-3 -ml-1" />
                        )}
                        {isZipping ? 'Zipping...' : 'Download ZIP'}
                    </button>
                    <button
                        type="button"
                        onClick={onClear}
                        disabled={!canClear}
                        className={`${baseButtonClasses} text-red-400 bg-red-900/50 hover:bg-red-900/80 focus:ring-red-500`}
                    >
                        <TrashIcon className="w-5 h-5 mr-3 -ml-1" />
                        Clear All
                    </button>
                </>
            )}
        </div>
    );
};

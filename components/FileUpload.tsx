
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './Icons';

interface FileUploadProps {
    onFilesChange: (files: FileList | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesChange(e.dataTransfer.files);
        }
    }, [onFilesChange]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilesChange(e.target.files);
    };

    return (
        <div className="mb-6">
            <label
                htmlFor="pdf-upload"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${isDragging ? 'border-indigo-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'}`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloudIcon className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF files only</p>
                </div>
                <input id="pdf-upload" type="file" className="hidden" multiple accept=".pdf" onChange={handleFileSelect} />
            </label>
        </div>
    );
};

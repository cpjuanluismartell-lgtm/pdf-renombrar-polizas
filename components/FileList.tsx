
import React from 'react';
import { ProcessedFile, FileStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon, DocumentIcon } from './Icons';

interface FileListProps {
    files: ProcessedFile[];
}

const StatusIndicator: React.FC<{ status: FileStatus }> = ({ status }) => {
    switch (status) {
        case FileStatus.PENDING:
            return <ClockIcon className="w-5 h-5 text-gray-500" title="Pending" />;
        case FileStatus.PROCESSING:
            return <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" title="Processing" />;
        case FileStatus.SUCCESS:
            return <CheckCircleIcon className="w-5 h-5 text-green-500" title="Success" />;
        case FileStatus.ERROR:
            return <XCircleIcon className="w-5 h-5 text-red-500" title="Error" />;
        default:
            return null;
    }
};

export const FileList: React.FC<FileListProps> = ({ files }) => {
    if (files.length === 0) {
        return (
            <div className="text-center py-10 border-t border-gray-700 mt-6">
                <DocumentIcon className="w-16 h-16 mx-auto text-gray-600" />
                <p className="mt-4 text-gray-500">No files uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Uploaded Files</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Original Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">New Name</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {files.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-700/50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                       <StatusIndicator status={file.status} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300 truncate" title={file.originalName}>{file.originalName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm truncate ${file.status === FileStatus.SUCCESS && file.newName !== file.originalName ? 'text-green-400' : 'text-gray-400'}`} title={file.newName}>
                                        {file.status === FileStatus.PROCESSING ? 'Extracting name...' : file.newName}
                                    </div>
                                    {file.status === FileStatus.ERROR && (
                                        <p className="text-xs text-red-400 mt-1 truncate" title={file.errorMessage}>
                                            Error: {file.errorMessage}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { Header } from './components/Header';
import { ActionButtons } from './components/ActionButtons';
import { FileStatus, ProcessedFile } from './types';
import { renamePdfLocally } from './services/pdfProcessor';

// Configure pdf.js worker
// @ts-ignore
if (window.pdfjsLib) {
  // @ts-ignore
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}


const App: React.FC = () => {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [isZipping, setIsZipping] = useState<boolean>(false);

    const isProcessing = useMemo(() => files.some(f => f.status === FileStatus.PROCESSING || f.status === FileStatus.PENDING), [files]);

    const handleFilesChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            const newFiles: ProcessedFile[] = Array.from(selectedFiles).map(file => ({
                id: `${file.name}-${file.lastModified}`,
                originalFile: file,
                originalName: file.name,
                newName: file.name,
                status: FileStatus.PENDING,
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };
    
    const updateFileStatus = (id: string, status: FileStatus, newName?: string, errorMessage?: string) => {
        setFiles(prevFiles => prevFiles.map(f => f.id === id ? { ...f, status, newName: newName || f.newName, errorMessage } : f));
    };

    const processFile = async (file: ProcessedFile) => {
        updateFileStatus(file.id, FileStatus.PROCESSING);
        try {
            const policyName = await renamePdfLocally(file.originalFile);

            if (policyName && policyName !== 'NO_NAME_FOUND') {
                const sanitizedName = policyName.replace(/[/\\?%*:|"<>]/g, '-');
                updateFileStatus(file.id, FileStatus.SUCCESS, `${sanitizedName}.pdf`);
            } else {
                updateFileStatus(file.id, FileStatus.SUCCESS, file.originalName);
            }

        } catch (error) {
            console.error('Error processing file:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            updateFileStatus(file.id, FileStatus.ERROR, file.originalName, errorMessage);
        }
    };

    useEffect(() => {
        const filesToProcess = files.filter(f => f.status === FileStatus.PENDING);

        if (filesToProcess.length > 0) {
            const processSequentially = async () => {
                for (const file of filesToProcess) {
                    await processFile(file);
                    // Yield to the main thread to prevent the browser from becoming unresponsive
                    // when processing a large number of files.
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            };
            
            processSequentially();
        }
    }, [files]);

    const handleDownloadZip = async () => {
        // @ts-ignore
        if (!window.JSZip || !window.saveAs) {
            alert('Required libraries (JSZip, FileSaver) not loaded.');
            return;
        }

        setIsZipping(true);
        try {
            // @ts-ignore
            const zip = new window.JSZip();
            const successfullyProcessed = files.filter(f => f.status === FileStatus.SUCCESS);
            
            successfullyProcessed.forEach(file => {
                zip.file(file.newName, file.originalFile);
            });

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            // @ts-ignore
            window.saveAs(zipBlob, 'renamed_policies.zip');
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            alert('Failed to create ZIP file.');
        } finally {
            setIsZipping(false);
        }
    };

    const handleClear = () => {
        setFiles([]);
    };

    const canDownload = useMemo(() => files.length > 0 && !isProcessing && files.some(f => f.status === FileStatus.SUCCESS), [files, isProcessing]);
    const canClear = useMemo(() => files.length > 0 && !isProcessing && !isZipping, [files, isProcessing, isZipping]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <main className="container mx-auto px-4 py-8">
                <Header />
                <div className="bg-gray-800 shadow-2xl rounded-lg p-6 md:p-8 mt-8">
                    <FileUpload onFilesChange={handleFilesChange} />
                    <ActionButtons 
                        onDownload={handleDownloadZip}
                        onClear={handleClear}
                        isProcessing={isProcessing}
                        isZipping={isZipping}
                        canDownload={canDownload}
                        canClear={canClear}
                    />
                    <FileList files={files} />
                </div>
            </main>
        </div>
    );
};

export default App;


export enum FileStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export interface ProcessedFile {
    id: string;
    originalFile: File;
    originalName: string;
    newName: string;
    status: FileStatus;
    errorMessage?: string;
}

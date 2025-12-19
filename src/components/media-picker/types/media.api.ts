import { PaginationProps } from "@/api/types/pagination.types";

export interface MediaFileParams extends Partial<PaginationProps> {
    group: string; // This maps to 'group' in the backend
    search? : string;
}

export interface FolderSearchParams extends Partial<PaginationProps> {
    search?: string;
}

export interface UploadMediaProps {
    files: File[];
    group: string;
}
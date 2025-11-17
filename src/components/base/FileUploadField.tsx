import React, { forwardRef, useRef, useState } from "react";
import Label from "./Label";
import { cn } from "@/utils/helpers";
import ErrorText from "./ErrorText";
import Icon from "./Icon";

export interface FileUploadFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  allowedFileTypes?: string[]; // e.g., ['image/*', '.pdf', '.doc']
  previewHeight?: string; // e.g., '120px', '10rem'
  previewWidth?: string; // e.g., '120px', '10rem'
  filesPerRow?: number; // number of files in one row
  containerClassName?: string;
  labelClassName?: string;
  dropzoneClassName?: string;
  previewContainerClassName?: string;
  onChange?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  value?: File[];
  showPreview?: boolean;
}

const FileUploadField = forwardRef<HTMLInputElement, FileUploadFieldProps>(
  (
    {
      label,
      helperText,
      error,
      required = false,
      disabled = false,
      fullWidth = true,
      multiple = false,
      maxFileSize = 10, // 10MB default
      maxFiles = 5,
      allowedFileTypes = ['image/*', '.pdf', '.doc', '.docx', '.txt'],
      previewHeight = '120px',
      previewWidth = '120px',
      filesPerRow = 4,
      containerClassName,
      labelClassName,
      dropzoneClassName,
      previewContainerClassName,
      onChange,
      onFileRemove,
      value = [],
      showPreview = true,
      ...props
    },
    ref
  ) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>(value);
    const [dragActive, setDragActive] = useState(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith('image/')) return <Icon name="Image" className="w-8 h-8 text-body-content" />;
      if (fileType.startsWith('video/')) return <Icon name="File" className="w-8 h-8 text-body-content" />;
      if (fileType.startsWith('audio/')) return <Icon name="Music" className="w-8 h-8 text-body-content" />;
      if (fileType === 'application/pdf') return <Icon name="FileText" className="w-8 h-8 text-body-content" />;
      if (fileType.includes('zip') || fileType.includes('rar')) return <Icon name="Archive" className="w-8 h-8 text-body-content" />;
      return <Icon name="File" className="w-8 h-8 text-body-content" />;
    };

    const validateFile = (file: File): string | null => {
      // Check file size
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxFileSize) {
        return `File "${file.name}" exceeds maximum size of ${maxFileSize}MB`;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const fileType = file.type;

      const isAllowed = allowedFileTypes.some(allowedType => {
        if (allowedType.includes('*')) {
          const category = allowedType.split('/')[0];
          return fileType.startsWith(category);
        }
        return allowedType === fileExtension || allowedType === fileType;
      });

      if (!isAllowed) {
        return `File type "${fileExtension}" is not supported. Allowed types: ${allowedFileTypes.join(', ')}`;
      }

      return null;
    };

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const newFiles: File[] = [];
      const errors: string[] = [];

      const filesToProcess = Array.from(files);
      
      // Check max files limit
      if (!multiple && filesToProcess.length > 1) {
        errors.push('Only one file is allowed');
        setFileErrors(errors);
        return;
      }

      if (multiple && uploadedFiles.length + filesToProcess.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        setFileErrors(errors);
        return;
      }

      filesToProcess.forEach(file => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
        } else {
          newFiles.push(file);
        }
      });

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...uploadedFiles, ...newFiles] : newFiles;
        setUploadedFiles(updatedFiles);
        onChange?.(updatedFiles);
      }

      setFileErrors(errors);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled) return;
      handleFiles(e.target.files);
    };

    const handleRemoveFile = (index: number) => {
      const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
      onFileRemove?.(index);
      
      // Clear input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getImagePreview = (file: File): string => {
      return URL.createObjectURL(file);
    };

    const gridColsClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }[filesPerRow] || 'grid-cols-4';

    return (
      <div className={cn("space-y-2", fullWidth && "w-full", containerClassName)}>
        {label && (
          <Label required={required} className={cn("text-base-content", labelClassName)}>
            {label}
          </Label>
        )}

        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200",
            dragActive ? "border-primary bg-primary/5" : "border-input-border",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/60",
            error && "border-error",
            dropzoneClassName
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            multiple={multiple}
            disabled={disabled}
            accept={allowedFileTypes.join(',')}
            {...props}
          />

          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Icon name="Upload" className="w-10 h-10 mb-3 text-base-content opacity-60" />
            <p className="text-sm font-medium text-base-content mb-1">
              Drag & Drop or Choose file to upload
            </p>
            <p className="text-xs text-base-content opacity-70">
              {allowedFileTypes.join(', ')} • Max {maxFileSize}MB
              {multiple && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {(error || fileErrors.length > 0) && (
          <div className="space-y-1">
            {error && <ErrorText className="text-xs text-error">{error}</ErrorText>}
            {fileErrors.map((err, idx) => (
              <ErrorText key={idx} className="text-xs text-error">
                {err}
              </ErrorText>
            ))}
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <ErrorText className="text-xs text-base-content opacity-70">
            {helperText}
          </ErrorText>
        )}

        {/* File Previews */}
        {showPreview && uploadedFiles.length > 0 && (
          <div
            className={cn(
              "grid gap-4 mt-4",
              gridColsClass,
              "sm:grid-cols-2",
              `md:${gridColsClass}`,
              previewContainerClassName
            )}
          >
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group border border-input-border rounded-lg overflow-hidden bg-base-1"
                style={{ height: previewHeight }}
              >
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="absolute top-2 right-2 z-10 bg-error text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-error/90"
                  disabled={disabled}
                >
                  <Icon name="X" className="w-4 h-4 text-base-1" /> 
                </button>

                {/* Preview Content */}
                <div className="w-full h-full flex flex-col items-center justify-center p-3">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={getImagePreview(file)}
                      alt={file.name}
                      className="max-w-full max-h-[70%] object-contain rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-base-content">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  
                  <div className="mt-2 text-center w-full">
                    <p className="text-xs font-medium text-base-content truncate px-2">
                      {file.name}
                    </p>
                    <p className="text-xs text-base-content opacity-60 mt-0.5">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUploadField.displayName = "FileUploadField";

export default FileUploadField;

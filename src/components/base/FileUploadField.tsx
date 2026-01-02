import React, { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import {Label} from "./Label";
import { cn } from "@/utils/helpers";
import {ErrorText} from "./ErrorText";
import {Icon} from "./Icon";

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
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
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
      allowedFileTypes = ['image/*', '.pdf'],
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
      onBlur,
      ...props
    },
    ref
  ) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>(value);
    const [dragActive, setDragActive] = useState(false);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());
    const inputRef = useRef<HTMLInputElement>(null);
    const urlsRef = useRef<Map<File, string>>(new Map());

    // Sync with external value prop
    useEffect(() => {
      setUploadedFiles(value);
    }, [value]);

    // Create and manage blob URLs for image previews
    useEffect(() => {
      const currentUrls = urlsRef.current;
      const newUrlsMap = new Map<File, string>();

      // Create URLs for new files that don't have them
      uploadedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const existingUrl = currentUrls.get(file);
          if (existingUrl) {
            // Reuse existing URL
            newUrlsMap.set(file, existingUrl);
          } else {
            // Create new URL for new file
            const newUrl = URL.createObjectURL(file);
            newUrlsMap.set(file, newUrl);
            currentUrls.set(file, newUrl);
          }
        }
      });

      // Find and revoke URLs for removed files
      currentUrls.forEach((url, file) => {
        if (!uploadedFiles.includes(file)) {
          URL.revokeObjectURL(url);
          currentUrls.delete(file);
        }
      });

      setPreviewUrls(newUrlsMap);

      // Only cleanup on unmount, not on every render
      return () => {
        // This only runs when component unmounts
        if (uploadedFiles.length === 0) {
          currentUrls.forEach(url => URL.revokeObjectURL(url));
          currentUrls.clear();
        }
      };
    }, [uploadedFiles]);

    // Cleanup all URLs on unmount
    useEffect(() => {
      return () => {
        urlsRef.current.forEach(url => URL.revokeObjectURL(url));
        urlsRef.current.clear();
      };
    }, []);

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

    const handleFiles = useCallback((files: FileList | null) => {
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
    }, [uploadedFiles, multiple, maxFiles, onChange]);

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

    const handleRemoveFile = useCallback((index: number) => {
      const fileToRemove = uploadedFiles[index];
      
      // Revoke blob URL if exists
      const url = urlsRef.current.get(fileToRemove);
      if (url) {
        URL.revokeObjectURL(url);
        urlsRef.current.delete(fileToRemove);
      }

      const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
      onFileRemove?.(index);
      
      // Clear input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }, [uploadedFiles, onChange, onFileRemove]);

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

    const gridColsClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }[filesPerRow] || 'grid-cols-4';

    return (
      <div className={cn("space-y-2 flex flex-col pb-6", fullWidth && "w-full", containerClassName)}>
        {label && (
          <Label title={label} required={required} className={cn("text-base-content", labelClassName)}>
              {label}
            </Label>
        )}

        <div
          className={cn(
            "relative mt-auto border-2 border-dashed rounded-lg transition-all duration-200",
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
            onBlur={onBlur}
            {...props}
          />

          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Icon name="Upload" className="w-10 h-10 mb-3 text-base-content" />
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
              "md:grid-cols-4",
              previewContainerClassName
            )}
          >
            {uploadedFiles.map((file, index) => {
              const previewUrl = previewUrls.get(file);
              
              return (
                <div
                  key={`${file.name}-${index}-${file.size}`}
                  className="relative group border shadow-md border-input-border/30 rounded-lg overflow-hidden bg-base-1"
                  style={{ height: previewHeight }}
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="absolute top-2 right-2 z-10 rounded-md p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:bg-error/30 hover:scale-105"
                    disabled={disabled}
                  >
                    <Icon name="X" className="w-4 h-4 text-error" /> 
                  </button>

                  {/* Preview Content */}
                  <div className="w-full h-full flex flex-col items-center justify-center p-3">
                    {file.type.startsWith('image/') && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="max-w-full max-h-[70%] object-contain rounded"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', file.name, previewUrl);
                          // Fallback to icon if image fails
                          e.currentTarget.style.display = 'none';
                        }}
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
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

FileUploadField.displayName = "FileUploadField";

export {FileUploadField};
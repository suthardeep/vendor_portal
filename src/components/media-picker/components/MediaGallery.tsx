import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Check,
  ArrowLeft,
  FileText,
  Video,
  Image as ImageIcon,
  File as FileIcon,
  Maximize2,
  Folder,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { FolderAutocomplete } from "./FolderAutocomplete";
import { useMediaDialogStore } from "@/store/useMediaDialogStore";
import Dialog from "../../compound/Dialog";
import { Input } from "../../base/Input";
import { FileUploadField } from "../../base/FileUploadField";
import { toast } from "../../toast/Sonner";
// Import from new hooks file
import { useFoldersApi, useFilesApi, useUploadFiles } from "@/components/media-picker/api/queryHooks";
import { MediaItem } from "@/components/media-picker/types/media.types";
import { Button } from "@/components/base/Button";
import { Checkbox } from "@/components/base/Checkbox";

interface MediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: MediaItem[]) => void;
  maxFileSize?: number;
  maxFiles?: number;
}

const formatBytes = (bytes?: number | string, decimals = 2) => {
  if (!bytes) return "0 B";
  const numBytes = Number(bytes);
  if (isNaN(numBytes)) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + " " + sizes[i];
};

const FilePreviewIcon = ({ type, className }: { type?: string; className?: string }) => {
  if (type === "video") return <Video className={cn("text-primary-700", className)} />;
  if (type === "pdf") return <FileText className={cn("text-error", className)} />;
  if (type === "image") return <ImageIcon className={cn("text-primary", className)} />;
  return <FileIcon className={cn("text-gray-500", className)} />;
};

export const MediaGallery = ({
  isOpen,
  onClose,
  onConfirm,
  maxFileSize = 10 * 1024 * 1024,
  maxFiles,
}: MediaGalleryProps) => {
  const mediaDialog = useMediaDialogStore();

  // --- State ---
  const [activeTab, setActiveTab] = useState<"browser" | "upload">("browser");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Upload State
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState("");
  const [folderError, setFolderError] = useState("");

  // --- Queries ---
  const { data: folderData, isLoading: loadingFolders } = useFoldersApi(searchQuery);
  const folders = folderData?.data?.groups || [];

  const {
    data: filePages,
    isLoading: loadingFiles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilesApi({ group: currentFolder || "", search: searchQuery });

  const uploadFilesMutation = useUploadFiles();

  // --- Derived Data ---

  // Flatten files from pages
  const files = useMemo(() => {
    return filePages?.pages.flatMap((page) => page.data.data) || [];
  }, [filePages]);

  // Filter items logic
  const displayItems = useMemo(() => {
    if (currentFolder) {
      // Inside a folder: Show Files
      if (searchQuery) {
        return files.filter((item) => item.originalName.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return files;
    } else {
      // Root: Show Folders
      let items = folders;
      if (searchQuery) {
        items = items.filter((folderName) => folderName.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return items;
    }
  }, [currentFolder, files, folders, searchQuery]);

  // --- Handlers ---

  const toggleSelection = (id: string) => {
    if (!currentFolder) return;
    if (maxFiles && selection.size >= maxFiles && !selection.has(id)) return;
    const newSet = new Set(selection);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelection(newSet);
  };

  const handleSelectAll = (_: boolean) => {
    if (!currentFolder) return;

    // Respect maxFiles limit
    if (maxFiles && selection.size >= maxFiles) return;

    // We can only select what is currently loaded/visible
    const visibleIds = (displayItems as MediaItem[]).map((i) => i.id);
    const allSelected = visibleIds.every((id) => selection.has(id));
    const newSet = new Set(selection);

    if (allSelected) visibleIds.forEach((id) => newSet.delete(id));
    else {
      // If maxFiles is set, only select up to the limit
      if (maxFiles) {
        const availableSlots = maxFiles - selection.size;
        const toAdd = visibleIds.slice(0, availableSlots);
        toAdd.forEach((id) => newSet.add(id));
      } else {
        visibleIds.forEach((id) => newSet.add(id));
      }
    }
    setSelection(newSet);
  };

  const handlePreview = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.s3Url) return;
    // find index of clicked item among displayItems (only files when inside folder)
    const files = (displayItems as MediaItem[]).filter((i) => !!i && (i as any).id);
    const idx = files.findIndex((f) => f.id === item.id);

    // Build items array (filter out entries without s3Url) and preserve each item's own type
    const items = files
      .filter((f) => f.s3Url)
      .map((f) => ({
        src: f.s3Url,
        type:
          f.type === "image" || f.type === "video" || f.type === "pdf" ? (f.type as any) : ("image" as any),
        alt: f.originalName,
        title: f.originalName,
      }));

    // If clicked item not found in the current list, open dialog with clicked item first
    if (idx === -1) {
      mediaDialog.openDialog([
        { src: item.s3Url, type: item.type as any, alt: item.originalName, title: item.originalName },
        ...items,
      ]);
      return;
    }

    // Rotate items so clicked item becomes first in the preview (circular)
    const rotateIndex = items.findIndex((it) => it.src === item.s3Url);
    const start = rotateIndex >= 0 ? rotateIndex : 0;
    const ordered = [...items.slice(start), ...items.slice(0, start)];

    mediaDialog.openDialog(ordered);
  };

  const onFilesAdded = (files: File[]) => {
    const validFiles = files.filter((f) => f.size <= maxFileSize);
    setStagedFiles(validFiles);
    if (validFiles.length < files.length) {
      alert(`Some files were skipped because they exceed ${formatBytes(maxFileSize)}`);
    }
  };

  const executeUpload = async () => {
    if (!uploadFolder) {
      setFolderError("Please select or type a folder name");
      toast.error("Please select a folder first");
      return;
    }

    try {
      await uploadFilesMutation.mutateAsync({ files: stagedFiles, group: uploadFolder });
      toast.success("Upload successful");
      setStagedFiles([]);
      setUploadFolder("");
      // Switch to browser and open that folder
      setActiveTab("browser");
      setCurrentFolder(uploadFolder);
    } catch (e) {
      toast.error("Upload failed");
    }
  };

  const selectedCount = selection.size;
  const isUploading = uploadFilesMutation.isPending;
  const isLoading = currentFolder ? loadingFiles : loadingFolders;

  // Determine if "Select All" is checked
  // Note: displayItems can be strings (folders) or objects (files). casting needed.
  const currentFiles = currentFolder ? (displayItems as MediaItem[]) : [];
  const allVisible = currentFiles.length > 0 && currentFiles.every((i) => selection.has(i.id));

  return (
    <Dialog
      isOpen={isOpen}
      close={onClose}
      title="Media Manager"
      subTitle="Select an image from your gallery or upload one from your device."
      size="xl"
      actions={{
        secondary: {
          children: "Cancel",
          onClick: () => {
            setStagedFiles([]);
            onClose();
          },
        },
        primary:
          activeTab === "browser"
            ? {
                children: `Insert Selected (${selectedCount})`,
                onClick: () => {
                  const selectedItems = files.filter((f) => selection.has(f.id));
                  onConfirm(selectedItems);
                },
                disabled: selectedCount === 0,
              }
            : {
                children: isUploading
                  ? "Uploading..."
                  : `Upload ${stagedFiles.length} file${stagedFiles.length > 1 ? "s" : ""}`,
                onClick: executeUpload,
                disabled: isUploading || stagedFiles.length === 0,
                isLoading: isUploading,
                size: "md",
                className: "shadow-lg hover:shadow-xl",
                startIcon: isUploading ? "Loader2" : "Upload",
              },
      }}
    >
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="inline-flex gap-1 p-1 bg-gray-100 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("browser")}
            className={cn(
              "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:cursor-pointer",
              activeTab === "browser"
                ? "bg-white text-primary shadow-md"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 hover:cursor-pointer",
              activeTab === "upload" ? "bg-white text-primary shadow-md" : "text-gray-600 hover:text-gray-900"
            )}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-col h-[70vh]">
        {/* Browser Tab */}
        {activeTab === "browser" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header Controls */}
            <div className="space-y-4 mb-6">
              {/* Breadcrumb & Search Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {currentFolder ? (
                    <button
                      onClick={() => {
                        setCurrentFolder(null);
                        setSearchQuery("");
                        setSelection(new Set());
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="whitespace-nowrap">Back to Root</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-primary-50 to-indigo-50 rounded-lg border border-primary-100 ">
                      <FolderOpen className="w-5 h-5 text-primary " />
                      <span className="font-bold text-gray-900">Root</span>
                    </div>
                  )}
                  {currentFolder && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">/</span>
                      <span className="whitespace-nowrap font-bold text-gray-900  px-3 py-1.5 bg-gray-100 rounded-lg">
                        {currentFolder}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center justify-end gap-2 ">
                  <Input
                    leftElement={<Search className="w-4 h-4" />}
                    className="w-72 rounded-md"
                    placeholder={currentFolder ? `Search files in ${currentFolder}...` : "Search folders..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions Row (Select All only visible inside folder) */}
              {currentFolder && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    {/* <label className="flex items-center gap-2.5 cursor-pointer px-1 group"> */}
                    <Checkbox
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-all"
                      checked={allVisible}
                      required
                      label={`Select All (${currentFiles.length})`}
                      labelClassName="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors"
                      onChange={handleSelectAll}
                    />
                    {/* <span 
                      className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                        Select All ({currentFiles.length})
                      </span>
                    </label> */}
                  </div>
                </div>
              )}
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              {isLoading && !files.length ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading...</p>
                </div>
              ) : displayItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                  <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <FileIcon className="w-12 h-12 opacity-40" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {currentFolder ? "No files found" : "No folders found"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-4">
                    {currentFolder
                      ? // --- RENDER FILES ---
                        (displayItems as MediaItem[]).map((item) => {
                          const isSelected = selection.has(item.id);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleSelection(item.id)}
                              onDoubleClick={() => {
                                const selectedItems = files.filter((f) => selection.has(f.id));
                                onConfirm(selectedItems);
                              }}
                              className={cn(
                                "relative group aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-200",
                                isSelected
                                  ? "ring-4 ring-primary-500 ring-offset-2 ring-offset-white scale-95 shadow-xl"
                                  : "border-2 border-gray-200  hover:border-primary-300 shadow-md hover:shadow-xl hover:scale-105"
                              )}
                            >
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 ">
                                {item.type === "image" ? (
                                  <img
                                    src={item.s3Url}
                                    alt={item.originalName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-2 p-3">
                                    <FilePreviewIcon type={item.type} className="w-10 h-10" />
                                    <span className="text-[9px] uppercase font-bold text-gray-600 bg-gray-200  px-2.5 py-1 rounded-full">
                                      {item.type}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/50 backdrop-blur-[2px] flex items-center justify-center">
                                  <div className="bg-primary rounded-full p-3 shadow-2xl animate-in zoom-in-50 duration-200">
                                    <Check className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <p className="text-white text-[11px] font-semibold truncate">
                                  {item.originalName}
                                </p>
                                <p className="text-white/90 text-[10px] mt-0.5">
                                  {formatBytes(item.fileSize)}
                                </p>
                              </div>

                              {!isSelected && (
                                <button
                                  onClick={(e) => handlePreview(item, e)}
                                  className="absolute top-2 right-2 p-2 bg-white/95 backdrop-blur-sm border border-gray-200  text-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 hover:bg-white z-10"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      : // --- RENDER FOLDERS ---
                        (displayItems as string[]).map((folderName, idx) => (
                          <button
                            key={`${folderName}-${idx}`}
                            onClick={() => {
                              setCurrentFolder(folderName);
                              setSearchQuery("");
                            }}
                            className="group flex flex-col items-center gap-3 p-4 bg-linear-to-br from-primary-50 to-indigo-50  hover:from-primary-100 hover:to-indigo-100  border-2 border-primary-100 hover:border-primary-300 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
                          >
                            <Folder className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-200" />
                            <div className="w-full text-center">
                              <span className="text-xs font-bold text-gray-900 line-clamp-1 block">
                                {folderName}
                              </span>
                            </div>
                          </button>
                        ))}
                  </div>

                  {/* Load More Button */}
                  {currentFolder && hasNextPage && (
                    <div className="flex justify-center py-4">
                      <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        isLoading={isFetchingNextPage}
                        startIcon={isFetchingNextPage ? "Loader2" : "Plus"}
                      >
                        {/* {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />} */}
                        {isFetchingNextPage ? "Loading more..." : "Load More"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-6 mb-20">
              <div className="w-full">
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <FolderAutocomplete
                    label="Destination Folder"
                    folders={folders}
                    selectedFolder={uploadFolder}
                    onSelect={setUploadFolder}
                    placeholder="Select or type folder to upload media"
                    error={folderError}
                  />
                </div>
              </div>
              <FileUploadField
                label="Upload Files To Your Gallery"
                value={stagedFiles}
                onChange={(files) => onFilesAdded(files)}
                dropzoneClassName="h-[30dvh] flex items-center justify-center"
                previewHeight="200px"
                multiple
                maxFiles={20}
                maxFileSize={50}
                fullWidth
                required
              />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

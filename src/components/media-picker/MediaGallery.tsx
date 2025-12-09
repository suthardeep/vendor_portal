import React, { useState, useMemo } from "react";
import {
  Search,
  Trash2,
  Move,
  Check,
  ArrowLeft,
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  File as FileIcon,
  X,
  Loader2,
  FolderOpen,
  Maximize2,
  Folder,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { FolderAutocomplete } from "./FolderAutocomplete";
import { useMediaDialogStore } from "@/store/useMediaDialogStore";
import Dialog from "../compound/Dialog";
import { Dropdown } from "../base/DropDown";
import { Input } from "../base/Input";
import { Button } from "../base/Button";
import { FileUploadField } from "../base/FileUploadField";
import { Label } from "../base/Label";
import { toast } from "../toast/Sonner";

export type MediaType = "image" | "video" | "pdf" | "other";
export type ItemType = "folder" | "file";

export interface MediaItem {
  id: string;
  type: ItemType;
  mediaType?: MediaType;
  name: string;
  url?: string;
  folderId?: string | null;
  createdAt: string;
  size?: number;
}

interface MediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: MediaItem[]) => void;
  initialSelection?: MediaItem[];
  maxFileSize?: number;
  allowedTypes?: string[];
}

const formatBytes = (bytes?: number, decimals = 2) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + " " + sizes[i];
};

const getMediaType = (file: File | string): MediaType => {
  const type = typeof file === "string" ? file : file.type;
  if (type.includes("image")) return "image";
  if (type.includes("video")) return "video";
  if (type.includes("pdf")) return "pdf";
  return "other";
};

const FilePreviewIcon = ({ type, className }: { type?: MediaType; className?: string }) => {
  if (type === "video") return <Video className={cn("text-blue-500", className)} />;
  if (type === "pdf") return <FileText className={cn("text-red-500", className)} />;
  if (type === "image") return <ImageIcon className={cn("text-purple-500", className)} />;
  return <FileIcon className={cn("text-gray-500", className)} />;
};

const MOCK_FOLDERS = [
  { id: "f1", name: "Products", type: "folder" as const, createdAt: new Date().toISOString() },
  { id: "f2", name: "Documents1", type: "folder" as const, createdAt: new Date().toISOString() },
  { id: "f3", name: "Documents2", type: "folder" as const, createdAt: new Date().toISOString() },
  { id: "f4", name: "Documents3", type: "folder" as const, createdAt: new Date().toISOString() },
  { id: "f5", name: "Documents4", type: "folder" as const, createdAt: new Date().toISOString() },
  { id: "f6", name: "Documents5", type: "folder" as const, createdAt: new Date().toISOString() },
];

const MOCK_FILES: MediaItem[] = [
  {
    id: "1",
    type: "file",
    mediaType: "image",
    name: "product-1.jpg",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    createdAt: new Date().toISOString(),
    size: 2500000,
  },
  {
    id: "2",
    type: "file",
    mediaType: "video",
    name: "demo.mp4",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    createdAt: new Date().toISOString(),
    size: 15000000,
  },
  {
    id: "3",
    type: "file",
    mediaType: "pdf",
    name: "guidelines.pdf",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: new Date().toISOString(),
    size: 500000,
  },
  {
    id: "4",
    type: "file",
    mediaType: "image",
    name: "banner.png",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926",
    folderId: "f1",
    createdAt: new Date().toISOString(),
    size: 1200000,
  },
  {
    id: "5",
    type: "file",
    mediaType: "image",
    name: "hero.jpg",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    folderId: "f1",
    createdAt: new Date().toISOString(),
    size: 3200000,
  },
];

export const MediaGallery = ({
  isOpen,
  onClose,
  onConfirm,
  maxFileSize = 10 * 1024 * 1024,
}: MediaGalleryProps) => {
  const mediaDialog = useMediaDialogStore();
  const [activeTab, setActiveTab] = useState<"browser" | "upload">("browser");
  const [items, setItems] = useState<MediaItem[]>([...MOCK_FOLDERS, ...MOCK_FILES]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "size" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | MediaType>("all");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [folderError, setFolderError] = useState("");

  const currentFolder = items.find((i) => i.id === currentFolderId);

  const getFolderFileCount = (folderId: string, folderName: string) => {
    return items.filter(
      (item) => item.type === "file" && (item.folderId === folderName || item.folderId === folderId)
    ).length;
  };

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery) {
        if (currentFolderId) return item.folderId === currentFolderId && matchesSearch;
        return matchesSearch;
      }
      if (item.type === "folder") return currentFolderId === null;
      return (
        item.folderId === (currentFolder ? currentFolder.name : null) || (!item.folderId && !currentFolderId)
      );
    });

    if (filterType !== "all") {
      result = result.filter((i) => i.type === "folder" || i.mediaType === filterType);
    }

    return result.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      let compareValue = 0;
      if (sortBy === "createdAt")
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortBy === "size") compareValue = (a.size || 0) - (b.size || 0);
      else if (sortBy === "name") compareValue = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  }, [items, currentFolderId, searchQuery, sortBy, sortOrder, filterType, currentFolder]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selection);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelection(newSet);
  };

  const handleSelectAll = () => {
    const visibleFileIds = filteredItems.filter((i) => i.type === "file").map((i) => i.id);
    const allSelected = visibleFileIds.every((id) => selection.has(id));
    const newSet = new Set(selection);
    if (allSelected) visibleFileIds.forEach((id) => newSet.delete(id));
    else visibleFileIds.forEach((id) => newSet.add(id));
    setSelection(newSet);
  };

  const handlePreview = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.url) return;
    mediaDialog.openDialog([
      {
        src: item.url,
        type:
          item.mediaType === "image" || item.mediaType === "video" || item.mediaType === "pdf"
            ? item.mediaType
            : "image",
        alt: item.name,
        title: item.name,
      },
    ]);
  };

  const handleBulkDelete = () => {
    setItems((prev) => prev.filter((i) => !selection.has(i.id)));
    setSelection(new Set());
    setShowDeleteDialog(false);
  };

  const handleBulkMove = (targetFolderName: string) => {
    if (targetFolderName) {
      setItems((prev) => {
        const folderExists = prev.some((i) => i.type === "folder" && i.name === targetFolderName);
        let newItems = [...prev];
        if (!folderExists) {
          newItems.push({
            id: `folder-${Date.now()}`,
            name: targetFolderName,
            type: "folder",
            createdAt: new Date().toISOString(),
          });
        }
        return newItems.map((i) => (selection.has(i.id) ? { ...i, folderId: targetFolderName } : i));
      });
      setSelection(new Set());
      setShowMoveDialog(false);
    }
  };

  const onFilesAdded = (files: File[]) => {
    const validFiles = files.filter((f) => f.size <= maxFileSize);
    setStagedFiles((prev) => [...prev, ...validFiles]);
    if (validFiles.length < files.length) {
      alert(`Some files were skipped because they exceed ${formatBytes(maxFileSize)}`);
    }
  };

  const executeUpload = async () => {
    if (!uploadFolder) {
      setFolderError("Please select a folder first");
      toast.error("Please select a folder first");
      return
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newMedia: MediaItem[] = stagedFiles.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      type: "file",
      mediaType: getMediaType(file),
      name: file.name,
      url: URL.createObjectURL(file),
      folderId: uploadFolder || null,
      createdAt: new Date().toISOString(),
      size: file.size,
    }));

    if (uploadFolder && !items.some((i) => i.type === "folder" && i.name === uploadFolder)) {
      setItems((prev) => [
        ...prev,
        {
          id: `f-${Date.now()}`,
          name: uploadFolder,
          type: "folder",
          createdAt: new Date().toISOString(),
        },
        ...newMedia,
      ]);
    } else {
      setItems((prev) => [...prev, ...newMedia]);
    }
    setStagedFiles([]);
    setUploadFolder("");
    setIsUploading(false);
  };

  const sortOptions = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "createdAt-asc", label: "Oldest First" },
    { value: "size-desc", label: "Largest First" },
    { value: "size-asc", label: "Smallest First" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
  ];

  const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "pdf", label: "PDFs" },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field as "createdAt" | "size" | "name");
    setSortOrder(order as "asc" | "desc");
  };

  const selectedCount = selection.size;
  const visibleFilesCount = filteredItems.filter((i) => i.type === "file").length;
  const allVisible =
    visibleFilesCount > 0 && filteredItems.filter((i) => i.type === "file").every((i) => selection.has(i.id));

  return (
    <>
      <Dialog
        isOpen={isOpen}
        close={onClose}
        title="Media Manager"
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
                  onClick: () => onConfirm(items.filter((i) => selection.has(i.id))),
                  disabled: selectedCount === 0,
                }
              : {
                  children: isUploading
                    ? "Uploading..."
                    : `Upload ${stagedFiles.length} file${stagedFiles.length > 1 ? "s" : ""}`,
                  onClick: executeUpload,
                  disabled: isUploading,
                  isLoading: isUploading,
                  size: "md",
                  className: "shadow-lg hover:shadow-xl",
                  startIcon: isUploading ? "Loader2" : "Upload",
                },
        }}
      >
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-neutral-800 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab("browser")}
              className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "browser"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                activeTab === "upload"
                  ? "bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                    {currentFolderId ? (
                      <button
                        onClick={() => {
                          setCurrentFolderId(null);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="whitespace-nowrap">Back to Root</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-bold text-gray-900 dark:text-white">Root</span>
                      </div>
                    )}
                    {currentFolderId && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        <span className="font-bold text-gray-900 dark:text-white px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 rounded-lg">
                          {currentFolder?.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex items-center justify-end gap-2 ">
                    <Input
                      leftElement={<Search className="w-4 h-4" />}
                      className="w-72 rounded-md"
                      placeholder={
                        currentFolderId ? `Search in ${currentFolder?.name}...` : "Search all files..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Dropdown
                      options={filterOptions}
                      value={filterType}
                      onChange={setFilterType}
                      placeholder="Filter by type"
                      inputSize="md"
                      containerClassName=" rounded-lg my-4"
                    />
                    <Dropdown
                      options={sortOptions}
                      value={`${sortBy}-${sortOrder}`}
                      onChange={handleSortChange}
                      placeholder="Sort by"
                      inputSize="sm"
                      containerClassName=" rounded-lg my-4"
                    />
                  </div>
                </div>

                {/* Filters & Actions Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer px-1 group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                        checked={allVisible}
                        onChange={handleSelectAll}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Select All ({visibleFilesCount})
                      </span>
                    </label>
                  </div>
                  {selectedCount > 0 && (
                    <div className="flex items-center gap-2.5">
                      <Button
                        startIcon="Move"
                        variant="outline"
                        size="md"
                        onClick={() => setShowMoveDialog(true)}
                        className="shadow-sm hover:shadow-md"
                      >
                        Move ({selectedCount})
                      </Button>
                      <Button
                        startIcon="Trash2"
                        color="danger"
                        size="md"
                        onClick={() => setShowDeleteDialog(true)}
                        className="shadow-sm hover:shadow-md"
                      >
                        Delete ({selectedCount})
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grid Content */}
              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-neutral-600">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <FileIcon className="w-12 h-12 opacity-40" />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No items found</p>
                    <p className="text-sm mt-2 text-gray-500">Try adjusting your filters or search query</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-4">
                    {filteredItems.map((item) => {
                      const isSelected = selection.has(item.id);

                      if (item.type === "folder") {
                        const fileCount = getFolderFileCount(item.id, item.name);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentFolderId(item.id);
                              setSearchQuery("");
                            }}
                            className="group flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg"
                          >
                            <Folder className="w-12 h-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                            <div className="w-full text-center">
                              <span className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 block">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-1">
                                {fileCount} {fileCount === 1 ? "file" : "files"}
                              </span>
                            </div>
                          </button>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleSelection(item.id)}
                          className={cn(
                            "relative group aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-200",
                            isSelected
                              ? "ring-4 ring-blue-500 dark:ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 scale-95 shadow-xl"
                              : "border-2 border-gray-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 shadow-md hover:shadow-xl hover:scale-105"
                          )}
                        >
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                            {item.mediaType === "image" ? (
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 p-3">
                                <FilePreviewIcon type={item.mediaType} className="w-10 h-10" />
                                <span className="text-[9px] uppercase font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-neutral-700 px-2.5 py-1 rounded-full">
                                  {item.mediaType}
                                </span>
                              </div>
                            )}
                          </div>

                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/50 dark:bg-blue-500/40 backdrop-blur-[2px] flex items-center justify-center">
                              <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-3 shadow-2xl animate-in zoom-in-50 duration-200">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="text-white text-[11px] font-semibold truncate">{item.name}</p>
                            <p className="text-white/90 text-[10px] mt-0.5">{formatBytes(item.size)}</p>
                          </div>

                          {!isSelected && (
                            <button
                              onClick={(e) => handlePreview(item, e)}
                              className="absolute top-2 right-2 p-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 hover:bg-white dark:hover:bg-neutral-700 z-10"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              <div className="space-y-6 mb-20">
                <div className="w-full">
                  <div className="pt-6 border-t border-gray-200 dark:border-neutral-700 space-y-4">
                    <FolderAutocomplete
                      label="Destination Folder"
                      folders={items.filter((i) => i.type === "folder")}
                      selectedFolder={uploadFolder}
                      onSelect={setUploadFolder}
                      onCreate={setUploadFolder}
                      placeholder="Select folder to upload media"
                      error={folderError}
                    />
                  </div>
                </div>
                <FileUploadField
                  label="Upload Files To Your Gallery"
                  onChange={(files) => onFilesAdded(files)}
                  dropzoneClassName="h-[30dvh] flex items-center justify-center"
                  previewHeight="200px"
                  multiple
                  maxFiles={20}
                  maxFileSize={50}
                  fullWidth
                  required
                />

                {/* Upload Area */}
                {/* <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-neutral-800 dark:to-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300">
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
              />
              <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer p-12 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center mb-5 shadow-lg">
                  <UploadCloud className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Click to Upload Files</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 bg-white dark:bg-neutral-800 px-4 py-2 rounded-full border border-gray-200 dark:border-neutral-700">
                  Images, Videos, PDFs • Max {formatBytes(maxFileSize)}
                </p>
              </label>
            </div> */}

                {/* Staged Files */}
                {/* {stagedFiles.length > 0 && (
              <div className="space-y-5 max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Ready to Upload ({stagedFiles.length})
                  </h3>
                  <button
                    onClick={() => setStagedFiles([])}
                    className="text-sm text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium hover:underline transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-2.5">
                  {stagedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                    >
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-600 shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <FilePreviewIcon type={getMediaType(file)} className="w-7 h-7" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                          {file.name.split(".").pop()} • {formatBytes(file.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => setStagedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
            )} */}

                {/* <div className="w-full flex items-center justify-end gap-3">
                  <Button
                    onClick={executeUpload}
                    disabled={!uploadFolder || isUploading}
                    isLoading={isUploading}
                    size="md"
                    className="shadow-lg hover:shadow-xl"
                    startIcon={isUploading ? "Loader2" : "Upload"}
                  >
                    {isUploading
                      ? "Uploading..."
                      : `Upload ${stagedFiles.length} file${stagedFiles.length > 1 ? "s" : ""} to ${uploadFolder}`}
                  </Button>
                  <Button
                    onClick={executeDiscard}
                    disabled={isUploading}
                    size="md"
                    className="shadow-lg hover:shadow-xl"
                    variant="outline"
                    color="danger"
                    // startIcon={"X"}
                  >
                    Discard
                  </Button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Move Dialog */}
      <Dialog
        isOpen={showMoveDialog}
        close={() => setShowMoveDialog(false)}
        title={`Move ${selectedCount} ${selectedCount === 1 ? "File" : "Files"}`}
        size="md"
        actions={{
          secondary: { children: "Cancel", onClick: () => setShowMoveDialog(false) },
        }}
      >
        <div className="space-y-5 py-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3">
            Select a destination folder or create a new one
          </p>
          <div className="relative z-[250]">
            <FolderAutocomplete
              folders={items.filter((i) => i.type === "folder")}
              selectedFolder=""
              onSelect={handleBulkMove}
              onCreate={handleBulkMove}
              placeholder="Search or create folder..."
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        close={() => setShowDeleteDialog(false)}
        title="Confirm Deletion"
        size="sm"
        actions={{
          secondary: { children: "Cancel", onClick: () => setShowDeleteDialog(false) },
          primary: {
            children: "Delete",
            onClick: handleBulkDelete,
            color: "danger",
          },
        }}
      >
        <div className="py-2">
          <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
            <div className="shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Delete {selectedCount} {selectedCount === 1 ? "file" : "files"}?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone. The {selectedCount === 1 ? "file" : "files"} will be permanently
                removed from your media library.
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

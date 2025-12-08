import React, { useState, useMemo } from 'react';
import { 
  Search, Trash2, Move, Check, ArrowLeft, UploadCloud, 
  FileText, Video, Image as ImageIcon, File as FileIcon, 
  X, Loader2, FolderOpen, Maximize2, Folder
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { FolderAutocomplete } from './FolderAutocomplete';
import { useMediaDialogStore } from '@/store/useMediaDialogStore';
import Dialog from '../compound/Dialog';
import { Dropdown } from '../base/Dropdown';
import { Input } from '../base/Input';
import { Button } from '../base/Button';

export type MediaType = 'image' | 'video' | 'pdf' | 'other';
export type ItemType = 'folder' | 'file';

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
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals < 0 ? 0 : decimals)) + ' ' + sizes[i];
};

const getMediaType = (file: File | string): MediaType => {
  const type = typeof file === 'string' ? file : file.type;
  if (type.includes('image')) return 'image';
  if (type.includes('video')) return 'video';
  if (type.includes('pdf')) return 'pdf';
  return 'other';
};

const FilePreviewIcon = ({ type, className }: { type?: MediaType, className?: string }) => {
  if (type === 'video') return <Video className={cn("text-blue-500", className)} />;
  if (type === 'pdf') return <FileText className={cn("text-red-500", className)} />;
  if (type === 'image') return <ImageIcon className={cn("text-purple-500", className)} />;
  return <FileIcon className={cn("text-gray-500", className)} />;
};

const MOCK_FOLDERS = [
  { id: 'f1', name: 'Products', type: 'folder' as const, createdAt: new Date().toISOString() },
  { id: 'f3', name: 'Documents', type: 'folder' as const, createdAt: new Date().toISOString() },
  { id: 'f3', name: 'Documents', type: 'folder' as const, createdAt: new Date().toISOString() },
  { id: 'f4', name: 'Documents', type: 'folder' as const, createdAt: new Date().toISOString() },
  { id: 'f5', name: 'Documents', type: 'folder' as const, createdAt: new Date().toISOString() },
  { id: 'f6', name: 'Documents', type: 'folder' as const, createdAt: new Date().toISOString() },
];

const MOCK_FILES: MediaItem[] = [
  { id: '1', type: 'file', mediaType: 'image', name: 'product-1.jpg', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', createdAt: new Date().toISOString(), size: 2500000 },
  { id: '2', type: 'file', mediaType: 'video', name: 'demo.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', createdAt: new Date().toISOString(), size: 15000000 },
  { id: '3', type: 'file', mediaType: 'pdf', name: 'guidelines.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', createdAt: new Date().toISOString(), size: 500000 },
  { id: '4', type: 'file', mediaType: 'image', name: 'banner.png', url: 'https://images.unsplash.com/photo-1557683316-973673baf926', folderId: 'f1', createdAt: new Date().toISOString(), size: 1200000 },
  { id: '5', type: 'file', mediaType: 'image', name: 'hero.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', folderId: 'f1', createdAt: new Date().toISOString(), size: 3200000 },
];

export const MediaGallery = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  maxFileSize = 10 * 1024 * 1024,
}: MediaGalleryProps) => {
  const mediaDialog = useMediaDialogStore();
  const [activeTab, setActiveTab] = useState<'browser' | 'upload'>('browser');
  const [items, setItems] = useState<MediaItem[]>([...MOCK_FOLDERS, ...MOCK_FILES]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'size' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const currentFolder = items.find(i => i.id === currentFolderId);
  
  const getFolderFileCount = (folderId: string, folderName: string) => {
    return items.filter(item => 
      item.type === 'file' && (item.folderId === folderName || item.folderId === folderId)
    ).length;
  };
  
  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchQuery) {
        if (currentFolderId) return item.folderId === currentFolderId && matchesSearch;
        return matchesSearch;
      }
      if (item.type === 'folder') return currentFolderId === null;
      return item.folderId === (currentFolder ? currentFolder.name : null) || (!item.folderId && !currentFolderId);
    });

    if (filterType !== 'all') {
      result = result.filter(i => i.type === 'folder' || i.mediaType === filterType);
    }

    return result.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      let compareValue = 0;
      if (sortBy === 'createdAt') compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortBy === 'size') compareValue = (a.size || 0) - (b.size || 0);
      else if (sortBy === 'name') compareValue = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }, [items, currentFolderId, searchQuery, sortBy, sortOrder, filterType, currentFolder]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selection);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelection(newSet);
  };

  const handleSelectAll = () => {
    const visibleFileIds = filteredItems.filter(i => i.type === 'file').map(i => i.id);
    const allSelected = visibleFileIds.every(id => selection.has(id));
    const newSet = new Set(selection);
    if (allSelected) visibleFileIds.forEach(id => newSet.delete(id));
    else visibleFileIds.forEach(id => newSet.add(id));
    setSelection(newSet);
  };

  const handlePreview = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.url) return;
    mediaDialog.openDialog([{
      src: item.url,
      type: item.mediaType === 'image' || item.mediaType === 'video' || item.mediaType === 'pdf' ? item.mediaType : 'image',
      alt: item.name,
      title: item.name
    }]);
  };

  const handleBulkDelete = () => {
    setItems(prev => prev.filter(i => !selection.has(i.id)));
    setSelection(new Set());
    setShowDeleteDialog(false);
  };

  const handleBulkMove = (targetFolderName: string) => {
    if (targetFolderName) {
      setItems(prev => {
        const folderExists = prev.some(i => i.type === 'folder' && i.name === targetFolderName);
        let newItems = [...prev];
        if (!folderExists) {
          newItems.push({
            id: `folder-${Date.now()}`,
            name: targetFolderName,
            type: 'folder',
            createdAt: new Date().toISOString()
          });
        }
        return newItems.map(i => selection.has(i.id) ? { ...i, folderId: targetFolderName } : i);
      });
      setSelection(new Set());
      setShowMoveDialog(false);
    }
  };

  const onFilesAdded = (files: File[]) => {
    const validFiles = files.filter(f => f.size <= maxFileSize);
    setStagedFiles(prev => [...prev, ...validFiles]);
    if (validFiles.length < files.length) {
      alert(`Some files were skipped because they exceed ${formatBytes(maxFileSize)}`);
    }
  };

  const executeUpload = async () => {
    setIsUploading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newMedia: MediaItem[] = stagedFiles.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      type: 'file',
      mediaType: getMediaType(file),
      name: file.name,
      url: URL.createObjectURL(file),
      folderId: uploadFolder || null,
      createdAt: new Date().toISOString(),
      size: file.size
    }));

    if (uploadFolder && !items.some(i => i.type === 'folder' && i.name === uploadFolder)) {
      setItems(prev => [...prev, {
        id: `f-${Date.now()}`,
        name: uploadFolder,
        type: 'folder',
        createdAt: new Date().toISOString()
      }, ...newMedia]);
    } else {
      setItems(prev => [...prev, ...newMedia]);
    }
    setStagedFiles([]);
    setUploadFolder('');
    setIsUploading(false);
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'size-desc', label: 'Largest First' },
    { value: 'size-asc', label: 'Smallest First' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'pdf', label: 'PDFs' },
  ];

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field as 'createdAt' | 'size' | 'name');
    setSortOrder(order as 'asc' | 'desc');
  };

  const selectedCount = selection.size;
  const visibleFilesCount = filteredItems.filter(i => i.type === 'file').length;
  const allVisible = visibleFilesCount > 0 && filteredItems.filter(i => i.type === 'file').every(i => selection.has(i.id));

  return (
    <>
      <Dialog
        isOpen={isOpen}
        close={onClose}
        title={
          <div className="flex flex-col w-full pr-8">
            <span>Media Manager</span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('browser')}
                className={cn("px-4 py-1.5 text-sm font-medium rounded-lg transition-all", activeTab === 'browser' ? "bg-primary text-primary-content" : "bg-base-2 text-body-content hover:bg-base-3")}
              >
                Gallery
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={cn("px-4 py-1.5 text-sm font-medium rounded-lg transition-all", activeTab === 'upload' ? "bg-primary text-primary-content" : "bg-base-2 text-body-content hover:bg-base-3")}
              >
                Upload
              </button>
            </div>
          </div>
        }
        size="xl"
        actions={{
          secondary: { label: 'Cancel', onClick: onClose },
          primary: activeTab === 'browser' ? {
            label: `Insert Selected (${selectedCount})`,
            onClick: () => onConfirm(items.filter(i => selection.has(i.id))),
            disabled: selectedCount === 0,
          } : undefined
        }}
      >
        <div className="flex flex-col h-[70vh]">
          {activeTab === 'browser' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {currentFolderId ? (
                      <button onClick={() => { setCurrentFolderId(null); setSearchQuery(''); }} className="flex items-center gap-2 text-sm font-medium text-body-content hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-base-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Root</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-body-content px-3 py-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Root</span>
                      </div>
                    )}
                    {currentFolderId && (
                      <div className="flex items-center gap-2">
                        <span className="text-body-content/40">/</span>
                        <span className="font-semibold text-body-content">{currentFolder?.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                    {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-body-content/50" /> */}
                    <Input leftElement={<Search/>} className="input w-full pl-10 pr-4 bg-base-2 border-input-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-body-content placeholder:text-body-content/40"
                      placeholder={currentFolderId ? `Search in ${currentFolder?.name}...` : "Search all files..."}
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Dropdown options={filterOptions} value={filterType} onChange={setFilterType} placeholder="Filter by type" inputSize="sm" className="w-40" />
                      <Dropdown options={sortOptions} value={`${sortBy}-${sortOrder}`} onChange={handleSortChange} placeholder="Sort by" inputSize="sm" className="w-40" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer px-1">
                      <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={allVisible} onChange={handleSelectAll} />
                      <span className="text-sm font-medium text-body-content">Select All ({visibleFilesCount})</span>
                    </label>
                  </div>
                  {selectedCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Button startIcon='Move' variant='outline' onClick={() => setShowMoveDialog(true)}>
                        Move ({selectedCount})
                      </Button>
                      <Button startIcon='Trash2' color='danger' onClick={() => setShowDeleteDialog(true)} >
                        Delete ({selectedCount})
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-body-content/40 py-12">
                    <FileIcon className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No items found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pb-4">
                    {filteredItems.map(item => {
                      const isSelected = selection.has(item.id);
                      if (item.type === 'folder') {
                        const fileCount = getFolderFileCount(item.id, item.name);
                        return (
                          <button key={item.id} onClick={() => { setCurrentFolderId(item.id); setSearchQuery(''); }}
                            className="group flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-base-2 to-base-3 hover:from-primary/10 hover:to-primary/5 border-2 border-input-border hover:border-primary rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md">
                            <Folder className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                            <div className="w-full text-center">
                              <span className="text-xs font-semibold text-body-content line-clamp-1 block">{item.name}</span>
                              <span className="text-[10px] text-body-content/50 block mt-0.5">{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
                            </div>
                          </button>
                        );
                      }
                      return (
                        <div key={item.id} onClick={() => toggleSelection(item.id)}
                          className={cn("relative group aspect-square rounded-xl overflow-hidden cursor-pointer transition-all shadow-sm hover:shadow-lg",
                            isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-base-1" : "border-2 border-input-border hover:border-primary/50")}>
                          <div className="w-full h-full flex items-center justify-center bg-base-3">
                            {item.mediaType === 'image' ? (
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center gap-2 p-2">
                                <FilePreviewIcon type={item.mediaType} className="w-8 h-8" />
                                <span className="text-[9px] uppercase font-bold text-body-content/60 bg-base-2 px-2 py-0.5 rounded-full">{item.mediaType}</span>
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/30 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="bg-primary rounded-full p-2 shadow-lg">
                                <Check className="w-6 h-6 text-primary-content" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-[10px] font-medium truncate">{item.name}</p>
                            <p className="text-white/70 text-[9px]">{formatBytes(item.size)}</p>
                          </div>
                          {!isSelected && (
                            <button onClick={(e) => handlePreview(item, e)}
                              className="absolute -top-1.5 -right-1.5 p-1.5 bg-base-1 border-2 border-primary text-primary rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 z-10">
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
          {activeTab === 'upload' && (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-input-border rounded-2xl bg-gradient-to-br from-base-2 to-base-3 hover:border-primary hover:bg-primary/5 transition-all">
                  <input type="file" multiple className="hidden" id="file-upload" onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))} />
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer p-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <UploadCloud className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-body-content mb-1">Click to Upload Files</h3>
                    <p className="text-sm text-body-content/60">or drag and drop</p>
                    <p className="text-xs text-body-content/40 mt-3">Images, Videos, PDFs • Max {formatBytes(maxFileSize)}</p>
                  </label>
                </div>
                {stagedFiles.length > 0 && (
                  <div className="space-y-4 max-w-3xl mx-auto w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-body-content">Ready to Upload ({stagedFiles.length})</h3>
                      <button onClick={() => setStagedFiles([])} className="text-sm text-error hover:underline font-medium">Clear All</button>
                    </div>
                    <div className="space-y-2">
                      {stagedFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-base-2 border border-input-border rounded-xl hover:shadow-md transition-shadow">
                          <div className="w-14 h-14 rounded-lg bg-base-3 shrink-0 overflow-hidden flex items-center justify-center">
                            {file.type.startsWith('image/') ? (
                              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <FilePreviewIcon type={getMediaType(file)} className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-body-content truncate mb-1">{file.name}</p>
                            <p className="text-xs text-body-content/50 uppercase">{file.name.split('.').pop()} • {formatBytes(file.size)}</p>
                          </div>
                          <button onClick={() => setStagedFiles(prev => prev.filter((_, idx) => idx !== i))} 
                            className="btn btn-ghost btn-sm btn-circle text-body-content/50 hover:text-error hover:bg-error/10">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="pt-6 border-t border-input-border space-y-3">
                      <label className="text-sm font-bold text-body-content flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-primary" />Destination Folder
                      </label>
                      <FolderAutocomplete folders={items.filter(i => i.type === 'folder')} selectedFolder={uploadFolder} onSelect={setUploadFolder} onCreate={setUploadFolder} placeholder="Select folder or leave empty for root..." />
                    </div>
                    <button onClick={executeUpload} disabled={isUploading} className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl">
                      {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                      {isUploading ? 'Uploading...' : `Upload ${stagedFiles.length} file${stagedFiles.length > 1 ? 's' : ''} to ${uploadFolder || 'Root'}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Dialog>
      <Dialog isOpen={showMoveDialog} close={() => setShowMoveDialog(false)} title={`Move ${selectedCount} ${selectedCount === 1 ? 'File' : 'Files'}`} size="md"
        actions={{ secondary: { label: 'Cancel', onClick: () => setShowMoveDialog(false) } }}>
        <div className="space-y-4 p-2 pr-20 relative z-999 ">
          <p className="text-sm text-body-content/70">Select a destination folder or create a new one</p>
          <FolderAutocomplete folders={items.filter(i => i.type === 'folder')} selectedFolder="" onSelect={handleBulkMove} onCreate={handleBulkMove} placeholder="Search or create folder..." />
        </div>
      </Dialog>
      <Dialog isOpen={showDeleteDialog} close={() => setShowDeleteDialog(false)} title="Confirm Deletion" size="sm"
        actions={{ secondary: { label: 'Cancel', onClick: () => setShowDeleteDialog(false) }, primary: { label: 'Delete', onClick: handleBulkDelete, color: 'danger' } }}>
        <p className="text-body-content/80">Are you sure you want to delete {selectedCount} {selectedCount === 1 ? 'file' : 'files'}? This action cannot be undone.</p>
      </Dialog>
    </>
  );
};
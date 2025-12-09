import React, { useState, useEffect, useRef } from "react";
import { Folder, Plus, ChevronDown, Check, FolderOpen } from "lucide-react";
import { cn } from "@/utils/helpers"; // Assuming you have this
import { Label } from "../base/Label";
import { ErrorText } from "../base/ErrorText";
import { Input } from "../base/Input";
import Icon from "../base/Icon";

interface FolderAutocompleteProps {
  folders: { id: string; name: string }[];
  selectedFolder: string; // Folder Name
  onSelect: (folderName: string) => void;
  onCreate: (folderName: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

export const FolderAutocomplete: React.FC<FolderAutocompleteProps> = ({
  folders,
  selectedFolder,
  onSelect,
  onCreate,
  placeholder = "Select folder...",
  className,
  label = "Destination Folder",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedFolder);
  }, [selectedFolder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset query to selected if closed without selecting
        if (query !== selectedFolder) setQuery(selectedFolder);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, query, selectedFolder]);

  const filteredFolders = folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  const isExactMatch = folders.some((f) => f.name.toLowerCase() === query.toLowerCase());

  return (
    <div ref={wrapperRef} className={cn("relative space-y-2", className)}>
      {/* <Label required className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        {label}
      </Label> */}
      <div className="relative">
        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Folder className="h-4 w-4 text-base-content/50" />
        </div> */}
        <Input
          type="text"
          // className="w-full pl-10 pr-10 py-2.5 bg-base-1 border border-input-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base-content placeholder:text-base-content/40"
          placeholder={placeholder}
          label={label}
          value={query}
          required
          leftElement={<Icon name="Folder" className="h-4 w-4 text-base-content/50" />}
          rightElement={<Icon name="ChevronDown" className="h-4 w-4 text-base-content/50" />}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onSelect(""); // Clear selection on type
          }}
          onFocus={() => setIsOpen(true)}
          error={error}
        />
        {/* <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-4 w-4 text-base-content/50" />
        </div> */}
      </div>

      {/* {error && <ErrorText>{error}</ErrorText>} */}

      {isOpen && (
        <div className="absolute z-999 w-full mt-1 bg-base-1 border border-input-border rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => {
                onSelect(folder.name);
                setQuery(folder.name);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-base-2 cursor-pointer text-sm flex items-center gap-2 text-base-content"
            >
              <Folder className="w-4 h-4 text-primary" />
              {folder.name}
              {folder.name === selectedFolder && <Check className="ml-auto w-3 h-3 text-success" />}
            </div>
          ))}

          {query && !isExactMatch && (
            <div
              onClick={() => {
                onCreate(query);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-base-2 cursor-pointer text-sm flex items-center gap-2 text-primary border-t border-input-border"
            >
              <Plus className="w-4 h-4" />
              Create "{query}"
            </div>
          )}

          {filteredFolders.length === 0 && !query && (
            <div className="px-4 py-3 text-xs text-base-content/50 text-center">Type to search or create</div>
          )}
        </div>
      )}
    </div>
  );
};

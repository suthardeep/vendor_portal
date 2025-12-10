import React, { useState, useEffect, useRef } from "react";
import { Folder, Check } from "lucide-react";
import { cn } from "@/utils/helpers";
import { Input } from "../../base/Input";
import Icon from "../../base/Icon";

interface FolderAutocompleteProps {
  folders: string[]; // Changed to string array
  selectedFolder: string;
  onSelect: (folderName: string) => void;
  onCreate?: (folderName: string) => void; // Deprecated but kept for prop compatibility if needed
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

export const FolderAutocomplete: React.FC<FolderAutocompleteProps> = ({
  folders = [],
  selectedFolder,
  onSelect,
  placeholder = "Select or type folder name...",
  className,
  label = "Destination Folder",
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedFolder || "");
  }, [selectedFolder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // On blur, if query is not empty and different from selected, select it
        if (query && query !== selectedFolder) {
            onSelect(query);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, query, selectedFolder, onSelect]);

  // Filter folders based on query
  const filteredFolders = folders.filter((f) => 
    f.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className={cn("relative space-y-2", className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          label={label}
          value={query}
          required
          leftElement={<Icon name="Folder" className="h-4 w-4 text-base-content/50" />}
          rightElement={<Icon name="ChevronDown" className="h-4 w-4 text-base-content/50" />}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setIsOpen(true);
            onSelect(val); // Pass the typed string immediately
          }}
          onFocus={() => setIsOpen(true)}
          error={error}
        />
      </div>

      {isOpen && filteredFolders.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-base-1 border border-input-border rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredFolders.map((folderName, idx) => (
            <div
              key={`${folderName}-${idx}`}
              onClick={() => {
                onSelect(folderName);
                setQuery(folderName);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-base-2 cursor-pointer text-sm flex items-center gap-2 text-base-content"
            >
              <Folder className="w-4 h-4 text-primary" />
              {folderName}
              {folderName === selectedFolder && <Check className="ml-auto w-3 h-3 text-success" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// ============================================================================
// MEDIA DIALOG COMPONENT - Full-screen viewer
// ============================================================================

import { useMediaDialogStore } from "@/store/useMediaDialogStore";
import { useEffect, useState } from "react";
import {Icon} from "../base/Icon";

export const MediaDialog = () => {
  const { isOpen, files, currentIndex, closeDialog, nextFile, prevFile } = useMediaDialogStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeDialog();
      if (e.key === "ArrowLeft") prevFile();
      if (e.key === "ArrowRight") nextFile();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeDialog, prevFile, nextFile]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, currentIndex]);

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[currentIndex];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentFile.src;
    link.download = currentFile.title || currentFile.alt || 'download';
    link.click();
  };

  const renderMedia = () => {
    switch (currentFile.type) {
      case "image":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="Loader2" className="h-12 w-12 animate-spin text-white" />   
              </div>
            )}
            <img
              src={currentFile.src}
              alt={currentFile.alt || "Media"}
              className="max-w-[90vw] max-h-[80vh] object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        );
      case "pdf":
        return (
          <iframe
            src={currentFile.src}
            className="w-[90vw] h-[80vh]"
            title={currentFile.title || "PDF"}
          />
        );
      case "video":
        return (
          <video
            src={currentFile.src}
            controls
            autoPlay
            className="max-w-[90vw] max-h-[80vh]"
          />
        );
      default:
        return <p className="text-white">Unsupported file type</p>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-9999 bg-black/50 flex items-center justify-center"
      onClick={closeDialog}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center" >
        {/* Close button */}
        <button
          onClick={closeDialog}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <Icon name="X" className="w-6 h-6" />
        </button>

        {/* Navigation arrows */}
        {files.length > 1 && (
          <>
            <button
              onClick={(e:any) => {e.stopPropagation(); prevFile();}}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <Icon name="ChevronLeft" className="w-8 h-8" />   
            </button>
            <button
              onClick={(e:any) => {e.stopPropagation(); nextFile();}}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <Icon name="ChevronRight" className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Media content */}
        <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {renderMedia()}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
          {files.length > 1 && (
            <span className="text-white text-sm">
              {currentIndex + 1} / {files.length}
            </span>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <Icon name="Download" className="w-5 h-5" />
            <span className="text-sm">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaDialog;
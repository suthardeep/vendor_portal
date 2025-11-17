import { useState } from "react";
import FileUploadField from "./FileUploadField";

// Demo Usage
const FileUploadDemo = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">File Upload Field Demo</h1>
        
        {/* Single File Upload - Images Only */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Single Image Upload</h2>
          <FileUploadField
            label="Profile Picture"
            helperText="Upload your profile picture (JPG, PNG, GIF)"
            required
            maxFileSize={5}
            allowedFileTypes={['image/*']}
            multiple={false}
            onChange={(files) => console.log('Single image:', files)}
          />
        </div>

        {/* Multiple File Upload - All Types */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Multiple Files Upload</h2>
          <FileUploadField
            label="Project Files"
            helperText="Upload up to 5 files (images, PDFs, documents)"
            multiple
            maxFiles={5}
            maxFileSize={10}
            allowedFileTypes={['image/*', '.pdf', '.doc', '.docx', '.txt', '.zip']}
            filesPerRow={3}
            previewHeight="140px"
            previewWidth="140px"
            onChange={setFiles}
            value={files}
          />
        </div>

        {/* Document Upload Only */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Documents Only</h2>
          <FileUploadField
            label="Supporting Documents"
            required
            multiple
            maxFiles={3}
            maxFileSize={15}
            allowedFileTypes={['.pdf', '.doc', '.docx', '.txt']}
            filesPerRow={2}
            onChange={(files) => console.log('Documents:', files)}
          />
        </div>

        {/* With Error State */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">With Error</h2>
          <FileUploadField
            label="Resume"
            error="Please upload a valid PDF file"
            allowedFileTypes={['.pdf']}
            maxFileSize={2}
            onChange={(files) => console.log('Resume:', files)}
          />
        </div>
      </div>
    </div>
  );
};

export { FileUploadDemo };
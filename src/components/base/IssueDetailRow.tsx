import Icon from "./Icon";
import { useState } from "react";

interface IssueDetailsRowProps {
  issueDetails: string;
  attachmentUrl?: string;
}

export const IssueDetailsRow = ({ issueDetails, attachmentUrl }: IssueDetailsRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsTruncation = issueDetails.length > 150;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start px-4 py-4 rounded-2xl border border-base-content/20 bg-base-1 w-full">
      <div className="min-w-0 w-full overflow-hidden">
        <span className="text-sm font-medium text-base-content/70 block mb-2">Issue Details</span>
        <p className={`text-sm text-error break-words whitespace-pre-wrap ${!isExpanded && needsTruncation ? 'line-clamp-3' : ''}`}>
          {issueDetails}
        </p>
        {needsTruncation && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary mt-1 hover:underline font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      {attachmentUrl && (
        <button 
          onClick={() => window.open(attachmentUrl, '_blank')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-base-content/30 rounded-lg text-sm hover:bg-base-2 transition-colors whitespace-nowrap justify-self-end flex-shrink-0 self-start"
        >
          <Icon name="File" size={16} className="text-base-content/70" />
          View Image
        </button>
      )}
    </div>
  );
};
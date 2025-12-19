import React, { useCallback } from "react";
import { Input, InputProps } from "./Input"; // Assuming path to your provided Input
import { cn } from "@/utils/helpers"; // Assuming your helper path

// --- Types ---
export interface FieldNode {
  id: string;
  value: string;
  children?: FieldNode[];
}

export interface LevelConfig {
  label?: string;
  placeholder?: string;
  inputClassName?: string;
  rowClassName?: string;
  childrenContainerClassName?: string;
  maxItems?: number;
  actionPosition?: "left" | "right";
  inputProps?: Partial<InputProps>;
}

interface FieldTreeProps {
  data: FieldNode[];
  onChange: (data: FieldNode[]) => void;
  maxDepth: number;
  levelConfigs?: Record<number, LevelConfig>;
  defaultConfig?: LevelConfig;
  disabled?: boolean;
  _currentDepth?: number;
}

// --- Icons ---
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
);
const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const SplitIcon = ({ className }: { className?: string }) => (
  <svg className={cn("w-4 h-4", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

// --- Recursive Row Component ---
const FieldRow: React.FC<{
  node: FieldNode;
  index: number;
  level: number;
  maxDepth: number;
  levelConfigs: Record<number, LevelConfig>;
  defaultConfig: LevelConfig;
  onUpdate: (index: number, val: string) => void;
  onRemove: (index: number) => void;
  onAddChild: (index: number) => void;
  onUpdateChildren: (index: number, newChildren: FieldNode[]) => void;
  disabled?: boolean;
}> = ({
  node,
  index,
  level,
  maxDepth,
  levelConfigs,
  defaultConfig,
  onUpdate,
  onRemove,
  onAddChild,
  onUpdateChildren,
  disabled,
}) => {
  const config = levelConfigs[level] || defaultConfig;
  const nextLevelConfig = levelConfigs[level + 1] || defaultConfig;

  const canHaveChildren = level < maxDepth - 1;
  const currentChildrenCount = node.children?.length || 0;
  const maxChildren = nextLevelConfig.maxItems || Infinity;
  const hasChildren = currentChildrenCount > 0;

  // Actions Component to be passed into the Input's rightElement
  const RowActions = (
    <div className="flex items-center gap-1">
      {/* Add Sub-Item Button */}
      {canHaveChildren && (
        <button
          type="button"
          onClick={() => onAddChild(index)}
          disabled={disabled || currentChildrenCount >= maxChildren}
          className={cn(
            "p-1.5 rounded-md transition-all duration-200",
            "text-base-content/40 hover:text-primary hover:bg-primary/10",
            "disabled:opacity-20 disabled:cursor-not-allowed"
          )}
          title={`Add ${nextLevelConfig.label || "Sub-item"}`}
        >
          <SplitIcon />
        </button>
      )}

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={disabled}
        className={cn(
          "p-1.5 rounded-md transition-all duration-200",
          "text-base-content/40 hover:text-error hover:bg-error/10",
          "disabled:opacity-20"
        )}
        title="Remove"
      >
        <TrashIcon />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-1 duration-200">
      <div className={cn("relative flex items-center group", config.rowClassName)}>
        {/* Visual Connector Line for children (The little curve) */}
        {level > 0 && (
          <div className="absolute -left-6 top-1/2 w-4 h-px bg-base-content/20" />
        )}

        <div className="flex-1">
          <Input
            value={node.value}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={config.placeholder || (level === 0 ? "Category Name" : "Option Value")}
            disabled={disabled}
            // Only show label for the very first item of the root list
            label={level === 0 && index === 0 ? config.label : undefined}
            
            // Injecting actions inside the input
            rightElement={RowActions}
            rightElementClassname="pr-1"

            // Styling adjustments
            variant={level === 0 ? "filled" : "outlined"}
            className={cn(
              "transition-all duration-200",
              level === 0 ? "font-medium" : "text-sm",
              config.inputClassName
            )}
            inputWrapperClassName={cn(
               // Base-2 background makes it pop from Base-1 page background
              "bg-base-2 border-base-content/10 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20",
              level > 0 && "bg-transparent hover:bg-base-2/50" // Children are more subtle
            )}
            {...config.inputProps}
          />
        </div>
      </div>

      {/* Recursive Children Container */}
      {hasChildren && (
        <div className="flex">
           {/* The vertical tree guide line */}
          <div className="w-8 flex justify-center">
            <div className="w-px h-full bg-linear-to-b from-base-content/20 to-transparent mx-auto" />
          </div>
          
          <div className={cn("flex-1 pt-3 pb-1 space-y-3", config.childrenContainerClassName)}>
            <FieldTree
              data={node.children!}
              onChange={(newChildren) => onUpdateChildren(index, newChildren)}
              maxDepth={maxDepth}
              levelConfigs={levelConfigs}
              defaultConfig={defaultConfig}
              disabled={disabled}
              _currentDepth={level + 1}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export const FieldTree: React.FC<FieldTreeProps> = ({
  data,
  onChange,
  maxDepth,
  levelConfigs = {},
  defaultConfig = { placeholder: "Type here...", maxItems: 99 },
  disabled = false,
  _currentDepth = 0,
}) => {
  const currentConfig = levelConfigs[_currentDepth] || defaultConfig;
  const isAtLimit = data.length >= (currentConfig.maxItems || Infinity);

  // Handlers
  const handleUpdateItem = useCallback((index: number, val: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], value: val };
    onChange(newData);
  }, [data, onChange]);

  const handleRemoveItem = useCallback((index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  }, [data, onChange]);

  const handleAddItem = useCallback(() => {
    if (isAtLimit) return;
    const newItem: FieldNode = { id: crypto.randomUUID(), value: "", children: [] };
    onChange([...data, newItem]);
  }, [data, onChange, isAtLimit]);

  const handleAddChild = useCallback((parentIndex: number) => {
    const newData = [...data];
    const parent = newData[parentIndex];
    const currentChildren = parent.children || [];
    
    const nextLevelConfig = levelConfigs[_currentDepth + 1] || defaultConfig;
    if (currentChildren.length >= (nextLevelConfig.maxItems || Infinity)) return;

    const newChild: FieldNode = { id: crypto.randomUUID(), value: "", children: [] };
    newData[parentIndex] = { ...parent, children: [...currentChildren, newChild] };
    onChange(newData);
  }, [data, onChange, levelConfigs, _currentDepth, defaultConfig]);

  const handleUpdateChildren = useCallback((parentIndex: number, newChildren: FieldNode[]) => {
    const newData = [...data];
    newData[parentIndex] = { ...newData[parentIndex], children: newChildren };
    onChange(newData);
  }, [data, onChange]);

  return (
    <div className="flex flex-col gap-3 w-full">
      {data.map((node, index) => (
        <FieldRow
          key={node.id}
          node={node}
          index={index}
          level={_currentDepth}
          maxDepth={maxDepth}
          levelConfigs={levelConfigs}
          defaultConfig={defaultConfig}
          onUpdate={handleUpdateItem}
          onRemove={handleRemoveItem}
          onAddChild={handleAddChild}
          onUpdateChildren={handleUpdateChildren}
          disabled={disabled}
        />
      ))}

      {/* Add Sibling Button (Dashed style for "New Item" pattern) */}
      {!isAtLimit && (
        <button
          type="button"
          onClick={handleAddItem}
          disabled={disabled}
          className={cn(
            "group flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed",
            "border-base-content/20 hover:border-primary/50 hover:bg-primary/5",
            "transition-all duration-200 mt-1",
            currentConfig.actionPosition === "right" ? "w-auto self-end px-4" : ""
          )}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded bg-base-content/10 group-hover:bg-primary group-hover:text-black transition-colors">
            <PlusIcon className="w-3 h-3 text-base-content group-hover:text-black" />
          </div>
          <span className="text-sm font-medium text-base-content/60 group-hover:text-primary">
            Add {currentConfig.placeholder || "Item"}
          </span>
        </button>
      )}
    </div>
  );
};

export default FieldTree;
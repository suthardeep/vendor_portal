import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { cn } from "@/utils/helpers";
import Label from "@/components/base/Label";
import ErrorText from "@/components/base/ErrorText";

const extensions = [
  TextStyleKit,
  Underline,
  StarterKit.configure({
    orderedList: {},
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Write something...",
    emptyEditorClass: "is-editor-empty",
  }),
];

const TextEditor: React.FC<TextEditorProps> = (props) => {
  const { value, onChange, classname, error, helperText, label, required } =
    props;
  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
  });
  return (
    <div className={cn(classname)}>
      {label && (
        <Label required={required} className="mb-1">
          {" "}
          {label}{" "}
        </Label>
      )}
      <div
        className={cn(
          "border-nl-200 dark:border-nd-500 dark:bg-nd-800 overflow-hidden rounded-xl border bg-white",
        )}
      >
        <MenuBar editor={editor} />
        <div
          onClick={() => editor?.chain().focus().run()}
          className="cursor-text"
        >
          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose dark:prose-invert dark:text-nd-100 min-h-[200px] max-w-none px-4 py-3 focus:outline-none [&>:first-child]:outline-none"
          />
        </div>
      </div>
      {(helperText || error) && (
        <ErrorText
          className={
            error
              ? "text-dl-500 dark:text-dd-500"
              : "text-nl-500 dark:text-nd-300"
          }
        >
          {error || helperText}
        </ErrorText>
      )}
    </div>
  );
};

export default TextEditor;

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  classname?: string;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

import { Editor, useEditorState } from "@tiptap/react";
import { MenuButton } from "./MenuButton"; // Import your reusable button
import Divider from "@/components/base/Divider";
import { Popover } from "../Popover";
import MenuItem from "../MenuItem";
import "../../../styles/textEditor.css";

interface MenuBarProps {
  editor: Editor;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold") ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive("italic") ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor.isActive("strike") ?? false,
      canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
      isUnderline: ctx.editor.isActive("underline") ?? false,
      canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
      isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
      isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
      isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
      isParagraph: ctx.editor.isActive("paragraph") ?? false,
      isBulletList: ctx.editor.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor.isActive("orderedList") ?? false,
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }) ?? false,
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,
    }),
  });

  return (
    <div className="dark:bg-nd-800 border-nl-200 dark:border-nd-500 flex flex-wrap items-center gap-2 border-b bg-white p-1.5">
      {/* Text Styles */}
      <>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          active={editorState.isBold}
          icon={"Bold"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          active={editorState.isItalic}
          icon={"Italic"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          active={editorState.isStrike}
          icon={"Strikethrough"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState.canUnderline}
          active={editorState.isUnderline}
          icon={"Underline"}
        />
      </>
      <Divider vertical className="mx-2 h-6" />

      {/* Headings */}
      <>
        <Popover trigger={<MenuButton icon={"Heading"} />}>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            startIcon="Heading1"
            selected={editorState.isHeading1}
          >
            Heading 1
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            startIcon="Heading2"
            selected={editorState.isHeading2}
          >
            Heading 2
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            startIcon="Heading3"
            selected={editorState.isHeading3}
          >
            Heading 3
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            startIcon="Heading4"
            selected={editorState.isHeading4}
          >
            Heading 4
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            startIcon="Heading5"
            selected={editorState.isHeading5}
          >
            Heading 5
          </MenuItem>
          <MenuItem
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            startIcon="Heading6"
            selected={editorState.isHeading6}
          >
            Heading 6
          </MenuItem>
          <MenuItem
            onClick={() => editor.chain().focus().setParagraph().run()}
            startIcon="Type"
            selected={editorState.isParagraph}
          >
            Paragraph
          </MenuItem>
        </Popover>
      </>
      <Divider vertical className="mx-2 h-6" />

      {/* Lists */}
      <>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editorState.isBulletList}
          icon={"List"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editorState.isOrderedList}
          icon={"ListOrdered"}
        />
      </>
      <Divider vertical className="mx-2 h-6" />

      {/* Alignments */}
      <>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editorState.isAlignLeft}
          icon={"AlignLeft"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editorState.isAlignCenter}
          icon={"AlignCenter"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editorState.isAlignRight}
          icon={"AlignRight"}
        />
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editorState.isAlignJustify}
          icon={"AlignJustify"}
        />
      </>
      <Divider vertical className="mx-2 h-6" />

      {/* Other Controls */}
      <>
        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={"Minus"}
          label="HR"
        />
        <MenuButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          icon={"CornerDownLeft"}
        />
      </>
      <Divider vertical className="mx-2 h-6" />

      {/* Undo / Redo */}
      <>
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={"Undo2"}
          disabled={!editorState.canUndo}
        />
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={"Redo2"}
          disabled={!editorState.canRedo}
        />
      </>
    </div>
  );
};

export default MenuBar;

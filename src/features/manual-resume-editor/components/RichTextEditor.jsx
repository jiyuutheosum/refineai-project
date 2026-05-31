/**
 * RichTextEditor.jsx
 * Reusable Tiptap-based rich text editor with formatting toolbar.
 * Stores content as HTML string, compatible with TemplatePreview.
 */
import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Icon from '@/shared/components/AppIcon'

function ToolbarButton({ onClick, active, disabled, iconName, title }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault() // prevent editor losing focus
        onClick()
      }}
      disabled={disabled}
      title={title}
      className={`
        flex items-center justify-center w-7 h-7 rounded text-xs transition-colors
        ${active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon name={iconName} size={13} />
    </button>
  )
}

function RichTextEditor({ value, onChange, placeholder = 'Start typing...', minHeight = 160 }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Keep heading disabled — resumes don't need h1/h2 inside fields
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none before:float-left before:h-0',
      }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      // Return empty string instead of empty paragraph HTML
      const html = editor.isEmpty ? '' : editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
    },
  })

  // Sync external value changes (e.g. when pre-fill fires from useEffect)
  useEffect(() => {
    if (!editor) return
    const current = editor.isEmpty ? '' : editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-ring transition overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/40 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          iconName="Bold"
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          iconName="Italic"
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          iconName="Underline"
          title="Underline"
        />

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          iconName="List"
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          iconName="ListOrdered"
          title="Numbered List"
        />

        <div className="w-px h-4 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          iconName="Undo2"
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          iconName="Redo2"
          title="Redo"
        />
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{ minHeight }}
        className={`
          px-4 py-3 text-sm text-foreground leading-6
          [&_.tiptap]:outline-none
          [&_.tiptap]:min-h-[inherit]
          [&_.tiptap_ul]:list-disc
          [&_.tiptap_ul]:pl-5
          [&_.tiptap_ul]:space-y-0.5
          [&_.tiptap_ol]:list-decimal
          [&_.tiptap_ol]:pl-5
          [&_.tiptap_ol]:space-y-0.5
          [&_.tiptap_strong]:font-semibold
          [&_.tiptap_em]:italic
          [&_.tiptap_u]:underline
          [&_.tiptap_p]:mb-1
          [&_.tiptap_p:last-child]:mb-0
          [&_.tiptap_li_p]:mb-0
        `}
      />
    </div>
  )
}

export default RichTextEditor
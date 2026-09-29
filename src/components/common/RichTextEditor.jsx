import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Strikethrough, Underline } from 'lucide-react'
import { useRef } from 'react'

export const RichTextEditor = ({ label, value, onChange, placeholder, error }) => {
    const editorRef = useRef(null)

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const addLink = () => {
        const url = prompt('Enter URL:')
        if (url) execCommand('createLink', url)
    }

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {label}
                </label>
            )}
            <div className="border border-line bg-main focus-within:border-content transition-colors">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-line bg-content/5 text-content">
                    <button type="button" onClick={() => execCommand('bold')} className="p-1 hover:bg-content/10 rounded" title="Bold">
                        <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => execCommand('italic')} className="p-1 hover:bg-content/10 rounded" title="Italic">
                        <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => execCommand('underline')} className="p-1 hover:bg-content/10 rounded" title="Underline">
                        <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => execCommand('strikeThrough')} className="p-1 hover:bg-content/10 rounded" title="Strikethrough">
                        <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-px h-4 bg-line mx-1" />
                    <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1 hover:bg-content/10 rounded" title="Bullet List">
                        <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1 hover:bg-content/10 rounded" title="Numbered List">
                        <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-px h-4 bg-line mx-1" />
                    <button type="button" onClick={addLink} className="p-1 hover:bg-content/10 rounded" title="Insert Link">
                        <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Editable Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: value || '' }}
                    onInput={(e) => onChange(e.currentTarget.innerHTML)}
                    data-placeholder={placeholder}
                    className="p-3 min-h-[100px] max-h-[250px] overflow-y-auto text-xs font-mono text-content focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted/50 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline"
                />
            </div>
            {error && <p className="text-[10px] font-mono text-red-500 mt-1">{error}</p>}
        </div>
    )
}
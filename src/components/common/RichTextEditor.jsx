import { Bold, Check, Italic, Link as LinkIcon, List, ListOrdered, Strikethrough, Underline, Unlink, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const RichText = ({ html, className = '' }) => {
    if (!html) return null

    return (
        <div
            dir="ltr"
            className={`text-left dir-ltr leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline [&_b]:font-bold [&_strong]:font-bold ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

export const RichTextEditor = ({ label, value, onChange, placeholder, error }) => {
    const editorRef = useRef(null)
    const savedRangeRef = useRef(null)
    const linkInputRef = useRef(null)

    const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    // Sync external value with editor HTML without breaking cursor position
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== (value || '')) {
            editorRef.current.innerHTML = value || ''
        }
    }, [value])

    // Auto-focus input when popover opens
    useEffect(() => {
        if (isLinkPopoverOpen && linkInputRef.current) {
            linkInputRef.current.focus()
        }
    }, [isLinkPopoverOpen])

    const execCommand = (command, val = null) => {
        document.execCommand(command, false, val)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const handleOpenLinkPopover = () => {
        // Save current selection before focus shifts to input
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            savedRangeRef.current = selection.getRangeAt(0)
        }
        setLinkUrl('')
        setIsLinkPopoverOpen(true)
    }

    const restoreSelection = () => {
        if (editorRef.current) {
            editorRef.current.focus()
            if (savedRangeRef.current) {
                const selection = window.getSelection()
                selection.removeAllRanges()
                selection.addRange(savedRangeRef.current)
            }
        }
    }

    const handleApplyLink = (e) => {
        if (e) e.preventDefault()

        let formattedUrl = linkUrl.trim()
        if (!formattedUrl) {
            setIsLinkPopoverOpen(false)
            return
        }

        // Default to https:// if protocol is omitted
        if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('mailto:')) {
            formattedUrl = `https://${formattedUrl}`
        }

        restoreSelection()

        const selection = window.getSelection()
        if (selection && selection.isCollapsed) {
            // No selection: insert URL as anchor text
            execCommand('insertHTML', `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${formattedUrl}</a>`)
        } else {
            // Selection exists: convert highlighted text to link
            execCommand('createLink', formattedUrl)
        }

        setIsLinkPopoverOpen(false)
        setLinkUrl('')
    }

    const handleUnlink = () => {
        restoreSelection()
        execCommand('unlink')
        setIsLinkPopoverOpen(false)
    }

    const handleKeyDownPopover = (e) => {
        if (e.key === 'Enter') {
            handleApplyLink(e)
        } else if (e.key === 'Escape') {
            setIsLinkPopoverOpen(false)
        }
    }

    const handleEditorKeyDown = (e) => {
        // Catch Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault()
            handleOpenLinkPopover()
        }
    }

    return (
        <div className="space-y-1.5 w-full relative">
            {label && (
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {label}
                </label>
            )}
            <div className="border border-line bg-main focus-within:border-content transition-colors relative">
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
                    <button
                        type="button"
                        onClick={handleOpenLinkPopover}
                        className={`p-1 hover:bg-content/10 rounded transition-colors ${isLinkPopoverOpen ? 'bg-content/15 text-accent' : ''}`}
                        title="Insert Link (Ctrl+K / ⌘K)"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Google Workspace Floating Link Popover */}
                {isLinkPopoverOpen && (
                    <div className="absolute top-10 left-2 right-2 z-20 p-2 bg-main border border-line shadow-xl rounded flex items-center gap-2 animate-in fade-in duration-150">
                        <LinkIcon className="w-4 h-4 text-muted shrink-0 mx-1" />
                        <input
                            ref={linkInputRef}
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={handleKeyDownPopover}
                            placeholder="Paste link or search (e.g. https://...)"
                            className="flex-1 bg-content/5 border border-line px-2.5 py-1 text-xs font-mono text-content focus:outline-none focus:border-accent rounded"
                        />
                        <button
                            type="button"
                            onClick={handleApplyLink}
                            disabled={!linkUrl.trim()}
                            className="px-2.5 py-1 bg-accent text-white text-xs font-mono rounded hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={handleUnlink}
                            className="p-1 text-muted hover:text-red-500 hover:bg-content/10 rounded transition-colors"
                            title="Remove link"
                        >
                            <Unlink className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLinkPopoverOpen(false)}
                            className="p-1 text-muted hover:text-content hover:bg-content/10 rounded transition-colors"
                            title="Cancel"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Editable Area */}
                <div
                    ref={editorRef}
                    dir="ltr"
                    contentEditable
                    onInput={(e) => onChange(e.currentTarget.innerHTML)}
                    onKeyDown={handleEditorKeyDown}
                    data-placeholder={placeholder}
                    className="text-left dir-ltr p-3 min-h-[100px] max-h-[250px] overflow-y-auto text-xs font-mono text-content focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted/50 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-accent [&_a]:underline"
                />
            </div>
            {error && <p className="text-[10px] font-mono text-red-500 mt-1">{error}</p>}
        </div>
    )
}

export default RichTextEditor
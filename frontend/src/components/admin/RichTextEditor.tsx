'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  Table,
  Type,
} from 'lucide-react';
import { Button, cx } from '@/components/ui';

type ToolbarAction =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'bullet'
  | 'numbered'
  | 'quote'
  | 'link'
  | 'image'
  | 'table'
  | 'hr'
  | 'align-left'
  | 'align-center'
  | 'align-right'
  | 'align-justify';

type ActiveMarks = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  bullet: boolean;
  numbered: boolean;
};

const EMPTY_MARKS: ActiveMarks = {
  bold: false,
  italic: false,
  underline: false,
  bullet: false,
  numbered: false,
};

function isBlankHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim() === '';
}

function clipboardHtml(event: React.ClipboardEvent) {
  const html = event.clipboardData.getData('text/html');
  if (!html) return '';
  const fragment = html.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/i);
  return (fragment ? fragment[1] : html).trim();
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function formatBlock(tag: string) {
  exec('formatBlock', tag);
  if (document.queryCommandValue('formatBlock').toLowerCase() !== tag) {
    exec('formatBlock', `<${tag}>`);
  }
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);
  const savedRange = useRef<Range | null>(null);
  const [empty, setEmpty] = useState(() => isBlankHtml(value));
  const [marks, setMarks] = useState<ActiveMarks>(EMPTY_MARKS);

  type ToolbarItem = { id: ToolbarAction; label: string; icon?: React.ElementType; active?: boolean };

  const groups = useMemo(
    () => [
      [
        { id: 'paragraph', label: 'Normal', icon: Type },
        { id: 'h1', label: 'Title', icon: Heading1 },
        { id: 'h2', label: 'Heading', icon: Heading2 },
        { id: 'h3', label: 'Subheading', icon: Heading3 },
      ],
      [
        { id: 'bold', label: 'Bold', active: marks.bold },
        { id: 'italic', label: 'Italic', active: marks.italic },
        { id: 'underline', label: 'Underline', active: marks.underline },
      ],
      [
        { id: 'bullet', label: 'Bullets', icon: List, active: marks.bullet },
        { id: 'numbered', label: 'Numbering', icon: ListOrdered, active: marks.numbered },
        { id: 'quote', label: 'Quote', icon: MessageSquareQuote },
      ],
      [
        { id: 'link', label: 'Link', icon: LinkIcon },
        { id: 'image', label: 'Picture', icon: ImageIcon },
        { id: 'table', label: 'Table', icon: Table },
        { id: 'hr', label: 'Line', icon: Minus },
      ],
      [
        { id: 'align-left', label: 'Align left', icon: AlignLeft },
        { id: 'align-center', label: 'Center', icon: AlignCenter },
        { id: 'align-right', label: 'Align right', icon: AlignRight },
        { id: 'align-justify', label: 'Justify', icon: AlignJustify },
      ],
    ] satisfies ToolbarItem[][],
    [marks],
  );

  const rememberSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const node = selection.anchorNode;
    if (!node || !editorRef.current?.contains(node)) return;
    savedRange.current = selection.getRangeAt(0).cloneRange();
  }, []);

  const restoreSelection = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (!selection) return;
    if (savedRange.current) {
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const emit = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    lastHtml.current = html;
    setEmpty(isBlankHtml(html));
    onChange(html);
  }, [onChange]);

  const refreshMarks = useCallback(() => {
    if (typeof document === 'undefined' || !document.queryCommandState) return;
    setMarks({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      bullet: document.queryCommandState('insertUnorderedList'),
      numbered: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (value === lastHtml.current) return;
    editor.innerHTML = value || '';
    lastHtml.current = value || '';
    setEmpty(isBlankHtml(value || ''));
  }, [value]);

  useEffect(() => {
    const onSelectionChange = () => {
      rememberSelection();
      refreshMarks();
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [refreshMarks, rememberSelection]);

  const apply = (action: ToolbarAction) => {
    if (disabled) return;
    restoreSelection();

    switch (action) {
      case 'paragraph':
        formatBlock('p');
        break;
      case 'h1':
      case 'h2':
      case 'h3':
        formatBlock(action);
        break;
      case 'bold':
        exec('bold');
        break;
      case 'italic':
        exec('italic');
        break;
      case 'underline':
        exec('underline');
        break;
      case 'bullet':
        exec('insertUnorderedList');
        break;
      case 'numbered':
        exec('insertOrderedList');
        break;
      case 'quote':
        formatBlock('blockquote');
        break;
      case 'link': {
        const href = window.prompt('Enter the full URL for this link:', 'https://');
        if (!href) return;
        restoreSelection();
        exec('createLink', href);
        break;
      }
      case 'image': {
        const src = window.prompt('Enter the image URL:', 'https://');
        if (!src) return;
        const alt = window.prompt('Optional picture description:', '') || '';
        restoreSelection();
        exec(
          'insertHTML',
          `<figure><img src="${src}" alt="${alt}" />${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure><p></p>`,
        );
        break;
      }
      case 'table':
        exec(
          'insertHTML',
          '<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table><p></p>',
        );
        break;
      case 'hr':
        exec('insertHorizontalRule');
        break;
      case 'align-left':
        exec('justifyLeft');
        break;
      case 'align-center':
        exec('justifyCenter');
        break;
      case 'align-right':
        exec('justifyRight');
        break;
      case 'align-justify':
        exec('justifyFull');
        break;
    }

    emit();
    refreshMarks();
  };

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const html = clipboardHtml(event);
    if (!html) return;
    event.preventDefault();
    restoreSelection();
    exec('insertHTML', html);
    emit();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#EEF2F0]">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-white px-3 py-2.5">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-wrap items-center gap-1 border-r border-gray-100 pr-2 last:border-r-0 last:pr-0">
            {(group as ToolbarItem[]).map(({ id, label, icon: Icon, active }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onMouseDown={(event) => {
                  event.preventDefault();
                  apply(id);
                }}
                className={cx(
                  'min-w-0 rounded-md px-2 py-1.5 text-[11px] font-semibold',
                  active && 'bg-[#E5F5EE] text-[#00A36D]',
                )}
                title={label}
                aria-pressed={active}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                {!Icon && <span>{label}</span>}
                {Icon && <span className="sr-only">{label}</span>}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="px-3 py-4 sm:px-6 sm:py-6">
        <div
          ref={editorRef}
          className="rte-surface min-h-[420px] rounded-sm bg-white px-8 py-10 text-[#101828] shadow-[0_8px_28px_rgba(16,24,40,0.08)] outline-none lg:min-h-[560px] lg:px-14 lg:py-12"
          contentEditable={!disabled}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Article body"
          data-placeholder="Start writing. Select text and use the toolbar, just like Word."
          data-empty={empty ? 'true' : 'false'}
          spellCheck
          onInput={emit}
          onPaste={onPaste}
          onBlur={emit}
          onKeyUp={refreshMarks}
          onMouseUp={rememberSelection}
        />
      </div>

      <p className="border-t border-gray-200 bg-white px-4 py-2 text-[11px] text-gray-500">
        Type and format the article as you would in Word. Bold, italic, lists, headings, and pasted Word text appear as they will on the site.
      </p>
    </div>
  );
}

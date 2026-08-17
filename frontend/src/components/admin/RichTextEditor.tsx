'use client';

import { useMemo, useRef } from 'react';
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

function wrap(tag: string, value: string, attrs = '') {
  const body = value.trim() || 'Text';
  return `<${tag}${attrs}>${body}</${tag}>`;
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
  const ref = useRef<HTMLTextAreaElement>(null);
  type ToolbarItem = { id: ToolbarAction; label: string; icon?: React.ElementType };

  const groups = useMemo(
    () => [
      [
        { id: 'paragraph', label: 'Paragraph', icon: Type },
        { id: 'h1', label: 'Heading 1', icon: Heading1 },
        { id: 'h2', label: 'Heading 2', icon: Heading2 },
        { id: 'h3', label: 'Heading 3', icon: Heading3 },
      ],
      [
        { id: 'bold', label: 'Bold' },
        { id: 'italic', label: 'Italic' },
        { id: 'underline', label: 'Underline' },
      ],
      [
        { id: 'bullet', label: 'Bulleted list', icon: List },
        { id: 'numbered', label: 'Numbered list', icon: ListOrdered },
        { id: 'quote', label: 'Quote', icon: MessageSquareQuote },
      ],
      [
        { id: 'link', label: 'Link', icon: LinkIcon },
        { id: 'image', label: 'Image', icon: ImageIcon },
        { id: 'table', label: 'Table', icon: Table },
        { id: 'hr', label: 'Divider', icon: Minus },
      ],
      [
        { id: 'align-left', label: 'Align left', icon: AlignLeft },
        { id: 'align-center', label: 'Align center', icon: AlignCenter },
        { id: 'align-right', label: 'Align right', icon: AlignRight },
        { id: 'align-justify', label: 'Align justify', icon: AlignJustify },
      ],
    ] satisfies ToolbarItem[][],
    [],
  );

  const insert = (action: ToolbarAction) => {
    const input = ref.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selection = value.slice(start, end);
    let replacement = selection;

    switch (action) {
      case 'paragraph':
        replacement = wrap('p', selection);
        break;
      case 'h1':
      case 'h2':
      case 'h3':
        replacement = wrap(action, selection);
        break;
      case 'bold':
        replacement = wrap('strong', selection);
        break;
      case 'italic':
        replacement = wrap('em', selection);
        break;
      case 'underline':
        replacement = wrap('u', selection);
        break;
      case 'bullet':
        replacement = `<ul>\n  <li>${selection.trim() || 'List item'}</li>\n</ul>`;
        break;
      case 'numbered':
        replacement = `<ol>\n  <li>${selection.trim() || 'List item'}</li>\n</ol>`;
        break;
      case 'quote':
        replacement = wrap('blockquote', selection || 'Quoted text');
        break;
      case 'link': {
        const href = window.prompt('Enter the full URL for this link:', 'https://');
        if (!href) return;
        replacement = wrap('a', selection || 'Link text', ` href="${href}"`);
        break;
      }
      case 'image': {
        const src = window.prompt('Enter the image URL to embed:', 'https://');
        if (!src) return;
        const alt = window.prompt('Optional alt text:', '') || '';
        replacement = `<figure>\n  <img src="${src}" alt="${alt}" />\n  ${alt ? `<figcaption>${alt}</figcaption>` : ''}\n</figure>`;
        break;
      }
      case 'table':
        replacement =
          `<table>\n` +
          `  <thead><tr><th>Header 1</th><th>Header 2</th></tr></thead>\n` +
          `  <tbody><tr><td>${selection.trim() || 'Cell 1'}</td><td>Cell 2</td></tr></tbody>\n` +
          `</table>`;
        break;
      case 'hr':
        replacement = '<hr />';
        break;
      case 'align-left':
      case 'align-center':
      case 'align-right':
      case 'align-justify': {
        const align = action.replace('align-', '');
        replacement = wrap('p', selection || 'Aligned paragraph', ` style="text-align:${align}"`);
        break;
      }
    }

    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      input.focus();
      input.selectionStart = start;
      input.selectionEnd = start + replacement.length;
    });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-3">
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            {(group as ToolbarItem[]).map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={() => insert(id)}
                className={cx('rounded-lg px-2.5 py-2 text-[11px]', Icon ? 'min-w-0' : '')}
                title={label}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                <span>{label}</span>
              </Button>
            ))}
          </div>
        ))}
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={24}
        placeholder="Write article content here. Use the toolbar to insert headings, lists, links, quotes, images, tables, and alignment."
        className="min-h-[420px] w-full resize-y rounded-xl border border-gray-200 bg-[#F8FDFB] px-4 py-3 font-mono text-[13px] leading-relaxed text-gray-800 outline-none transition-colors focus:border-[#00A36D] lg:min-h-[560px]"
      />
      <p className="text-[11px] text-gray-500">
        The editor stores safe HTML and the backend sanitizes it again before publishing.
      </p>
    </div>
  );
}

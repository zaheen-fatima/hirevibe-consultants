import { useEffect, useRef, type ReactNode } from 'react';
import {
    Box,
    IconButton,
    Paper,
    Stack,
    Tooltip,
} from '@mui/material';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Quote,
    Underline,
} from 'lucide-react';

interface ArticleEditorProps {
    content: string;
    onChange: (content: string) => void;
}

interface CommandButtonProps {
    label: string;
    onClick: () => void;
    children: ReactNode;
}

type BlockTag = 'p' | 'h2' | 'h3' | 'blockquote';

function CommandButton({
                           label,
                           onClick,
                           children,
                       }: CommandButtonProps) {
    return (
        <Tooltip title={label}>
            <IconButton
                type="button"
                size="small"
                onMouseDown={(event) => {
                    event.preventDefault();
                    onClick();
                }}
            >
                {children}
            </IconButton>
        </Tooltip>
    );
}

function getSelectionRange(): Range | null {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
        return null;
    }

    return range;
}

function getSelectedText(): string {
    const selection = window.getSelection();

    return selection?.toString() ?? '';
}

export function ArticleEditor({
                                  content,
                                  onChange,
                              }: ArticleEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const lastContentRef = useRef(content);

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        if (lastContentRef.current !== content) {
            editor.innerHTML = content;
            lastContentRef.current = content;
        }
    }, [content]);

    useEffect(() => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        editor.innerHTML = content;
        lastContentRef.current = content;
    }, []);

    const emitChange = () => {
        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const html = editor.innerHTML;

        lastContentRef.current = html;
        onChange(html);
    };

    const focusEditor = () => {
        editorRef.current?.focus();
    };

    const toggleInlineTag = (
        tagName: 'STRONG' | 'EM' | 'U',
    ) => {
        const range = getSelectionRange();

        if (!range) {
            focusEditor();
            return;
        }

        const fragment = range.extractContents();
        const wrapper = document.createElement(
            tagName.toLowerCase(),
        );

        wrapper.appendChild(fragment);
        range.insertNode(wrapper);

        range.selectNodeContents(wrapper);

        const selection = window.getSelection();

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }

        emitChange();
    };

    const applyBlock = (tagName: BlockTag) => {
        const range = getSelectionRange();

        if (!range) {
            focusEditor();
            return;
        }

        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const startElement =
            range.startContainer instanceof Element
                ? range.startContainer
                : range.startContainer.parentElement;

        const endElement =
            range.endContainer instanceof Element
                ? range.endContainer
                : range.endContainer.parentElement;

        if (!startElement || !endElement) {
            return;
        }

        const startBlock =
            startElement.closest(
                'p, h2, h3, h4, blockquote, li',
            );

        const endBlock =
            endElement.closest(
                'p, h2, h3, h4, blockquote, li',
            );

        const blocks = Array.from(
            editor.querySelectorAll(
                'p, h2, h3, h4, blockquote, li',
            ),
        );

        const startIndex = startBlock
            ? blocks.indexOf(startBlock)
            : -1;

        const endIndex = endBlock
            ? blocks.indexOf(endBlock)
            : -1;

        if (startIndex === -1 || endIndex === -1) {
            return;
        }

        const firstIndex = Math.min(
            startIndex,
            endIndex,
        );

        const lastIndex = Math.max(
            startIndex,
            endIndex,
        );

        for (
            let index = firstIndex;
            index <= lastIndex;
            index += 1
        ) {
            const block = blocks[index];

            if (!(block instanceof HTMLElement)) {
                continue;
            }

            if (
                block.tagName.toLowerCase() === 'li'
            ) {
                continue;
            }

            const replacement =
                document.createElement(tagName);

            while (block.firstChild) {
                replacement.appendChild(
                    block.firstChild,
                );
            }

            block.replaceWith(replacement);
        }

        emitChange();
        focusEditor();
    };

    const toggleList = (
        ordered: boolean,
    ) => {
        const range = getSelectionRange();

        if (!range) {
            focusEditor();
            return;
        }

        const editor = editorRef.current;

        if (!editor) {
            return;
        }

        const listTag = ordered ? 'ol' : 'ul';

        const startElement =
            range.startContainer instanceof Element
                ? range.startContainer
                : range.startContainer.parentElement;

        const endElement =
            range.endContainer instanceof Element
                ? range.endContainer
                : range.endContainer.parentElement;

        if (!startElement || !endElement) {
            return;
        }

        const startBlock =
            startElement.closest(
                'p, h2, h3, h4, blockquote, li',
            );

        const endBlock =
            endElement.closest(
                'p, h2, h3, h4, blockquote, li',
            );

        if (
            startBlock instanceof HTMLLIElement &&
            endBlock instanceof HTMLLIElement
        ) {
            const parentList =
                startBlock.parentElement;

            if (
                parentList &&
                parentList.tagName.toLowerCase() === listTag
            ) {
                const fragment =
                    document.createDocumentFragment();

                const items = Array.from(
                    parentList.children,
                );

                items.forEach((item) => {
                    if (
                        item instanceof HTMLLIElement
                    ) {
                        const paragraph =
                            document.createElement('p');

                        while (item.firstChild) {
                            paragraph.appendChild(
                                item.firstChild,
                            );
                        }

                        fragment.appendChild(paragraph);
                    }
                });

                parentList.replaceWith(fragment);
                emitChange();
                focusEditor();
                return;
            }
        }

        const blocks = Array.from(
            editor.querySelectorAll(
                'p, h2, h3, h4, blockquote',
            ),
        );

        const startIndex = startBlock
            ? blocks.indexOf(startBlock)
            : -1;

        const endIndex = endBlock
            ? blocks.indexOf(endBlock)
            : -1;

        if (startIndex === -1 || endIndex === -1) {
            return;
        }

        const firstIndex = Math.min(
            startIndex,
            endIndex,
        );

        const lastIndex = Math.max(
            startIndex,
            endIndex,
        );

        const list =
            document.createElement(listTag);

        for (
            let index = firstIndex;
            index <= lastIndex;
            index += 1
        ) {
            const block = blocks[index];

            if (!(block instanceof HTMLElement)) {
                continue;
            }

            const item =
                document.createElement('li');

            while (block.firstChild) {
                item.appendChild(
                    block.firstChild,
                );
            }

            list.appendChild(item);
            block.replaceWith(
                index === firstIndex
                    ? list
                    : document.createElement('span'),
            );
        }

        editor
            .querySelectorAll('span')
            .forEach((element) => {
                if (!element.textContent) {
                    element.remove();
                }
            });

        emitChange();
        focusEditor();
    };

    const addLink = () => {
        const selectedText = getSelectedText();

        if (!selectedText) {
            focusEditor();
            return;
        }

        const url = window.prompt(
            'Enter the full URL:',
            'https://',
        );

        if (!url) {
            return;
        }

        const trimmedUrl = url.trim();

        if (
            !/^https?:\/\//i.test(trimmedUrl)
        ) {
            return;
        }

        const range = getSelectionRange();

        if (!range) {
            return;
        }

        const link =
            document.createElement('a');

        link.href = trimmedUrl;
        link.target = '_blank';
        link.rel =
            'noopener noreferrer';

        link.appendChild(
            range.extractContents(),
        );

        range.insertNode(link);

        const selection =
            window.getSelection();

        if (selection) {
            selection.removeAllRanges();

            const newRange =
                document.createRange();

            newRange.selectNodeContents(link);
            selection.addRange(newRange);
        }

        emitChange();
    };

    const addHorizontalRule = () => {
        focusEditor();

        const selection =
            window.getSelection();

        if (
            !selection ||
            selection.rangeCount === 0
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        const rule =
            document.createElement('hr');

        range.collapse(false);
        range.insertNode(rule);

        const paragraph =
            document.createElement('p');

        rule.after(paragraph);

        const newRange =
            document.createRange();

        newRange.setStart(
            paragraph,
            0,
        );
        newRange.collapse(true);

        selection.removeAllRanges();
        selection.addRange(newRange);

        emitChange();
    };

    return (
        <Box>
            <Paper
                variant="outlined"
                sx={{
                    overflow: 'hidden',
                    borderRadius: 2,
                }}
            >
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={0.25}
                    sx={{
                        p: 0.75,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'action.hover',
                    }}
                >
                    <CommandButton
                        label="Bold"
                        onClick={() =>
                            toggleInlineTag('STRONG')
                        }
                    >
                        <Bold size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Italic"
                        onClick={() =>
                            toggleInlineTag('EM')
                        }
                    >
                        <Italic size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Underline"
                        onClick={() =>
                            toggleInlineTag('U')
                        }
                    >
                        <Underline size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Heading 2"
                        onClick={() =>
                            applyBlock('h2')
                        }
                    >
                        <Heading2 size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Heading 3"
                        onClick={() =>
                            applyBlock('h3')
                        }
                    >
                        <Heading3 size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Bullet list"
                        onClick={() =>
                            toggleList(false)
                        }
                    >
                        <List size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Numbered list"
                        onClick={() =>
                            toggleList(true)
                        }
                    >
                        <ListOrdered size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Quote"
                        onClick={() =>
                            applyBlock('blockquote')
                        }
                    >
                        <Quote size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Add link"
                        onClick={addLink}
                    >
                        <LinkIcon size={17} />
                    </CommandButton>

                    <CommandButton
                        label="Horizontal rule"
                        onClick={
                            addHorizontalRule
                        }
                    >
                        <Minus size={17} />
                    </CommandButton>
                </Stack>

                <Box
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    onInput={emitChange}
                    onBlur={emitChange}
                    sx={{
                        minHeight: 300,
                        p: 2,
                        outline: 'none',
                        lineHeight: 1.8,
                        fontSize: '0.98rem',

                        '&:empty:before': {
                            content:
                                '"Write your article content here..."',
                            color: 'text.disabled',
                            pointerEvents: 'none',
                        },

                        '& p': {
                            margin: '0 0 1rem',
                        },

                        '& p:last-child': {
                            marginBottom: 0,
                        },

                        '& h2': {
                            margin:
                                '1.75rem 0 0.8rem',
                            fontSize: '1.6rem',
                            lineHeight: 1.3,
                            fontWeight: 700,
                        },

                        '& h3': {
                            margin:
                                '1.5rem 0 0.7rem',
                            fontSize: '1.3rem',
                            lineHeight: 1.35,
                            fontWeight: 700,
                        },

                        '& ul, & ol': {
                            paddingLeft: '1.7rem',
                            margin: '0 0 1rem',
                        },

                        '& li': {
                            marginBottom: '0.45rem',
                        },

                        '& strong, & b': {
                            fontWeight: 700,
                        },

                        '& em, & i': {
                            fontStyle: 'italic',
                        },

                        '& u': {
                            textDecoration:
                                'underline',
                        },

                        '& blockquote': {
                            margin: '1.25rem 0',
                            padding:
                                '0.8rem 1rem',
                            borderLeft: '3px solid',
                            borderColor:
                                'primary.main',
                            backgroundColor:
                                'action.hover',
                            borderRadius:
                                '0 8px 8px 0',
                            fontStyle: 'italic',
                        },

                        '& a': {
                            color:
                                'primary.main',
                            textDecoration:
                                'underline',
                            textUnderlineOffset:
                                '3px',
                        },

                        '& hr': {
                            border: 0,
                            borderTop:
                                '1px solid',
                            borderColor:
                                'divider',
                            margin:
                                '1.75rem 0',
                        },
                    }}
                />
            </Paper>
        </Box>
    );
}
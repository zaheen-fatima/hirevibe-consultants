import { Box } from "@mui/material";

interface ArticleContentProps {
    content: string;
}

function decodeHtmlEntities(value: string): string {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value;
    return textarea.value;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatPlainText(content: string): string {
    return escapeHtml(content)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split(/\n{2,}/)
        .map((paragraph) => {
            const trimmed = paragraph.trim();

            if (!trimmed) {
                return "";
            }

            return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
        })
        .filter(Boolean)
        .join("");
}

function sanitizeHtml(content: string): string {
    let normalizedContent = content;

    /*
     * Some existing articles were saved with their HTML tags encoded,
     * for example:
     *
     * &lt;h2&gt;Heading&lt;/h2&gt;
     *
     * Decode one layer so those tags can be rendered correctly.
     */
    if (/&lt;\s*\/?\s*(h2|h3|h4|p|strong|b|em|i|u|ul|ol|li|blockquote|a|hr|br)\b/i.test(normalizedContent)) {
        normalizedContent = decodeHtmlEntities(normalizedContent);
    }

    /*
     * Plain-text articles should remain plain text.
     */
    if (!normalizedContent.includes("<")) {
        return formatPlainText(normalizedContent);
    }

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(
        normalizedContent,
        "text/html",
    );

    const allowedTags = new Set([
        "P",
        "BR",
        "STRONG",
        "B",
        "EM",
        "I",
        "U",
        "H2",
        "H3",
        "H4",
        "UL",
        "OL",
        "LI",
        "BLOCKQUOTE",
        "A",
        "HR",
    ]);

    const allowedAttributes = new Set([
        "href",
        "target",
        "rel",
    ]);

    const elements = Array.from(
        parsedDocument.body.querySelectorAll("*"),
    );

    elements.forEach((element) => {
        if (!allowedTags.has(element.tagName)) {
            const parent = element.parentNode;

            if (parent) {
                while (element.firstChild) {
                    parent.insertBefore(
                        element.firstChild,
                        element,
                    );
                }

                parent.removeChild(element);
            }

            return;
        }

        Array.from(element.attributes).forEach((attribute) => {
            if (!allowedAttributes.has(attribute.name)) {
                element.removeAttribute(attribute.name);
            }
        });

        if (element.tagName === "A") {
            const href = element.getAttribute("href");

            if (!href || !/^https?:\/\//i.test(href)) {
                element.removeAttribute("href");
                element.removeAttribute("target");
                element.removeAttribute("rel");
            } else {
                element.setAttribute("target", "_blank");
                element.setAttribute("rel", "noopener noreferrer");
            }
        }
    });

    return parsedDocument.body.innerHTML;
}

export function ArticleContent({
                                   content,
                               }: ArticleContentProps) {
    const html = sanitizeHtml(content);

    return (
        <Box
            className="hv-article-content"
            dangerouslySetInnerHTML={{
                __html: html,
            }}
            sx={{
                "& p": {
                    margin: "0 0 1.35rem",
                    lineHeight: 1.9,
                },

                "& p:last-child": {
                    marginBottom: 0,
                },

                "& h2": {
                    margin: "2.5rem 0 1rem",
                    fontSize: {
                        xs: "1.5rem",
                        md: "1.8rem",
                    },
                    fontWeight: 700,
                    lineHeight: 1.3,
                },

                "& h3": {
                    margin: "2rem 0 0.8rem",
                    fontSize: {
                        xs: "1.25rem",
                        md: "1.45rem",
                    },
                    fontWeight: 700,
                    lineHeight: 1.35,
                },

                "& h4": {
                    margin: "1.7rem 0 0.7rem",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                },

                "& ul, & ol": {
                    margin: "0 0 1.5rem",
                    paddingLeft: "1.7rem",
                },

                "& li": {
                    marginBottom: "0.65rem",
                    lineHeight: 1.8,
                },

                "& strong, & b": {
                    fontWeight: 700,
                },

                "& em, & i": {
                    fontStyle: "italic",
                },

                "& u": {
                    textDecoration: "underline",
                },

                "& blockquote": {
                    margin: "2rem 0",
                    padding: "1rem 1.4rem",
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                    borderRadius: "0 8px 8px 0",
                    fontStyle: "italic",
                },

                "& a": {
                    color: "primary.main",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                },

                "& hr": {
                    margin: "2.5rem 0",
                    border: 0,
                    borderTop: "1px solid",
                    borderColor: "divider",
                },
            }}
        />
    );
}
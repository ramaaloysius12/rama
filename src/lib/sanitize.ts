import sanitizeHtml from "sanitize-html";

export function sanitizeArticleContent(dirtyHtml: string): string {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul",
      "ol", "nl", "li", "b", "i", "strong", "em", "strike", "code", "hr",
      "br", "div", "table", "thead", "caption", "tbody", "tr", "th", "td", "img"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      table: ["class"],
      th: ["style"],
      td: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    exclusiveFilter: function (frame) {
      // Blokir link eksternal berbahaya
      if (frame.tag === "a" && frame.attribs.href) {
        if (frame.attribs.href.startsWith("javascript:")) return true;
      }
      return false;
    },
  });
}

export function sanitizePlainText(dirtyText: string): string {
  return sanitizeHtml(dirtyText, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}

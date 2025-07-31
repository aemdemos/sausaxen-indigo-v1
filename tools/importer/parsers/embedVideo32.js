/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the example
  const headerRow = ['Embed (embedVideo32)'];

  // Prepare to collect content for the cell
  const cellContent = [];

  // Collect all meaningful text content and children from the block
  // The block is typically just the embed, but we should capture text if present
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        cellContent.push(document.createTextNode(text));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // If this node is the embedVideo container, get its children
      if (node.classList.contains('embedVideo')) {
        Array.from(node.childNodes).forEach((embedChild) => {
          // If embedChild is iframe, convert to link per requirements
          if (embedChild.nodeType === Node.ELEMENT_NODE && embedChild.tagName === 'IFRAME') {
            const src = embedChild.getAttribute('src');
            if (src) {
              const link = document.createElement('a');
              link.href = src;
              link.textContent = src;
              cellContent.push(link);
            }
          } else if (embedChild.nodeType === Node.TEXT_NODE) {
            const embedText = embedChild.textContent.trim();
            if (embedText) {
              cellContent.push(document.createTextNode(embedText));
            }
          } else {
            cellContent.push(embedChild);
          }
        });
      } else {
        cellContent.push(node);
      }
    }
  });

  // Fallback: if cellContent is empty, add any remaining textContent
  if (cellContent.length === 0 && element.textContent.trim()) {
    cellContent.push(document.createTextNode(element.textContent.trim()));
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

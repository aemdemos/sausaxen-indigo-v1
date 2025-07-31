/* global WebImporter */
export default function parse(element, { document }) {
  // Create Embed block header
  const headerRow = ['Embed'];

  // Get all direct children inside the .embed block
  const children = Array.from(element.childNodes);
  // Collect non-empty text nodes and element nodes
  const contentNodes = [];
  children.forEach((child) => {
    // For text nodes
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      contentNodes.push(child);
    }
    // For element nodes (e.g., <div id="embed-..." ...>)
    if (child.nodeType === Node.ELEMENT_NODE) {
      // If the child itself has meaningful text, include it
      if (child.textContent && child.textContent.trim()) {
        contentNodes.push(child);
      }
      // If the child is empty but might hold an embed, still include
      else if (!child.textContent.trim()) {
        contentNodes.push(child);
      }
    }
  });

  // If there are no content nodes, try to grab any text from deeply nested nodes
  if (contentNodes.length === 0) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.textContent && node.textContent.trim()) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      contentNodes.push(node);
    }
  }

  // If still nothing, set cell to blank string
  const contentRow = [contentNodes.length ? contentNodes : ''];

  // Build the table and replace
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

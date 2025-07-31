/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match the example: one cell, 'Embed'.
  const headerRow = ['Embed'];
  
  // The content row should contain all content (text, HTML) from the .cmp-embed block.
  // If .cmp-embed is empty, the cell should be an empty string, per block guidelines.
  let contentCell = '';
  const embedDiv = element.querySelector('.cmp-embed');
  if (embedDiv) {
    // Gather all child nodes (including text) from .cmp-embed
    const nodes = Array.from(embedDiv.childNodes)
      .filter(node => (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
    if (nodes.length === 1) {
      contentCell = nodes[0];
    } else if (nodes.length > 1) {
      contentCell = nodes;
    }
    // If .cmp-embed has no children/text, leave contentCell as empty string.
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [contentCell]
  ], document);
  element.replaceWith(table);
}

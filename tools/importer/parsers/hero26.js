/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero26)'];

  // Background image row (none present in this HTML)
  const backgroundRow = [''];

  // Compose content row
  // For this block, combine all visible content from the main content column into a single cell
  let mainCol = element.querySelector('.col-md-10.col-9');
  if (!mainCol) {
    // fallback to first child div
    mainCol = element.querySelector('div');
  }

  let contentCell = '';
  if (mainCol) {
    // Gather all nodes contributing to visible content (text, headings, links, etc.)
    // We reference existing child nodes without cloning to preserve structure and semantics
    const nodes = Array.from(mainCol.childNodes).filter(node => {
      // Filter out empty text nodes and comment nodes
      if (node.nodeType === Node.COMMENT_NODE) return false;
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // If we have only one node, use it directly; otherwise, wrap in a div
    if (nodes.length === 1) {
      contentCell = nodes[0];
    } else if (nodes.length > 1) {
      const wrapper = document.createElement('div');
      nodes.forEach(node => wrapper.appendChild(node));
      contentCell = wrapper;
    }
  }
  if (!contentCell) contentCell = '';

  const contentRow = [contentCell];
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

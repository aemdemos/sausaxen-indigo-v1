/* global WebImporter */
export default function parse(element, { document }) {
  // Header row EXACTLY as required
  const headerRow = ['Hero (hero12)'];
  // No background image present, so empty string
  const bgImageRow = [''];
  // Main content: gather all direct children of the primary content column
  // (should cover all text, headings, empty subheads, and possible CTAs)
  let mainCol = null;
  // Find the child containing the main heading (title)
  const directChildren = element.querySelectorAll(':scope > div');
  for (const child of directChildren) {
    if (child.querySelector('h1, h2, h3, h4, h5, h6')) {
      mainCol = child;
      break;
    }
  }
  // Fallback: If still not found, use first column
  if (!mainCol && directChildren.length) mainCol = directChildren[0];
  let contentCell;
  if (mainCol) {
    // Reference all direct children to preserve structure & semantic meaning
    const nodes = Array.from(mainCol.childNodes)
      .filter(node => {
        // keep ELEMENT_NODEs, and TEXT_NODEs with non-empty content
        return (node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
      });
    // If more than one node, use as array. Single node: just that node.
    contentCell = nodes.length === 1 ? nodes[0] : nodes;
  } else {
    // If nothing found, just use the element's total text content
    contentCell = element.textContent.trim();
  }
  const cells = [
    headerRow,
    bgImageRow,
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

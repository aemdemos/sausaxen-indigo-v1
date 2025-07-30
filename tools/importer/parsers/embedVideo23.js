/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all text content from the element and its descendants
  // as a single block for the cell if any present.
  // For robustness, include all direct children (including elements with no text)
  const contentNodes = Array.from(element.childNodes).filter(
    node => node.nodeType !== Node.COMMENT_NODE
  );

  // If there is at least one non-empty text node or element, add it to the cell
  let cellContent;
  if (contentNodes.length > 0) {
    // If all child nodes are empty whitespace text nodes, fallback to ''
    const hasVisible = contentNodes.some(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
    if (hasVisible) {
      cellContent = contentNodes;
    } else {
      cellContent = [''];
    }
  } else {
    cellContent = [''];
  }

  const cells = [
    ['Embed'],
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active tab (first active tab-pane or first tab-pane if none is active)
  const tabContent = element.querySelector('.tab-content');
  let activePane = null;
  if (tabContent) {
    activePane = tabContent.querySelector('.tab-pane.active.show') || tabContent.querySelector('.tab-pane.active') || tabContent.querySelector('.tab-pane');
  }
  // Fallback if structure differs
  if (!activePane) activePane = element;

  // The main content is inside either .container.container-mob or directly as children
  let contentContainer = activePane.querySelector('.textblock .container.container-mob') || activePane;

  // Prepare content
  const cellContent = [];
  let i = 0;
  while (i < contentContainer.childNodes.length) {
    let node = contentContainer.childNodes[i];
    // Skip empty text
    if (node.nodeType === 3) { // text node
      if (node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        cellContent.push(span);
      }
      i++;
      continue;
    }
    // All block-level elements
    if (node.nodeType === 1) {
      if (
        node.tagName === 'P' ||
        node.tagName === 'UL' ||
        node.tagName === 'OL' ||
        node.tagName === 'TABLE' ||
        node.tagName === 'DIV' ||
        node.tagName === 'H1' ||
        node.tagName === 'H2' ||
        node.tagName === 'H3' ||
        node.tagName === 'H4' ||
        node.tagName === 'H5' ||
        node.tagName === 'H6'
      ) {
        // Keep all non-empty, or tables always
        if (node.tagName === 'TABLE' || node.textContent.trim()) {
          cellContent.push(node);
        }
      }
    }
    i++;
  }

  // Remove trailing empty paragraphs or spans
  while (
    cellContent.length && (
      (cellContent[cellContent.length - 1].tagName === 'P' && !cellContent[cellContent.length - 1].textContent.trim()) ||
      (cellContent[cellContent.length - 1].tagName === 'SPAN' && !cellContent[cellContent.length - 1].textContent.trim())
    )
  ) {
    cellContent.pop();
  }

  // Build the block table (header must be 'Table' as in the example)
  const tableBlock = WebImporter.DOMUtils.createTable([
    ['Table'],
    [cellContent]
  ], document);

  element.replaceWith(tableBlock);
}

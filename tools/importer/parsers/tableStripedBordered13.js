/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header as required
  const headerRow = ['Table (striped, bordered)'];

  // Find the active tab-pane (for the screenshot, we use the first tab-pane, which is active)
  const tabPanes = element.querySelectorAll('.tab-pane');
  let activeTab = Array.from(tabPanes).find(tp => tp.classList.contains('active')) || tabPanes[0];

  // Find the main textblock section in the active tab (contains all content)
  let textblock = activeTab.querySelector('.textblock.section');
  let contentRoot = textblock ? (textblock.querySelector('.container') || textblock) : activeTab;

  // Collect all visible content nodes (elements and text) in order, including whitespace-only text nodes
  // (but skip empty nodes and clearfix divs)
  const contentElements = [];
  for (let node of Array.from(contentRoot.childNodes)) {
    if (node.nodeType === 3) {
      // Text node
      if (node.textContent && node.textContent.trim() !== '') {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentElements.push(span);
      }
    } else if (node.nodeType === 1) {
      // Element node
      if (node.classList.contains('clearfix')) continue; // skip clearfix
      contentElements.push(node);
    }
  }

  if (!contentElements.length) {
    contentElements.push(contentRoot);
  }

  // Compose the cells array for the block table
  const cells = [
    headerRow,
    [contentElements]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}

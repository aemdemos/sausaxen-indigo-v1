/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: Find immediate child by class
  function childByClass(parent, className) {
    for (const child of parent.children) if (child.classList.contains(className)) return child;
    return null;
  }
  // Find tab navigation for tab titles
  const tabNav = element.querySelector('.nav-tabs');
  // Find all tab panes
  const tabContent = element.querySelector('.tab-content');
  const tabPanes = tabContent ? tabContent.querySelectorAll(':scope > .tab-pane') : [];
  // We will process each tab-pane as a logical block section
  let rows = [];
  let headerAdded = false;
  tabPanes.forEach((tabPane) => {
    // Find tab title (from nav)
    let tabTitle = '';
    if (tabNav && tabPane.id) {
      const link = tabNav.querySelector(`[href="#${tabPane.id}"]`);
      if (link) tabTitle = link.textContent.trim();
    }
    // Only add header once as per block rules
    if (!headerAdded) {
      rows.push(['Table (striped, bordered)']);
      headerAdded = true;
    }
    // Add tab title (bold) as a separate row
    if (tabTitle) {
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = tabTitle;
      rows.push([titleStrong]);
    }
    // The main content is inside .textblock.section > .container (or .textblock.section directly)
    const textblock = tabPane.querySelector('.textblock.section');
    let content = childByClass(textblock, 'container') || textblock;
    // Process content children: collect content until a table, emit, then table, emit, then rest
    if (!content) return; // skip if corrupt
    let buffer = [];
    Array.from(content.children).forEach((child) => {
      if (child.tagName === 'TABLE') {
        // Flush buffer
        if (buffer.length) {
          rows.push([buffer.length === 1 ? buffer[0] : buffer]);
          buffer = [];
        }
        rows.push([child]);
      } else if (child.textContent.trim() !== '' && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
        buffer.push(child);
      }
    });
    // Flush any remaining buffer
    if (buffer.length) {
      rows.push([buffer.length === 1 ? buffer[0] : buffer]);
    }
  });

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

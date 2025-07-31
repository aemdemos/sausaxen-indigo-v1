/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table inside the element
  const container = element.querySelector('.container, .container-mob') || element;
  const table = container.querySelector('table');
  // Build the block table rows
  const cells = [];
  // Header row
  cells.push(['Table (table33)']);
  if (table) {
    // Reference the original table element directly
    cells.push([table]);
  }
  // Find any content after the table (usually notes or paragraphs)
  let foundTable = false;
  const afterTableContent = [];
  for (const child of Array.from(container.childNodes)) {
    if (!foundTable) {
      if (child === table) {
        foundTable = true;
      }
      continue;
    }
    // Only add non-empty elements (paragraphs, etc)
    if ((child.nodeType === 1 && (child.textContent && child.textContent.trim())) || (child.nodeType === 3 && child.textContent.trim())) {
      afterTableContent.push(child);
    }
  }
  if (afterTableContent.length) {
    // If only one, use directly; else, wrap in a div
    if (afterTableContent.length === 1) {
      cells.push([afterTableContent[0]]);
    } else {
      const div = document.createElement('div');
      afterTableContent.forEach(node => div.appendChild(node));
      cells.push([div]);
    }
  }
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

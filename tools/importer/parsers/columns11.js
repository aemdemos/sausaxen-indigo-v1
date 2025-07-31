/* global WebImporter */
export default function parse(element, { document }) {
  // Gather main columns: accordions (3) and social (1) = total 4 columns
  const columns = [];

  // Get the 3 accordion columns
  const containerLinks = element.querySelector('.container__links');
  if (containerLinks) {
    const accordionColumns = Array.from(containerLinks.querySelectorAll(':scope > .accordion.container__links__item'));
    accordionColumns.forEach(col => {
      const colElems = [];
      const button = col.querySelector('.cmp-accordion__button');
      if (button) {
        const h3 = document.createElement('h3');
        // Only the button text, not the icon
        const buttonText = Array.from(button.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent.trim()).join(' ').replace(/\s+/g, ' ');
        h3.textContent = buttonText;
        colElems.push(h3);
      }
      const panel = col.querySelector('.cmp-accordion__panel');
      if (panel) {
        const ul = panel.querySelector('ul.child-links');
        if (ul) colElems.push(ul);
      }
      columns.push(colElems);
    });
  }

  // Add the social/download/awards column
  const socialLinks = element.querySelector('.social-links');
  if (socialLinks) {
    columns.push([socialLinks]);
  }

  // Header row: one cell for each content column
  const headerLabel = 'Columns (columns11)';
  const headerRow = columns.map(() => headerLabel);

  // Each content cell as its own column
  const contentRow = columns;

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}

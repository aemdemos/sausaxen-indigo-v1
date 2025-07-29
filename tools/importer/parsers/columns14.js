/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a column: strong heading + link list (ul)
  function extractAccordionColumn(accordionDiv) {
    // Get the button label (column heading)
    const button = accordionDiv.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      // Remove icon for text extraction
      const btnClone = button.cloneNode(true);
      const icon = btnClone.querySelector('i');
      if (icon) icon.remove();
      title = btnClone.textContent.trim();
    }
    // Get the child link list, if present
    const ul = accordionDiv.querySelector('ul.child-links');
    // Assemble: title (strong) plus list
    const frag = document.createElement('div');
    if (title) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = title;
      frag.appendChild(titleEl);
    }
    if (ul) {
      frag.appendChild(ul);
    }
    return frag.childNodes.length ? frag : '';
  }

  // Find the 3 accordion columns under .container__links
  const containerLinks = element.querySelector('.container__links');
  let accordionColumns = [];
  if (containerLinks) {
    const accordionItems = containerLinks.querySelectorAll(':scope > .accordion.container__links__item');
    accordionColumns = Array.from(accordionItems).map(extractAccordionColumn);
  }

  // Find the .social-links.non-mobile column (if present)
  let socialColumn = '';
  const socialLinks = element.querySelector('.social-links.non-mobile');
  if (socialLinks) {
    socialColumn = socialLinks;
  }

  // Compose the columns row, only including non-empty columns
  const columnsRow = [...accordionColumns, socialColumn].filter(Boolean);

  // Only build table if we have at least one column
  if (columnsRow.length) {
    // The header row must match the number of columns, with the first cell as the block name and the rest as empty strings
    const headerRow = Array(columnsRow.length).fill('');
    headerRow[0] = 'Columns (columns14)';
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      columnsRow
    ], document);
    element.replaceWith(table);
  }
}

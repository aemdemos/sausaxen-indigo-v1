/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as in the example
  const headerRow = ['Accordion (accordion6)'];
  const rows = [];
  // Get the container for accordion items
  const accGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (accGroup) {
    const items = accGroup.querySelectorAll('.faq-sb-heading');
    items.forEach(item => {
      // Title: .faq-sb-acc-heading <a>, but we want only its text and any inline elements except the trailing icon
      const titleLink = item.querySelector('.faq-sb-acc-heading');
      let titleCell = '';
      if (titleLink) {
        // Create a span to hold all children except the icon
        const titleWrapper = document.createElement('span');
        for (const node of titleLink.childNodes) {
          if (!(node.nodeType === 1 && node.tagName === 'I')) {
            titleWrapper.appendChild(node.cloneNode(true));
          }
        }
        titleCell = titleWrapper;
      } else {
        titleCell = '';
      }
      // Content: .faq-acc-inner-content (may be empty or contain p, a, etc)
      const contentDiv = item.querySelector('.faq-acc-inner-content');
      let contentCell = '';
      if (contentDiv) {
        // Reference all children in one wrapper
        const contentWrapper = document.createElement('div');
        for (const child of contentDiv.childNodes) {
          contentWrapper.appendChild(child.cloneNode(true));
        }
        contentCell = contentWrapper;
      } else {
        contentCell = '';
      }
      rows.push([titleCell, contentCell]);
    });
  }
  // Build the table
  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}

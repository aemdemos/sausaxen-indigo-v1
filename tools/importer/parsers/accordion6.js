/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion group container in the provided element
  const accGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (!accGroup) return;

  // Prepare the rows array starting with the header
  const rows = [['Accordion (accordion6)']];

  // Process each accordion heading
  const headings = accGroup.querySelectorAll(':scope > .faq-sb-heading');
  headings.forEach((heading) => {
    // Title cell: the anchor inside .faq-sb-acc-heading
    const titleLink = heading.querySelector('.faq-sb-acc-heading');
    let titleCell = '';
    if (titleLink) {
      // Remove arrow icon if present while referencing the element
      const icon = titleLink.querySelector('i');
      if (icon) icon.remove();
      titleCell = titleLink;
    }
    // Content cell: the content div inside .faq-acc-inner-content
    const contentDiv = heading.querySelector('.faq-acc-inner-content');
    let contentCell = '';
    if (contentDiv) {
      // If a <p> exists, use it; otherwise use the div itself
      const p = contentDiv.querySelector('p');
      if (p) {
        contentCell = p;
      } else if (contentDiv.childNodes.length) {
        // If the div has child nodes, use all as an array
        contentCell = Array.from(contentDiv.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim().length > 0);
      } else {
        contentCell = contentDiv;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

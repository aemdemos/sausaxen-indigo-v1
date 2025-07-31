/* global WebImporter */
export default function parse(element, { document }) {
  // Header row — must match exactly
  const headerRow = ['Accordion (accordion6)'];

  // Get the accordion group containing items
  const accGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (!accGroup) return;

  // Each accordion item is a .faq-sb-heading
  const accItems = Array.from(accGroup.querySelectorAll(':scope > .faq-sb-heading'));

  // Compose table rows for each accordion item
  const rows = accItems.map((headingDiv) => {
    // Title cell: extract the text from the anchor, referencing the anchor element without the icon
    const titleAnchor = headingDiv.querySelector(':scope > .faq-sb-acc-heading');
    let titleCell = '';
    if (titleAnchor) {
      // Copy anchor's text only (preserve links, if any)
      // Remove icon from the anchor (remove <i>)
      const icon = titleAnchor.querySelector('i');
      if (icon) icon.remove();
      // Use a span to wrap, preserving formatting/links (if any)
      // Use the anchor's child nodes
      const span = document.createElement('span');
      [...titleAnchor.childNodes].forEach((node) => {
        span.appendChild(node.cloneNode(true));
      });
      titleCell = span;
    }
    // Content cell: use the <p> inside .faq-acc-inner-content if present, else that div
    let contentCell = '';
    const contentDiv = headingDiv.querySelector(':scope > .faq-acc-inner-content');
    if (contentDiv) {
      const para = contentDiv.querySelector('p');
      if (para) {
        contentCell = para;
      } else {
        contentCell = contentDiv;
      }
    }
    return [titleCell, contentCell];
  });

  // Compose final table data
  const tableData = [headerRow, ...rows];

  // Create the block table, replace the original element
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}

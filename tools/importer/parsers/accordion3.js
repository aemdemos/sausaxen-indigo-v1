/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header as a single cell row
  const rows = [
    ['Accordion (accordion3)']
  ];

  // Find all accordion items within the .faq-sb-acc-group
  const accGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (accGroup) {
    const accItems = accGroup.querySelectorAll(':scope > .faq-sb-heading');
    accItems.forEach(acc => {
      // Title cell: use only the text of the <a> without the <i> icon, as a string
      const titleLink = acc.querySelector('.faq-sb-acc-heading');
      let titleCell = '';
      if (titleLink) {
        // Remove the icon for a clean string
        const temp = titleLink.cloneNode(true);
        const icon = temp.querySelector('i');
        if (icon) icon.remove();
        titleCell = temp.textContent.trim();
      }

      // Content cell: preserve all child nodes of .faq-acc-inner-content
      const contentDiv = acc.querySelector('.faq-acc-inner-content');
      let contentCell = '';
      if (contentDiv) {
        const fragment = document.createDocumentFragment();
        Array.from(contentDiv.childNodes).forEach(node => {
          fragment.appendChild(node.cloneNode(true));
        });
        // If only text, get text; else use fragment
        contentCell = fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
      }
      rows.push([titleCell, contentCell]);
    });
  }

  // Create the block table with correct structure and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block name
  const rows = [
    ['Accordion (accordion3)'],
  ];

  // Select all accordion items in the sidebar accordion group
  const accGroup = element.querySelector('.faq-side-bar .faq-sb-acc-group');
  if (accGroup) {
    const accHeadings = accGroup.querySelectorAll(':scope > .faq-sb-heading');

    accHeadings.forEach((heading) => {
      // Title cell: the FAQ title link (with formatting)
      const titleLink = heading.querySelector('.faq-sb-acc-heading');
      let titleContent = '';
      if (titleLink) {
        // Remove the trailing icon from the titleLink
        const icon = titleLink.querySelector('i');
        if (icon) icon.remove();
        // Use the actual element (not clone!) for the table cell
        titleContent = titleLink;
      } else {
        // Fallback: plain text node
        titleContent = heading.textContent.trim();
      }

      // Content cell: body content for the accordion item
      const contentDiv = heading.querySelector('.faq-acc-inner-content');
      let contentCell = '';
      if (contentDiv) {
        // Reference all children nodes (paragraphs, etc)
        // If there is only one child, just use it; if multiple, use array
        const nodes = Array.from(contentDiv.childNodes).filter(n => n.nodeType !== Node.COMMENT_NODE && (n.textContent.trim() || n.nodeType === Node.ELEMENT_NODE));
        if (nodes.length === 1) {
          contentCell = nodes[0];
        } else if (nodes.length > 1) {
          contentCell = nodes;
        } else {
          contentCell = '';
        }
      }
      rows.push([titleContent, contentCell]);
    });
  }
  // Replace only if there are rows besides the header
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}

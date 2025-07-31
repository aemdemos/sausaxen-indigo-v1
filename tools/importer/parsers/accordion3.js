/* global WebImporter */
export default function parse(element, { document }) {
  // Find all accordion headings in the sidebar
  const group = element.querySelector('.faq-sb-acc-group');
  if (!group) return;
  const headingWrappers = group.querySelectorAll(':scope > .faq-sb-heading');
  const rows = [
    ['Accordion (accordion3)'], // header row EXACTLY as in the spec
  ];
  headingWrappers.forEach((headingWrapper) => {
    // Title cell: the question (the <a> inside .faq-sb-acc-heading)
    const titleLink = headingWrapper.querySelector(':scope > .faq-sb-acc-heading');
    let titleCell;
    if (titleLink) {
      // Remove the arrow icon (if present) for clean title
      const titleContent = [...titleLink.childNodes].filter(n => !(n.nodeType === 1 && n.tagName === 'I'));
      const titleSpan = document.createElement('span');
      titleContent.forEach(n => titleSpan.appendChild(n.cloneNode(true)));
      titleCell = titleSpan.childNodes.length === 1 ? titleSpan.firstChild : titleSpan;
    } else {
      titleCell = document.createTextNode('');
    }

    // Content cell: the answer (the div.faq-acc-inner-content)
    const contentDiv = headingWrapper.querySelector(':scope > .faq-acc-inner-content');
    let contentCell;
    if (contentDiv) {
      if (contentDiv.childElementCount === 1 && contentDiv.firstElementChild.tagName === 'P') {
        contentCell = contentDiv.firstElementChild;
      } else if (contentDiv.childElementCount === 0 && contentDiv.textContent.trim()) {
        contentCell = document.createTextNode(contentDiv.textContent);
      } else {
        contentCell = contentDiv;
      }
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

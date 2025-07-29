/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main FAQ accordion group
  const faqAccGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (!faqAccGroup) return;

  // Get all the accordion question blocks
  const faqHeadings = faqAccGroup.querySelectorAll(':scope > .faq-sb-heading');

  // Build the cells for the table
  const cells = [
    ['Accordion (accordion5)'] // Header row
  ];

  faqHeadings.forEach((heading) => {
    // --- Title cell ---
    const titleLink = heading.querySelector('.faq-sb-acc-heading');
    let titleElem;
    if (titleLink) {
      // Reference text node only, drop icons and attributes
      const div = document.createElement('div');
      div.textContent = titleLink.childNodes[0] ? titleLink.childNodes[0].textContent.trim() : titleLink.textContent.trim();
      titleElem = div;
    } else {
      // Fallback: use heading text
      titleElem = document.createElement('div');
      titleElem.textContent = heading.textContent.trim();
    }
    // --- Content cell ---
    const contentDiv = heading.querySelector('.faq-acc-inner-content');
    let contentElem = document.createElement('div');
    if (contentDiv) {
      // Move all child nodes (preserving formatting and links)
      Array.from(contentDiv.childNodes).forEach((n) => {
        contentElem.appendChild(n.cloneNode(true));
      });
    }

    // Add row to cells array, referencing existing elements
    cells.push([titleElem, contentElem]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

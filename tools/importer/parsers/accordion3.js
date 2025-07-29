/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one cell (block name)
  const headerRow = ['Accordion (accordion3)'];
  // Find the FAQ group container with the accordion items
  const accGroup = element.querySelector('.faq-sb-acc-group');
  if (!accGroup) return;
  // Get all the accordion items
  const accItems = Array.from(accGroup.querySelectorAll(':scope > .faq-sb-heading'));
  const rows = [headerRow];
  accItems.forEach((item) => {
    // Title cell: the text of the clickable question (from <a.faq-sb-acc-heading>)
    let titleCell = '';
    const a = item.querySelector('.faq-sb-acc-heading');
    if (a) {
      // Reference the existing <a> element, but remove trailing arrow icon
      const icon = a.querySelector('i.icon-arrow');
      if (icon) icon.remove();
      // Create a <div> with the same content as <a> (avoiding <a> for the title cell itself)
      const div = document.createElement('div');
      div.innerHTML = a.innerHTML.trim();
      titleCell = div;
    } else {
      titleCell = document.createElement('div');
      titleCell.textContent = '';
    }
    // Content cell: the expanded answer (from .faq-acc-inner-content)
    let contentCell = '';
    const contentDiv = item.querySelector('.faq-acc-inner-content');
    if (contentDiv) {
      // Reference all existing child nodes (no clone)
      const wrapper = document.createElement('div');
      Array.from(contentDiv.childNodes).forEach((n) => wrapper.appendChild(n));
      contentCell = wrapper;
    } else {
      contentCell = document.createElement('div');
      contentCell.textContent = '';
    }
    rows.push([titleCell, contentCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const cells = [
    ['Accordion (accordion27)']
  ];

  // Find the group of accordion headings
  const accGroup = element.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (!accGroup) return;
  // Each accordion item
  const accItems = accGroup.querySelectorAll(':scope > .faq-sb-heading');

  accItems.forEach((item) => {
    // Title: the <a> element inside .faq-sb-heading
    const a = item.querySelector('a.faq-sb-acc-heading');
    // Content: the div.faq-acc-inner-content (contains <p>)
    const content = item.querySelector('.faq-acc-inner-content');

    if (!a || !content) return;

    // Use only the a's text content (excluding the icon)
    // Reference the existing element (not cloning), but only the text
    let aTitleText = a.childNodes[0] ? a.childNodes[0].textContent.trim() : a.textContent.trim();
    // Wrap in <span> for block table
    const titleSpan = document.createElement('span');
    titleSpan.textContent = aTitleText;

    // For content: use all children (e.g. <p>, a, text nodes)
    const nodes = Array.from(content.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
      return false;
    });
    // If only one node, put it in directly, otherwise use array
    const contentCell = nodes.length === 1 ? nodes[0] : nodes;
    cells.push([
      titleSpan,
      contentCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

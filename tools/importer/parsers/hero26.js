/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches the example block name exactly
  const headerRow = ['Hero (hero26)'];
  // 2nd row: Background image (none in this HTML)
  const backgroundRow = [''];

  // 3rd row: Title (Heading), Subheading, CTA
  const content = [];

  // Extract the left column (contains heading and subhead)
  const leftCol = element.querySelector(':scope > div.col-md-10');
  if (leftCol) {
    // Title (heading)
    const heading = leftCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) content.push(heading);
    // Subheading (p inside a)
    const aWithP = leftCol.querySelector('a > p');
    if (aWithP && aWithP.textContent.trim()) {
      content.push(aWithP);
    }
  }

  // Extract right column (CTA, may be hidden)
  const rightCol = element.querySelector(':scope > div.col-md-2');
  if (rightCol) {
    const cta = rightCol.querySelector('a');
    if (cta && cta.textContent.trim()) {
      content.push(cta);
    }
  }

  // If everything is empty, at least produce the structure
  const contentRow = [content.length > 0 ? content : ['']];

  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

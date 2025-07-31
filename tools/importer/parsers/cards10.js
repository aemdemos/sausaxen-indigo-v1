/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the first <img> in a subtree
  function getFirstImg(el) {
    return el.querySelector('img');
  }

  // Helper to extract text content associated with an image in a grid cell
  // (In this case, there is no explicit <h2> or <p>; we keep the structure for fidelity)
  //
  // Find the two top-level columns (left: large image+labels, right: 3 smaller product images)
  const grid = element.querySelector('.mokobara-days-three > .aem-Grid');
  if (!grid) return;
  const cols = grid.querySelectorAll(':scope > .genericcontainer');
  if (cols.length !== 2) return;
  
  // -- LEFT COLUMN: Main card with feature image and text labels --
  const leftCol = cols[0];
  // Find the main feature image (open suitcase)
  let leftImg = getFirstImg(leftCol);
  // For the text cell: reference the entire leftCol, but remove all images
  let leftText = leftCol.cloneNode(true);
  leftText.querySelectorAll('img').forEach(img => img.remove());

  // -- RIGHT COLUMN: Each card is a product feature, each with its own image/text --
  const rightCol = cols[1];
  // Find all embedded cards (each .genericcontainer)
  let rightCards = Array.from(rightCol.querySelectorAll(':scope > div > div.aem-Grid > .genericcontainer'));
  // Each card is a single image with some side annotation or caption-style text
  // Defensive: If no nested .genericcontainer, fallback to direct .imagevideo columns
  if (rightCards.length === 0) {
    rightCards = Array.from(rightCol.querySelectorAll(':scope > div > div.aem-Grid > .imagevideo'));
  }

  // Compose each right card as a [img, (everything else in that card minus the image)] cell
  const rightRows = rightCards.map(card => {
    const img = getFirstImg(card);
    // For the text, reference the card but remove all images
    let textCell = card.cloneNode(true);
    textCell.querySelectorAll('img').forEach(imgEl => imgEl.remove());
    return [img, textCell];
  });

  // Assemble table cells: header, then left card, then all right cards
  const cells = [
    ['Cards (cards10)'],
    [leftImg, leftText],
    ...rightRows
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

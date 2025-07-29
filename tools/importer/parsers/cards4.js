/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the block description
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Find all direct card columns
  const row = element.querySelector('.row');
  if (!row) {
    // If no cards, do not proceed further
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }
  const cardCols = row.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Find the food card wrapper
    const card = col.querySelector('.wrap-foodmenu');
    if (!card) return;

    // Get the image (use the actual <img> element)
    let img = null;
    const picture = card.querySelector('picture');
    if (picture) {
      img = picture.querySelector('img');
    }

    // Get the food name and price
    const content = card.querySelector('.wrapfoodcontent');
    // Defensive: initialize variables
    let title = '';
    let priceDiv = null;
    if (content) {
      const titleDiv = content.querySelector('.wrap-foodname');
      if (titleDiv) title = titleDiv.textContent.trim();
      priceDiv = content.querySelector('.wrap-foodprice');
    }

    // Build the text cell contents using existing elements
    const textCell = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.push(strong);
    }
    if (priceDiv) {
      if (title) textCell.push(document.createElement('br'));
      textCell.push(priceDiv);
    }

    // Push the row (img in column 1, text in column 2)
    cells.push([
      img,
      textCell
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

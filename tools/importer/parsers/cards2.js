/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cards2)'];
  const cardRows = [];

  // Select all the card containers
  // Each card is .wrap-foodmenu inside .col-md-3.col-6.mb-30, but we just need all .wrap-foodmenu
  const cardElements = element.querySelectorAll('.wrap-foodmenu');

  cardElements.forEach(card => {
    // 1st cell: Image (reference the picture element directly)
    const picture = card.querySelector('picture');
    const imageCell = picture;

    // 2nd cell: Text content (title + price, with formatting)
    const textCell = document.createElement('div');
    const titleDiv = card.querySelector('.wrap-foodname');
    const priceDiv = card.querySelector('.wrap-foodprice');

    if (titleDiv) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textCell.appendChild(strong);
    }
    if (priceDiv) {
      textCell.appendChild(document.createElement('br'));
      // Reference the priceDiv directly (contains icon and price)
      textCell.appendChild(priceDiv);
    }

    cardRows.push([imageCell, textCell]);
  });

  // Build the table array
  const tableRows = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}

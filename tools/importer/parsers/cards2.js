/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table header as in the example
  const rows = [['Cards (cards2)']];
  // The cards are direct children of the .row.foodmenumargin container
  const row = element.querySelector('.row.foodmenumargin');
  if (!row) {
    // Element structure is not as expected, do nothing
    return;
  }
  // For each direct .col-* > .wrap-foodmenu within the row
  const cardColumns = row.querySelectorAll(':scope > div');
  cardColumns.forEach((col) => {
    const card = col.querySelector('.wrap-foodmenu');
    if (!card) return;
    // First cell: the image (the <picture> element)
    const pic = card.querySelector('picture');
    // Second cell: text content (title and price)
    const content = card.querySelector('.wrapfoodcontent');
    if (!pic || !content) return;
    // Title: .wrap-foodname
    const foodName = content.querySelector('.wrap-foodname');
    // Price and type: .wrap-foodprice (may contain icon)
    const foodPrice = content.querySelector('.wrap-foodprice');
    // Compose text cell:
    // Use a <div> containing the foodName in a <strong> or <h3>, and the foodPrice (with icons)
    const textDiv = document.createElement('div');
    if (foodName) {
      const h3 = document.createElement('h3');
      h3.textContent = foodName.textContent.trim();
      textDiv.appendChild(h3);
    }
    if (foodPrice) {
      // Instead of cloning, move the actual element (since price is always after foodName)
      textDiv.appendChild(foodPrice);
    }
    // Add the row: [image, text]
    rows.push([pic, textDiv]);
  });
  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

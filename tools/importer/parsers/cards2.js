/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards2)'];
  const rows = [headerRow];

  // Find all card wrappers
  const cardContainers = element.querySelectorAll('.wrap-foodmenu');

  cardContainers.forEach(card => {
    // IMAGE cell: Use the <picture> element (references the image)
    const picture = card.querySelector('picture');

    // TEXT cell: Name (as <strong>) and price (with icon)
    const contentDiv = card.querySelector('.wrapfoodcontent');
    let textContent = document.createElement('div');
    
    // Title
    const nameDiv = contentDiv && contentDiv.querySelector('.wrap-foodname');
    if (nameDiv && nameDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = nameDiv.textContent.trim();
      textContent.appendChild(strong);
    }

    // Price (with veg/non-veg icon)
    const priceDiv = contentDiv && contentDiv.querySelector('.wrap-foodprice');
    if (priceDiv) {
      // Ensure spacing between title and price
      if (textContent.childNodes.length) {
        textContent.appendChild(document.createElement('br'));
      }
      textContent.appendChild(priceDiv);
    }

    rows.push([
      picture,
      textContent
    ]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

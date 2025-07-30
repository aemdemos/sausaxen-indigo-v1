/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row
  const headerRow = ['Columns (columns9)'];

  // --- FIRST ROW (2 columns) ---
  // Left/top cell: Trip type + Pax selection
  const topLeft = document.createElement('div');
  const tripType = element.querySelector(':scope > .cmp-custom-drop-down');
  const paxSelection = element.querySelector(':scope > .widget-container__filter-bar__pax-selection');
  if (tripType) topLeft.appendChild(tripType);
  if (paxSelection) topLeft.appendChild(paxSelection);

  // Right/top cell: align to screenshot intent (empty or 'Special Fares' if it fits better visually)
  // But in the HTML, there is no image or visually prominent content for this cell. We'll leave it empty.
  const topRight = document.createElement('div');

  // --- SECOND ROW (2 columns) ---
  // Left/bottom cell: Special fares (if present)
  const bottomLeft = document.createElement('div');
  const specialFares = element.querySelector(':scope > .widget-container__filter-bar__specailFare');
  if (specialFares) bottomLeft.appendChild(specialFares);

  // Right/bottom cell: Currency dropdown (if present)
  const bottomRight = document.createElement('div');
  const currency = element.querySelector(':scope > .widget-container__filter-bar__currency-desktop');
  if (currency) bottomRight.appendChild(currency);

  // Compose the table in 2x2 grid following the markdown example's structure
  const cells = [
    headerRow,
    [topLeft, topRight],
    [bottomLeft, bottomRight]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}

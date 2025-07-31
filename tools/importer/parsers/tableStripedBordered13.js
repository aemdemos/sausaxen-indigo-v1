/* global WebImporter */
export default function parse(element, { document }) {
  // Table block header
  const headerRow = ['Table (striped, bordered)'];

  // Find the main tab-content block, which holds all the tab panels
  const tabContentContainer = element.querySelector('.tab-content');
  if (!tabContentContainer) return;

  // Get the nav tab names in order, as in the rendered tabs
  const navTabs = element.querySelectorAll('.nav.nav-tabs a');
  const tabNames = Array.from(navTabs).map(a => a.textContent.trim());

  // Find each .tab-pane (each country)
  const tabPanes = Array.from(tabContentContainer.children).filter(div => div.classList.contains('tab-pane'));

  // For each tab/country: create a cell with a heading and all its content, referencing existing elements.
  const tabCells = tabPanes.map((tabPane, idx) => {
    // Wrap the tab's content in a div for one cell
    const div = document.createElement('div');

    // Add a heading for the tab name, using <h3> for clarity
    const h3 = document.createElement('h3');
    h3.textContent = tabNames[idx] || `Tab ${idx+1}`;
    div.appendChild(h3);

    // Find the .textblock.section inside the tabPane
    const textblock = tabPane.querySelector('.textblock.section');
    if (textblock) {
      Array.from(textblock.children).forEach(child => {
        // Skip "clearfix" style or empty non-content divs
        if (child.classList.contains('clearfix')) return;
        // Reference the existing element, do not clone
        div.appendChild(child);
      });
    }
    return [div];
  });

  // Compose final cells array for the block table: header, then one row per tab/country
  const cells = [headerRow, ...tabCells];

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

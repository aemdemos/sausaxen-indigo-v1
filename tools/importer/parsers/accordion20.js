/* global WebImporter */
export default function parse(element, { document }) {
  const header = ['Accordion (accordion20)'];
  const rows = [header];

  // Helper: get all direct children matching selector
  const getChildren = (parent, selector) => Array.from(parent.querySelectorAll(':scope > ' + selector));

  // 1. FAQ grouped categories (accordion blocks)
  const groups = element.querySelectorAll('.faq-sb-acc-group');
  groups.forEach(group => {
    // Get the group title
    const groupHeadingA = group.querySelector('.faq-sb-heading > a');
    let groupLabel = '';
    if (groupHeadingA) {
      const copyA = groupHeadingA.cloneNode(true);
      Array.from(copyA.querySelectorAll('i')).forEach(i => i.remove());
      groupLabel = copyA.textContent.trim();
    }
    // For each accordion item in this group
    getChildren(group, '.faq-sb-acc-content').forEach(contentDiv => {
      const innerContent = contentDiv.querySelector('.faq-sb-inner-content');
      if (!innerContent) return;
      const questionA = innerContent.querySelector('a.faq-sb-acc-heading');
      let questionTitle = '';
      if (questionA) {
        const qa = questionA.cloneNode(true);
        Array.from(qa.querySelectorAll('i')).forEach(i => i.remove());
        questionTitle = qa.textContent.trim();
      }
      const accInnerContent = innerContent.querySelector('.faq-acc-inner-content');
      let answerContent = null;
      if (accInnerContent) {
        // Reference existing element (not clone)
        answerContent = accInnerContent;
      }
      // Compose row: [title, content]
      // If group has a heading, prepend it (for clarity)
      const cellTitle = groupLabel ? groupLabel + ': ' + questionTitle : questionTitle;
      rows.push([cellTitle, answerContent]);
    });
  });

  // 2. Top Questions (not inside a group)
  // These are .faq-sb-heading inside .faq-top-queries section
  const topQueriesHeader = element.querySelector('.faq-sb-top-queries.qst');
  if (topQueriesHeader) {
    // Next sibling is the container for the top questions
    let topSection = topQueriesHeader.nextElementSibling;
    if (topSection && topSection.classList.contains('faq-top-queries')) {
      // For each heading
      getChildren(topSection, '.faq-sb-heading').forEach(headingDiv => {
        const qA = headingDiv.querySelector('a.faq-sb-acc-heading');
        let title = '';
        if (qA) {
          const qa = qA.cloneNode(true);
          Array.from(qa.querySelectorAll('i')).forEach(i => i.remove());
          title = qa.textContent.trim();
        }
        // The answer is in the .faq-acc-inner-content inside the headingDiv or as next sibling
        let answerDiv = headingDiv.querySelector('.faq-acc-inner-content');
        if (!answerDiv) {
          let ns = headingDiv.nextElementSibling;
          if (ns && ns.classList.contains('faq-acc-inner-content')) {
            answerDiv = ns;
          }
        }
        rows.push([title, answerDiv]);
      });
    }
  }

  // Only include rows that have both a title and content
  const finalRows = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][1]) finalRows.push(rows[i]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(finalRows, document);
  element.replaceWith(table);
}

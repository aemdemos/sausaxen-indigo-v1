/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: matches example exactly
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // For deduplication of questions
  const seenQuestions = new Set();

  // Helper: Remove 'Read more' links that use javascript:void(0)
  function cleanContent(el) {
    if (!el) return '';
    el.querySelectorAll('a[href="javascript:void(0)"]').forEach(a => a.remove());
    return el;
  }

  // Helper: Get question string for dedupe
  function getQuestionKey(anchor) {
    if (!anchor) return '';
    // Use only visible text (skip icons)
    return Array.from(anchor.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent)
      .join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  // Extract accordion items from structured groups
  // (FAQ categories and Top Questions)
  function extractAccordionItems(element) {
    const items = [];
    // 1. Category Accordions
    element.querySelectorAll(':scope .faq-sb-acc-group').forEach(group => {
      group.querySelectorAll(':scope .faq-sb-acc-content').forEach(item => {
        const anchor = item.querySelector('.faq-sb-inner-content > a.faq-sb-acc-heading');
        if (!anchor) return;
        const questionKey = getQuestionKey(anchor);
        if (seenQuestions.has(questionKey)) return;
        seenQuestions.add(questionKey);
        // Use a div for the title cell with only the text
        const titleDiv = document.createElement('div');
        titleDiv.textContent = getQuestionKey(anchor);
        // Find the answer content
        const href = anchor.getAttribute('href');
        let contentCell = '';
        if (href && href.startsWith('#')) {
          const contentId = href.slice(1);
          const content = item.querySelector(`#${contentId}`);
          if (content) {
            cleanContent(content);
            // If there's only one child (usually <p>), use that directly
            if (content.children.length === 1) {
              contentCell = content.children[0];
            } else {
              contentCell = Array.from(content.childNodes);
            }
          }
        }
        items.push([titleDiv, contentCell]);
      });
    });
    // 2. Top Questions Accordions
    const topBlock = element.querySelector(':scope .faq-top-queries');
    if (topBlock) {
      topBlock.querySelectorAll(':scope .faq-sb-heading').forEach(heading => {
        const anchor = heading.querySelector('a.faq-sb-acc-heading');
        if (!anchor) return;
        const questionKey = getQuestionKey(anchor);
        if (seenQuestions.has(questionKey)) return;
        seenQuestions.add(questionKey);
        const titleDiv = document.createElement('div');
        titleDiv.textContent = getQuestionKey(anchor);
        const href = anchor.getAttribute('href');
        let contentCell = '';
        if (href && href.startsWith('#')) {
          const contentId = href.slice(1);
          const content = heading.querySelector(`#${contentId}`);
          if (content) {
            cleanContent(content);
            if (content.children.length === 1) {
              contentCell = content.children[0];
            } else {
              contentCell = Array.from(content.childNodes);
            }
          }
        }
        items.push([titleDiv, contentCell]);
      });
    }
    return items;
  }

  // Compose the table rows from accordion items
  extractAccordionItems(element).forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

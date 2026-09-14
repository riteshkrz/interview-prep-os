export function renderFaqModal() {
  const faqs = [
    {
      q: "How does duplicating the Notion workspace work?",
      a: "Immediately after checkout, you receive a direct Notion duplicate link. Click 'Duplicate' in the top-right corner of your Notion window, and the entire workspace is instantly cloned into your personal Notion account with all templates, databases, and checklists ready to go."
    },
    {
      q: "Do I need a paid Notion subscription?",
      a: "No. 30-Day Interview Prep OS is 100% compatible with Notion's free personal tier. You don't need Notion AI or any paid add-ons."
    },
    {
      q: "Is this designed for Senior (L5/L6) engineers?",
      a: "Yes. The workspace is specifically weighted for senior expectations: pairing high-frequency, complex DSA patterns with production-grade System Design rubrics (capacity estimations, trade-off matrices, distributed caching, partition strategies)."
    },
    {
      q: "How much time do I need each day?",
      a: "The system is structured around realistic 45–60 minute daily sessions. It avoids grueling 6-hour bootcamp burnout and focuses on consistency and spaced recall."
    },
    {
      q: "Do I get lifetime updates?",
      a: "Yes. Any future updates, new System Design architectural templates, and curated problem additions are provided free of charge for all existing buyers."
    }
  ];

  return `
    <!-- FAQ Modal Dialog -->
    <div class="dialog-backdrop" id="faq-modal" role="dialog" aria-modal="true" aria-labelledby="faq-modal-title">
      <div class="dialog-card">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--color-surface-container);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="material-symbols-outlined" style="color: var(--color-secondary); font-size: 24px;">help</span>
            <h3 class="font-headline-md" id="faq-modal-title" style="color: var(--color-on-surface);">Frequently Asked Questions</h3>
          </div>
          <button id="close-faq-modal" aria-label="Close FAQ dialog" style="width: 32px; height: 32px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; background: var(--color-surface-container); color: var(--color-on-surface); transition: background-color 0.15s ease;">
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem;">
          ${faqs.map(f => `
            <div style="padding-bottom: 1rem; border-bottom: 1px solid var(--color-surface-container);">
              <h4 class="font-headline-sm" style="font-size: 15px; color: var(--color-on-surface); margin-bottom: 0.375rem;">${f.q}</h4>
              <p class="font-body-sm" style="color: var(--color-on-surface-variant); line-height: 1.6;">${f.a}</p>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
          <button id="close-faq-modal-btn" class="btn-primary" style="height: 40px; padding: 0 var(--space-xl); font-size: 13px;">
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  `;
}

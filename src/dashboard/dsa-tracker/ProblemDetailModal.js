import { renderUrlShortenerInterviewDesign } from '../weeks/index.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderProblemDetailModal(item) {
  if (!item) return '';

  const isSpec = Boolean(item.rubric);

  return `
    <div class="spec-modal-backdrop" id="spec-detail-modal">
      <div class="spec-modal-card" style="${isSpec ? 'max-width: 54rem;' : ''}">
        <!-- Modal Header -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid var(--color-surface-container);">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="font-code-sm" style="background-color: var(--color-secondary-fixed); color: var(--color-on-secondary-fixed-variant); padding: 0.125rem 0.5rem; border-radius: var(--radius-xs); font-weight: 600;">
                ${isSpec ? 'SYSTEM DESIGN SPECIFICATION' : 'DSA PATTERN GUIDE'}
              </span>
              <span style="font-size: 11px; padding: 0.125rem 0.5rem; border-radius: var(--radius-xs); background-color: ${item.difficulty === 'Hard' ? 'var(--color-error-container)' : item.difficulty === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}; color: ${item.difficulty === 'Hard' ? 'var(--color-error)' : item.difficulty === 'Medium' ? '#F59E0B' : '#10B981'}; font-weight: 600;">
                ${escapeHtml(item.difficulty || 'Medium')}
              </span>
              ${item.orderIndex ? `
                <span class="font-code-sm" style="font-size: 11px; color: var(--color-on-surface-variant);">
                  #${item.orderIndex}
                </span>
              ` : ''}
            </div>
            <h2 class="font-headline-md" style="color: var(--color-on-surface); font-size: 22px;">
              ${escapeHtml(item.title)}
            </h2>
            <p class="font-body-sm" style="color: var(--color-on-surface-variant); margin-top: 0.25rem;">
              Domain / Pattern: <strong>${escapeHtml(item.pattern || item.domain || 'Algorithmic Problem')}</strong> 
              ${item.category ? `• Category: <strong>${escapeHtml(item.category)}</strong>` : ''}
              • Status: <strong>${escapeHtml(item.status || 'Queued')}</strong>
            </p>
          </div>

          <button id="close-spec-modal-btn" aria-label="Close" style="background: var(--color-surface-container); border: none; border-radius: var(--radius-full); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-on-surface);">
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
          </button>
        </div>

        <!-- Content Body -->
        ${isSpec ? (
          String(item.id) === 'sd-1' ? `
            <div style="margin-top: 1rem;">
              ${renderUrlShortenerInterviewDesign(item)}
            </div>
            ${(item.referenceLinks || item.reference_links || []).length > 0 ? `
              <div class="rubric-section" style="margin-top: 1rem;">
                <div class="rubric-section-title">Reference Reading &amp; Architecture Deep Dives</div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                  ${(item.referenceLinks || item.reference_links).map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--color-surface-container-high); border-radius: var(--radius-sm); color: #38BDF8; font-size: 12px; text-decoration: none; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.2s;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="material-symbols-outlined" style="font-size: 15px; color: #818CF8;">link</span>
                        <span style="font-weight: 500;">${link.title}</span>
                      </div>
                      <span class="material-symbols-outlined" style="font-size: 14px; opacity: 0.7;">open_in_new</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          ` : `
          <div class="rubric-section">
            <div class="rubric-section-title">1. Functional &amp; Capacity Scope</div>
            <p class="font-body-sm" style="color: var(--color-on-surface); line-height: 1.6;">
              ${item.rubric.scope}
            </p>
          </div>

          <div class="rubric-section">
            <div class="rubric-section-title">2. API Contract &amp; Protocols</div>
            <code class="font-code-sm" style="display: block; background-color: var(--color-surface-container-highest); padding: 0.75rem; border-radius: var(--radius-sm); color: var(--color-on-surface); white-space: pre-wrap; word-break: break-all;">
${item.rubric.api}
            </code>
          </div>

          <div class="rubric-section">
            <div class="rubric-section-title">3. Data Model &amp; Partitioning Architecture</div>
            <p class="font-body-sm" style="color: var(--color-on-surface); line-height: 1.6;">
              ${item.rubric.dataModel}
            </p>
          </div>

          <div class="rubric-section">
            <div class="rubric-section-title">4. Senior Deep-Dive &amp; Trade-off Analysis</div>
            <p class="font-body-sm" style="color: var(--color-on-surface); line-height: 1.6;">
              ${item.rubric.deepDive}
            </p>
          </div>

          ${(item.referenceLinks || item.reference_links || []).length > 0 ? `
            <div class="rubric-section">
              <div class="rubric-section-title">5. Reference Reading &amp; Architecture Deep Dives</div>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                ${(item.referenceLinks || item.reference_links).map(link => `
                  <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--color-surface-container-high); border-radius: var(--radius-sm); color: #38BDF8; font-size: 12px; text-decoration: none; border: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <span class="material-symbols-outlined" style="font-size: 15px; color: #818CF8;">link</span>
                      <span style="font-weight: 500;">${link.title}</span>
                    </div>
                    <span class="material-symbols-outlined" style="font-size: 14px; opacity: 0.7;">open_in_new</span>
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        `) : `
          <!-- DSA Problem Presentation -->
          <div class="rubric-section">
            <div class="rubric-section-title">1. Problem Summary &amp; Objective</div>
            <p class="font-body-sm" style="color: var(--color-on-surface); line-height: 1.7; font-size: 14px; background: rgba(15, 23, 42, 0.5); padding: 0.85rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid #38BDF8;">
              ${escapeHtml(item.description || 'Master core algorithmic problem-solving techniques and optimal data structure choices.')}
            </p>
          </div>

          <div class="rubric-section">
            <div class="rubric-section-title">2. Algorithmic Pattern &amp; Focus</div>
            <p class="font-body-sm" style="color: var(--color-on-surface); line-height: 1.6;">
              Mastery of this problem relies on the <strong>${escapeHtml(item.pattern || item.category || 'Core DSA')}</strong> technique. Ensure you can dry-run the optimal complexity before coding:
            </p>
            <ul class="font-body-sm" style="margin-top: 0.5rem; padding-left: 1.25rem; color: var(--color-on-surface-variant); line-height: 1.6;">
              <li>Target optimal time and auxiliary space bounds before implementation.</li>
              <li>Identify edge cases (empty inputs, single element, boundary extremes, negatives/overflow).</li>
              <li>State the invariant or pointer/state progression clearly.</li>
            </ul>
          </div>

          ${item.link ? `
            <div class="rubric-section">
              <div class="rubric-section-title">3. LeetCode Practice Link</div>
              <div style="margin-top: 0.5rem;">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: var(--radius-sm); color: #38BDF8; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">open_in_new</span>
                  <span>Solve "${escapeHtml(item.title)}" on LeetCode</span>
                </a>
              </div>
            </div>
          ` : ''}
        `}

        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-surface-container);">
          ${!isSpec && item.link ? `
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="height: 38px; font-size: 13px; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0 0.85rem; text-decoration: none; border-radius: var(--radius-sm);">
              <span class="material-symbols-outlined" style="font-size: 15px;">open_in_new</span>
              LeetCode
            </a>
          ` : ''}
          <button id="close-spec-modal-bottom-btn" class="btn-primary" style="height: 38px; font-size: 13px;">
            ${isSpec ? 'Close Spec' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  `;
}

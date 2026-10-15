/* Static cards remain available offline. Search includes every tool in each package. */
'use strict';
(() => {
  const input = document.getElementById('package-search');
  const cards = Array.from(document.querySelectorAll('.package-card'));
  const filters = Array.from(document.querySelectorAll('[data-package-kind]'));
  const params = new URLSearchParams(location.search);
  let kind = filters.some(b => b.dataset.packageKind === params.get('kind')) ? params.get('kind') : '';
  input.value = params.get('q') || '';
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase('zh-CN');
    let count = 0;
    cards.forEach(card => {
      card.hidden = !!((kind && card.dataset.kind !== kind) || (query && !card.dataset.search.toLocaleLowerCase('zh-CN').includes(query)));
      if (!card.hidden) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.packageKind === kind)));
    document.getElementById('package-status').textContent = `${count} 个工具包${query ? ` · 包含“${input.value.trim()}”` : ''}`;
    document.getElementById('package-empty').hidden = count !== 0;
  };
  input.addEventListener('input', filter);
  document.getElementById('package-search-form').addEventListener('submit', event => { event.preventDefault(); filter(); });
  document.getElementById('package-clear').addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
  document.getElementById('package-reset').addEventListener('click', () => { input.value = ''; kind = ''; filter(); input.focus(); });
  filters.forEach(button => button.addEventListener('click', () => { kind = button.dataset.packageKind; filter(); }));
  filter();
})();

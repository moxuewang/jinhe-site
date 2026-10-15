/* No dependencies, trackers, or remote assets. Directory filtering works offline. */
'use strict';
(() => {
  const input = document.getElementById('tool-search');
  if (input) {
    const rows = Array.from(document.querySelectorAll('.tool-row'));
    const buttons = Array.from(document.querySelectorAll('[data-category]'));
    const status = document.getElementById('results-status');
    const empty = document.getElementById('empty-results');
    let category = '';
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    const requested = params.get('cat') || '';
    if (buttons.some(button => button.dataset.category === requested)) category = requested;
    const filter = () => {
      const query = input.value.trim().toLocaleLowerCase('zh-CN');
      let count = 0;
      rows.forEach(row => {
        const match = (!category || row.dataset.cat === category) && (!query || row.querySelector('div').textContent.toLocaleLowerCase('zh-CN').includes(query));
        row.hidden = !match;
        if (match) count++;
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
      status.textContent = `${category || '全部类别'} · ${count} 件工具${query ? ` · 搜索“${input.value.trim()}”` : ''}`;
      empty.hidden = count !== 0;
    };
    input.addEventListener('input', filter);
    document.querySelector('.search-form').addEventListener('submit', event => { event.preventDefault(); filter(); });
    document.getElementById('clear-search').addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
    buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.category; filter(); }));
    document.getElementById('reset-filters').addEventListener('click', () => { input.value = ''; category = ''; filter(); input.focus(); });
    filter();
  }

  const demos = {
    image: ['旅行随手拍.jpg', '图片材料', '图片压缩 → 工作台 → 图片转 PDF', '做成一份 PDF'],
    text: ['整理后的文字', '文字材料', '文本转换 → 工作台 → 文本统计', '看看有多少字'],
    file: ['整理好的文件', '文件材料', '文件管家 → 工作台 → 保存文件', '把文件保存下来']
  };
  document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
    const demo = demos[button.dataset.demo];
    ['demo-name','demo-type','demo-route','demo-next'].forEach((id, index) => { document.getElementById(id).textContent = demo[index]; });
    document.querySelectorAll('[data-demo]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('demo-status').textContent = `界面示意：${demo[2]}，${demo[3]}。`;
  }));

  /* Only the release manifest is fetched. Failures keep the stable Release page. */
  if (document.querySelector('[data-download]') && location.protocol !== 'file:') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    fetch('https://github.com/moxuewang/jinhe-releases/releases/latest/download/version.json', {
      signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer'
    }).then(response => {
      if (!response.ok) throw new Error('manifest unavailable');
      return response.json();
    }).then(version => {
      if (typeof version.url !== 'string') return;
      const url = new URL(version.url);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.username || url.password || url.port || url.search || url.hash) return;
      if (!/^\/moxuewang\/jinhe-releases\/releases\/download\/[^/]+\/[^/]+\.apk$/i.test(url.pathname)) return;
      document.querySelectorAll('[data-download]').forEach(link => { link.href = url.href; });
      if (typeof version.versionName === 'string' && /^\d+\.\d+\.\d+$/.test(version.versionName) && Number.isSafeInteger(version.size) && version.size > 0) {
        document.getElementById('release-meta').textContent = `当前正式版 ${version.versionName} · 安装包约 ${(version.size / 1048576).toFixed(0)} MiB`;
      }
    }).catch(() => { /* Stable official Release URL remains available. */ }).finally(() => clearTimeout(timer));
  }
})();

/* STAR Lab site script — header/footer, KO/EN content toggle, data-driven pages */
(function () {
  const D = window.STAR || {};
  const NAV = [['about', 'About'], ['members', 'Members'], ['alumni', 'Alumni'], ['publications', 'Publications'], ['projects', 'Projects'], ['news', 'News'], ['gallery', 'Gallery'], ['contact', 'Contact']];
  const I18N = {
    labKo: '국토정책연구실', labEn: 'Spatial Thinking and Research Lab',
    footer: { addr: ['서울특별시 동대문구 서울시립대로 163 서울시립대학교 21세기관 718호 (02504)', '21st Century Bldg. Rm 718, 163 Seoulsiripdae-ro, Dongdaemun-gu, Seoul 02504, Korea'], dept: ['서울시립대학교 도시행정학과', 'Dept. of Urban Administration, University of Seoul'] },
    pub: { all: ['전체', 'All'], search: ['제목·저자·학술지 검색', 'Search title, author or journal'], abs: ['초록', 'Abstract'], link: ['원문', 'Full text'], cite: ['인용 복사', 'Cite'], copied: ['복사됨', 'Copied'], n: ['편', 'papers'], accepted: ['게재 확정', 'Accepted'] },
    proj: { all: ['전체', 'All'], pi: ['연구책임', 'Principal investigator'], co: ['공동연구', 'Co-investigator'], ongoing: ['진행 중', 'Ongoing'], on: ['진행중', 'Ongoing'], piTag: ['연구책임', 'PI'], coTag: ['공동연구', 'Co-I'] },
    news: { all: ['전체', 'All'], media: ['언론·칼럼', 'Media'], award: ['수상', 'Awards'], lab: ['연구실', 'Lab'], activity: ['학술활동', 'Activities'], read: ['기사 보기', 'Read article'], photo: ['사진', 'Photo'] },
    mem: { PhD: ['박사과정', 'Ph.D. student'], MS: ['석사과정', 'M.S. student'], phdDeg: ['박사', 'Ph.D.'], msDeg: ['석사', 'M.S.'], name: ['이름', 'Name'], program: ['과정', 'Program'], major: ['전공', 'Major'], interests: ['연구 관심', 'Research interests'], affil: ['소속', 'Affiliation'], ft: ['전일제', 'Full-time'], pt: ['재직자', 'Working professionals'] },
    prog: { grad: ['일반대학원', 'Graduate School'], urban: ['도시과학대학원', 'Graduate School of Urban Sciences'], intl: ['국제도시과학대학원', 'International School of Urban Sciences'] },
    more: ['전체 보기', 'View all'], lang: ['EN', '한국어']
  };
  const lang = () => document.documentElement.lang === 'en' ? 1 : 0;
  const t = a => a[lang()];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const year = p => parseInt(String(p.date).slice(0, 4), 10);
  const fmtDate = d => String(d).replace(/-/g, '.');
  window.imgFallback = function (im) { const a = im.dataset.alt; if (a) { im.dataset.alt = ''; im.src = a; } else { im.onerror = null; im.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; } };
  const initials = n => { const p = n.trim().split(/\s+/); return (p.length > 1 ? p[0][0] + p[p.length - 1][0] : n.slice(0, 2)).toUpperCase(); };

  function initLang() { let lg = 'ko'; try { lg = localStorage.getItem('star-lang') || 'ko'; } catch (e) {} document.documentElement.lang = lg; }
  function toggleLang() { const next = lang() ? 'ko' : 'en'; document.documentElement.lang = next; try { localStorage.setItem('star-lang', next); } catch (e) {} render(); }

  const page = () => document.body.dataset.page || (document.getElementById('page-root') || { dataset: {} }).dataset.page || 'index';
  function header() {
    const cur = page();
    return `<div class="wrap">
      <a class="brand" href="index.html"><b>STAR Lab</b><i></i><small>${lang() ? 'University of Seoul' : I18N.labKo}</small></a>
      <nav class="nav" id="nav">${NAV.map(([p, l]) => `<a href="${p}.html" ${p === cur ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
      <div class="tools"><button class="btn-ghost" id="lang-btn" type="button">${t(I18N.lang)}</button><button class="btn-ghost menu-btn" id="menu-btn" type="button" aria-label="menu">☰</button></div></div>`;
  }
  function footer() {
    return `<div class="wrap">
      <div><b>Spatial Thinking and Research Lab (STAR Lab)</b>${I18N.labKo} · ${t(I18N.footer.dept)}<br><span class="addr" style="opacity:.75">${t(I18N.footer.addr)}</span></div>
      <div><b>Menu</b>${NAV.map(([p, l]) => `<a href="${p}.html">${l}</a>`).join('<br>')}</div>
      <div><b>Contact</b>Prof. Mingyu Kang<br>mgkang23@uos.ac.kr<br>+82-2-6490-2725</div>
      <div class="copy">© ${new Date().getFullYear()} Spatial Thinking and Research Lab, University of Seoul.</div></div>`;
  }

  /* hero: video when present, canvas night-lights fallback */
  function hero() {
    const v = document.getElementById('hero-video'), cv = document.getElementById('ntl');
    if (v && cv) { v.addEventListener('error', () => { v.remove(); ntl(cv); }, { once: true }); v.addEventListener('canplay', () => { cv.remove(); }, { once: true }); setTimeout(() => { if (document.body.contains(cv) && v.readyState < 2) ntl(cv); }, 2500); }
    else if (cv) ntl(cv);
  }
  function ntl(cv) {
    const ctx = cv.getContext('2d'); const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W, H, pts = [], raf; const rnd = (a, b) => a + Math.random() * (b - a);
    const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    function build() { const r = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); pts = [];
      const centers = []; for (let i = 0; i < Math.max(14, Math.round(W / 70)); i++) centers.push({ x: rnd(.05, .95) * W, y: rnd(.08, .8) * H, s: rnd(20, 110), n: rnd(40, 320) });
      centers[0] = { x: W * .62, y: H * .38, s: 150, n: 900 };
      centers.forEach(c => { for (let i = 0; i < c.n; i++) pts.push({ x: c.x + gauss() * c.s, y: c.y + gauss() * c.s * .72, b: rnd(.25, 1), r: rnd(.6, 1.6), ph: rnd(0, 6.28) }); });
      for (let i = 0; i < W * H / 9000; i++) pts.push({ x: rnd(0, W), y: rnd(0, H), b: rnd(.1, .4), r: rnd(.4, 1), ph: rnd(0, 6.28) }); }
    function draw(tm) { ctx.clearRect(0, 0, W, H); ctx.strokeStyle = 'rgba(255,255,255,.045)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke(); }
      const tt = (tm || 0) / 1000;
      for (const p of pts) { const a = p.b * (reduce ? 1 : (.75 + .25 * Math.sin(tt * .9 + p.ph))); ctx.fillStyle = `rgba(230,176,76,${a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        if (p.b > .7) { ctx.fillStyle = `rgba(255,217,138,${a * .18})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill(); } }
      if (!reduce) raf = requestAnimationFrame(draw); }
    build(); draw(0); addEventListener('resize', () => { cancelAnimationFrame(raf); build(); draw(0); });
  }

  /* ---------- youtube (click to play; opens YouTube when served from file://) ---------- */
  function ytLite(root) {
  (root || document).querySelectorAll('.video[data-yt]').forEach(v => {
    if (v.dataset.ytReady) return; v.dataset.ytReady = '1';
    const id = v.dataset.yt, title = v.dataset.title || '';
    v.innerHTML = `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><button type="button" class="play" aria-label="play ${esc(title)}"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>`;
    v.addEventListener('click', () => {
      if (!/(^localhost$|^127\.|mingyukang\.com$|github\.io$)/.test(location.hostname)) { window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener'); return; }
      v.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    });
  });
  }

  /* ---------- home ---------- */
  function renderHome() {
    const s = document.getElementById('stats'); if (!s) return;
    const items = [[D.publications.length, ['학술논문', 'Journal articles']], [D.projects.filter(p => p.start >= 2020).length, ['연구과제', 'Research projects']], [D.members.filter(m => m.prog === 'grad').length, ['연구원', 'Researchers']], [D.alumni.length, ['졸업생', 'Alumni']]];
    s.innerHTML = items.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${t(l)}</span></div>`).join('');
    const nl = document.getElementById('home-news'); if (nl) nl.innerHTML = D.news.slice(0, 4).map(newsItem).join('');
    const pl = document.getElementById('home-pubs'); if (pl) pl.innerHTML = D.publications.slice(0, 4).map(pubItem).join('');
    const rg = document.getElementById('home-research'); if (rg) rg.innerHTML = researchCards();
    renderMedia();
  }

  /* ---------- media (home) ---------- */
  function renderMedia() {
    const el = document.getElementById('media'); if (!el) return;
    const vs = D.videos || [];
    if (!vs.length) { el.closest('section').style.display = 'none'; return; }
    el.className = 'grid ' + (vs.length === 1 ? 'c2' : vs.length === 2 ? 'c2' : 'c3');
    el.innerHTML = vs.map(v => {
      const ttl = lang() && v.title_en ? v.title_en : v.title;
      return `<div><div class="video" data-yt="${esc(v.yt)}" data-title="${esc(ttl)}"></div><p class="small muted" style="margin-top:8px">${esc(ttl)}</p></div>`;
    }).join('');
    ytLite(el);
  }

  /* ---------- research ---------- */
  const ICONS = {
    map: '<svg viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></svg>',
    data: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="14" r="1" fill="currentColor"/><circle cx="12" cy="7" r="1" fill="currentColor"/></svg>',
    gov: '<svg viewBox="0 0 24 24"><path d="M3 21h18M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M2 10l10-6 10 6"/></svg>',
    house: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/><path d="M2 20h20"/></svg>'
  };
  const AREAS = [
    { ico: 'map', ko: '국토도시정책', en: 'Territorial & Urban Policy', short: ['지역균형발전, 지방소멸 대응 등을 위한 증거기반 국토·도시정책', 'Evidence-based territorial and urban policy for issues such as balanced regional development and local extinction'],
      ko2: '지역균형발전, 지방소멸, 초광역 연합, 도시 네트워크의 경제적 파급효과 등을 공간계량모형으로 분석하고, 증거기반 국토계획을 위한 국토모니터링, 지방소멸대응기금 배분 체계 연구 등으로 정책에 연결합니다.',
      en2: 'Spatial econometric analysis of balanced regional development, local extinction, mega-regional unions, the economic spillovers of urban networks and related questions, linked to policy through work on territorial monitoring for evidence-based planning and on the allocation of the Local Extinction Response Fund.' },
    { ico: 'data', ko: '도시데이터사이언스', en: 'Urban Data Science', short: ['위성, 센서, GPS 빅데이터 등으로 도시를 측정하고 예측하는 공간 데이터과학', 'Spatial data science that measures and forecasts cities with satellite, sensor and GPS big data'],
      ko2: '야간조명(NTL) 위성영상, IoT 도시센서(S-DoT), GPS 이동 데이터, 토지이용 변화 자료 등을 결합해 도시화 패턴과 온실가스 배출, 유동인구, 폭염 취약성 등을 측정하고 예측합니다. 머신러닝과 공간 빅데이터 분석이 핵심 도구입니다.',
      en2: 'Night-time light imagery, IoT urban sensors (S-DoT), GPS mobility traces, land-use change data and other sources are combined to measure and forecast urbanisation patterns, greenhouse-gas emissions, floating population, heat-wave vulnerability and related phenomena, with machine learning and spatial big-data analysis as the main tools.' },
    { ico: 'gov', ko: '데이터과학기반행정', en: 'Data-driven Public Administration', short: ['행정 현장의 데이터를 증거로 바꾸는 분석 체계와 정책 시뮬레이션', 'Turning administrative data into evidence for policy simulation and decision support'],
      ko2: '민원 텍스트의 개체명 인식과 공간정보 추출, 자치단체 재정지표의 유형화, 지방의회 정책변동 분석 등 행정 현장의 데이터를 분석 가능한 형태로 만들고, 정책 시뮬레이션과 의사결정 지원 등에 적용합니다.',
      en2: 'Administrative data — from named-entity recognition and spatial extraction in civil-complaint texts to typologies of municipal fiscal indicators and analyses of local-council policy change — are turned into analysable form and applied to policy simulation, decision support and similar uses.' },
    { ico: 'house', ko: '토지주택부동산', en: 'Land, Housing & Real Estate', short: ['토지·주택·부동산 시장의 실증 분석과 주택공급·제도 연구', 'Empirical analysis of land and housing markets, housing supply and institutions'],
      ko2: '공공임대주택의 출산 효과, 주택 자산효과, 역세권 지가, 토지경매 낙찰가, 전통시장 임대료 등 토지·주택·부동산 시장을 준실험설계, 헤도닉 모형, 기계학습 등으로 실증 분석하고, 주택공급 실행모델과 부동산 제도 개선 등을 연구합니다.',
      en2: 'Land, housing and real-estate markets — the fertility effect of public rental housing, housing wealth effects, station-area land prices, auction bids, market rents and more — analysed with quasi-experimental designs, hedonic models and machine learning, alongside work on housing-supply models and institutional reform.' }
  ];
  function researchCards() {
    return AREAS.map(a => `<div class="rcard" tabindex="0">
      <div class="ico">${ICONS[a.ico]}</div>
      <h3>${lang() ? a.en : a.ko}</h3><span class="en">${lang() ? a.ko : a.en}</span>
      <p class="short">${t(a.short)}</p>
      <div class="over"><h4>${a.en}</h4><p>${a.ko2}</p><p class="en">${a.en2}</p></div></div>`).join('');
  }
  function renderResearch() { const el = document.getElementById('research-cards'); if (el) el.innerHTML = researchCards(); }

  /* ---------- news ---------- */
  function newsItem(n) {
    const cat = n.cat ? `<span class="nc">${t(I18N.news[n.cat])}</span>` : '';
    const acts = [];
    if (n.link) acts.push(`<a class="nact" href="${esc(n.link)}" target="_blank" rel="noopener">${t(I18N.news.read)}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg></a>`);
    if (n.img) acts.push(`<button class="nact" type="button" data-img="${esc(n.img)}" data-alt="${esc(n.img_src||'')}" data-cap="${esc(n.title)}">${t(I18N.news.photo)}<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="1.5" y="2" width="9" height="8" rx="1"/><path d="M1.5 8l2.5-2.5 2 2 1.5-1.5L10.5 8"/></svg></button>`);
    return `<li class="ncard"><div class="nm"><div class="nh"><time>${fmtDate(n.date)}</time>${cat}</div><div class="t">${esc(n.title)}</div>${n.body ? `<div class="b">${esc(n.body)}</div>` : ''}</div>${acts.length ? `<div class="na">${acts.join('')}</div>` : ''}</li>`;
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-img]'); if (!b) return;
    let lb = document.getElementById('lb');
    if (!lb) { lb = document.createElement('div'); lb.id = 'lb'; lb.className = 'lb'; lb.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button class="lb-x" type="button" aria-label="close">×</button>'; document.body.appendChild(lb);
      lb.addEventListener('click', ev => { if (!ev.target.closest('img')) lb.hidden = true; });
      document.addEventListener('keydown', ev => { if (ev.key === 'Escape') lb.hidden = true; }); }
    const im = lb.querySelector('img'); im.dataset.alt = b.dataset.alt || ''; im.onerror = () => { if (im.dataset.alt) { const a = im.dataset.alt; im.dataset.alt = ''; im.src = a; } else { lb.querySelector('figcaption').textContent = lang() ? 'Image not available yet.' : '사진 파일이 아직 준비되지 않았습니다.'; } }; im.src = b.dataset.img;
    lb.querySelector('figcaption').textContent = b.dataset.cap || ''; lb.hidden = false;
  });
  function renderNews() {
    const el = document.getElementById('news-list'); if (!el) return;
    const fl = document.getElementById('news-filters'); let cur = 'all', lim = 15;
    function draw() { fl.innerHTML = ['all', 'media', 'award', 'lab', 'activity'].map(c => `<button class="chip" aria-pressed="${c === cur}" data-c="${c}">${t(I18N.news[c])}</button>`).join('');
      const rows = D.news.filter(n => cur === 'all' || n.cat === cur); const years = [...new Set(rows.map(n => String(n.date).slice(0, 4)))];
      el.innerHTML = years.map(y => `<div class="ny"><div class="ny-y">${y}</div><ul class="news-list">${rows.filter(n => String(n.date).startsWith(y)).map(newsItem).join('')}</ul></div>`).join(''); }
    fl.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { cur = b.dataset.c; lim = 15; draw(); } }); draw();
  }

  /* ---------- publications ---------- */
  function pubItem(p) {
    const acc = String(p.vol || '').toLowerCase() === 'accepted';
    const idx = p.index ? `<span class="ix ${/KCI/.test(p.index) ? 'kci' : 'sci'}">${esc(p.index)}</span>` : '';
    const acts = acc ? `<span class="accepted">${t(I18N.pub.accepted)}</span>` : `${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${t(I18N.pub.link)}</a>` : ''}${p.abstract ? `<button type="button" data-abs>${t(I18N.pub.abs)}</button>` : ''}`;
    return `<div class="pub" data-id="${p.id}">
      <div><div class="t">${esc(p.title)}${idx}</div><div class="a">${esc(p.author)}</div><div class="j"><i>${esc(p.journal)}</i>${p.vol && !acc ? ', ' + esc(p.vol) : ''} · ${esc(p.date)}</div></div>
      <div class="act">${acts}</div>
      ${p.abstract && !acc ? `<div class="abs">${esc(p.abstract)}</div>` : ''}</div>`;
  }
  function renderPubStats() {
    const el = document.getElementById('pub-stats'); if (!el) return;
    const P = D.publications; const journals = new Set(P.map(p => p.journal)); const authors = new Set(); P.forEach(p => p.author.split('·').forEach(a => authors.add(a.trim())));
    const tiles = [[P.length, ['편', ''], ['학술논문', 'Journal articles']], [journals.size, ['종', ''], ['게재 학술지', 'Journals']], [authors.size - 1, ['명', ''], ['공동연구자', 'Co-authors']]];
    el.innerHTML = `<div class="pstats">${tiles.map(([n, u, l]) => `<div class="pst"><b>${n}<small>${t(u)}</small></b><span>${t(l)}</span></div>`).join('')}</div>`;
  }
  function renderPubs() {
    renderPubStats();
    const el = document.getElementById('pub-list'); if (!el) return;
    const q = document.getElementById('pub-q'), fl = document.getElementById('pub-filters'), cnt = document.getElementById('pub-count');
    const years = [...new Set(D.publications.map(year))].sort((a, b) => b - a); let yr = 'all';
    function draw() { if (!fl.querySelector('select')) { fl.innerHTML = `<select id="pub-year" class="sel"><option value="all">${t(I18N.pub.all)}</option>${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select>`; fl.querySelector('select').addEventListener('change', e => { yr = e.target.value; draw(); }); }
      const s = (q.value || '').toLowerCase();
      const rows = D.publications.filter(p => (yr === 'all' || year(p) === +yr) && (!s || (p.title + p.author + p.journal).toLowerCase().includes(s)));
      cnt.textContent = `${rows.length} ${t(I18N.pub.n)}`;
      let html = '', last = null; rows.forEach(p => { const y = year(p); if (y !== last) { html += `<div class="pub-year">${y}</div>`; last = y; } html += pubItem(p); });
      el.innerHTML = html || '<p class="muted">—</p>'; }
    q.placeholder = t(I18N.pub.search); q.addEventListener('input', draw);
    draw();
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-abs]'); if (a) { a.closest('.pub').classList.toggle('open'); return; }
  });

  /* ---------- projects ---------- */
  function renderProjects() {
    const el = document.getElementById('proj-list'); if (!el) return;
    const fl = document.getElementById('proj-filters'); let cur = 'all'; const now = new Date().getFullYear();
    function draw() { fl.innerHTML = ['all', 'ongoing', 'pi', 'co'].map(c => `<button class="chip" aria-pressed="${c === cur}" data-c="${c}">${t(I18N.proj[c])}</button>`).join('');
      const live = p => p.end >= now && p.status !== 'done';
      const sel = D.projects.filter(p => cur === 'all' || (cur === 'pi' && p.role === 'PI') || (cur === 'co' && p.role !== 'PI') || (cur === 'ongoing' && live(p))).slice().sort((a, b) => (live(b) - live(a)) || (b.start - a.start));
      const rows = sel.filter(p => p.start >= 2020), prior = sel.filter(p => p.start < 2020);
      const item = p => `<div class="proj"><div class="y">${p.start}${p.end !== p.start ? '–' + p.end : ''}</div><div><div class="t">${p.role === 'PI' ? `<span class="st lead">${t(I18N.proj.piTag)}</span>` : `<span class="st co">${t(I18N.proj.coTag)}</span>`}<span>${esc(p.title)}</span></div><div class="f">${esc(p.funder)}${live(p) ? `<span class="on2">${t(I18N.proj.on)}</span>` : ''}</div></div></div>`;
      el.innerHTML = rows.map(item).join('') + (prior.length ? `<details class="prior"><summary><span class="only-ko">서울시립대 부임 이전 수행 과제 ${prior.length}건 (2008–2019)</span><span class="only-en">${prior.length} projects before joining the University of Seoul (2008–2019)</span></summary><p class="small muted only-ko">국토연구원 재직 및 University of Washington 박사과정 중 수행한 과제입니다.</p><p class="small muted only-en">Carried out at the Korea Research Institute for Human Settlements and during doctoral study at the University of Washington.</p>${prior.map(item).join('')}</details>` : '');
      const pc = document.getElementById('proj-count'); if (pc) pc.textContent = ''; }
    fl.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { cur = b.dataset.c; draw(); } }); draw();
  }

  /* ---------- members / alumni ---------- */
  /* 영문 모드 표기: 공식 영문명이 확실한 기관만 치환하고, 나머지는 한글 그대로 둔다 */
  const AFFIL_EN = {
    '국토연구원': 'Korea Research Institute for Human Settlements (KRIHS)',
    '한국토지주택공사': 'Korea Land & Housing Corporation (LH)',
    '국토교통부': 'Ministry of Land, Infrastructure and Transport',
    '서울시의회': 'Seoul Metropolitan Council',
    '성동구의회': 'Seongdong-gu Council, Seoul',
    '경상북도의회사무처': 'Gyeongsangbuk-do Provincial Council Secretariat',
    '전국시도지사협의회': 'Governors Association of Korea',
    '경기연구원': 'Gyeonggi Research Institute',
    '서울교통공사': 'Seoul Metro',
    '금융감독원': 'Financial Supervisory Service',
    '신용보증기금': 'Korea Credit Guarantee Fund (KODIT)',
    '소상공인시장진흥공단': 'Small Enterprise and Market Service (SEMAS)',
    '국민연금': 'National Pension Service',
    '국민은행': 'KB Kookmin Bank',
    '양주시청': 'Yangju City',
    '구리도시공사': 'Guri Urban Corporation',
    '의정부도시공사': 'Uijeongbu Urban Corporation',
    '리파인': 'REFINE Co., Ltd.',
    '삼창감정평가법인': 'Samchang Appraisal',
    '더가능연구소': 'The Possibility Lab',
    '참세무법인': 'Cham Tax Accounting Firm',
    '호연부동산중개법인': 'Hoyeon Real Estate Brokerage',
    '두루종합건설': 'Duru Construction',
    '건축사사무소 토루': 'TORU Architects',
    '종합건축사사무소 근정': 'Keunjeong Architects & Engineers',
    '재원 법무사 사무소': 'Jaewon Judicial Scrivener Office',
    '한국감정원': 'Korea Appraisal Board',
    '쿠시먼 웨이크필드': 'Cushman & Wakefield',
    '마스턴투자운용': 'Mastern Investment Management',
    'SK건설': 'SK Engineering & Construction',
    '삼표산업': 'Sampyo Industries',
    'KDI': 'Korea Development Institute (KDI)'
  };
  const affilTxt = x => (lang() && AFFIL_EN[x.affil]) ? AFFIL_EN[x.affil] : (x.affil || '');
  const TOPIC_EN = {
    '부동산시장분석': 'Real estate market analysis',
    '지속가능개발&하우징': 'Sustainable Housing & Development',
    '보행중심계획': 'Pedestrian-Centric Planning',
    '도시보건정책': 'Urban Health Policy',
    '통계조사방법론': 'Quantitative Research',
    'GIS&네트워크분석': 'GIS & Network Analysis',
    '도시 및 국토계획': 'Urban and regional planning', '도시재난': 'Urban disasters',
    '도시데이터사이언스': 'Urban data science', '도시데이터과학': 'Urban data science',
    '도시행정': 'Urban administration', '도시계획': 'Urban planning', '머신러닝': 'Machine learning',
    '균형발전': 'Balanced regional development', '지방소멸': 'Local extinction', '지방재정': 'Local public finance',
    '생활이동': 'Daily mobility', '도시정책': 'Urban policy', '도시공간경제': 'Urban spatial economics',
    '주거환경': 'Residential environment', '정책 및 법제반응': 'Policy and regulatory response',
    '거버넌스': 'Governance', '통행행태': 'Travel behaviour', '접근성': 'Accessibility',
    '도시공간구조': 'Urban spatial structure', '지역계획': 'Regional planning', '도시환경': 'Urban environment',
    '재난 리질리언스': 'Disaster resilience', '건강도시': 'Healthy cities',
    '국토균형발전(메가시티 및 지방분권)': 'Balanced national development (mega-regions and decentralisation)',
    '도시재생': 'Urban regeneration', '생태도시': 'Eco-cities', '노인정책': 'Ageing policy',
    '보행환경': 'Pedestrian environment', '인구이동': 'Migration', '도시인프라': 'Urban infrastructure',
    '고령인구': 'Ageing population', '빅데이터': 'Big data'
  };
  const topicTxt = m => { const t = m.topic || ''; if (!lang() || !t) return t;
    return t.split(',').map(x => x.trim()).filter(Boolean).map(x => TOPIC_EN[x] || x).join(', '); };
  const MAJOR_EN = { '도시행정학과': 'Urban Administration', '부동산학과': 'Real Estate' };
  const majorTxt = m => (lang() && MAJOR_EN[m.major]) ? MAJOR_EN[m.major] : (m.major || '');
  const progLabel = m => m.level === 'PhD' ? t(I18N.mem.PhD) : t(I18N.mem.MS);
  const progEn = m => m.level === 'PhD' ? I18N.mem.PhD[1] : I18N.mem.MS[1];
  function table(rows, cols) {
    return `<table class="plist"><thead><tr>${cols.map(c => `<th>${c.h}</th>`).join('')}</tr></thead><tbody>${rows.map(m => `<tr>${cols.map(c => `<td class="${c.k}">${c.f(m)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  const COL = {
    name: { h: 'Name', k: 'n', f: m => { const en = m.name_en && m.name_en !== m.name ? m.name_en : ''; return lang() && en ? `${esc(en)}<span>${esc(m.name)}</span>` : `${esc(m.name)}${en ? `<span>${esc(en)}</span>` : ''}`; } },
    prog: { h: 'Program', k: 'p', f: m => `${progLabel(m)}<span>${lang() ? '' : progEn(m)}</span>` },
    major: { h: 'Major', k: 'p', f: m => esc(majorTxt(m)) },
    topic: { h: 'Research interests', k: 't', f: m => esc(topicTxt(m)) },
    affil: { h: 'Affiliation', k: 't', f: m => esc(affilTxt(m)) }
  };
  function renderMembers() {
    const el = document.getElementById('member-groups'); if (!el) return;
    const g = D.members;
    const blocks = [
      { ko: '일반대학원 전일제 연구원', en: 'Full-time Researchers · Graduate School', rows: g.filter(m => m.prog === 'grad' && m.fulltime !== false), cols: [COL.name, COL.prog, COL.topic] },
      { ko: '일반대학원 비전일제 연구원', en: 'Part-time Researchers · Graduate School', rows: g.filter(m => m.prog === 'grad' && m.fulltime === false), cols: [COL.name, COL.prog, COL.affil] },
      { ko: '도시과학대학원', en: 'Graduate School of Urban Sciences', rows: g.filter(m => m.prog === 'urban'), cols: [COL.name, COL.major, COL.affil] }
    ];
    el.innerHTML = blocks.filter(b => b.rows.length).map(b => `<div class="cat"><h3>${lang() ? b.en : b.ko}</h3><span class="en">${lang() ? b.ko : b.en}</span><span class="count">${b.rows.length}</span></div>${table(b.rows.sort((a, c) => (a.level === c.level ? 0 : a.level === 'PhD' ? -1 : 1)), b.cols)}`).join('');
  }
  function renderAlumni() {
    const el = document.getElementById('alumni-groups'); if (!el) return;
    const a = D.alumni;
    const card = (x, phd) => `<div class="acard2${phd ? ' phd' : ''}"><div class="n">${lang() && x.name_en && x.name_en !== x.name ? `${esc(x.name_en)}<span>${esc(x.name)}</span>` : `${esc(x.name)}${x.name_en && x.name_en !== x.name ? `<span>${esc(x.name_en)}</span>` : ''}`}</div><div class="m">${phd ? '<span class="badge">Ph.D.</span>' : '<span class="badge ms">M.S.</span>'}${esc(majorTxt(x))}</div>${x.affil ? `<div class="aff">${esc(affilTxt(x))}</div>` : ''}</div>`;
    const blocks = [
      { ko: '일반대학원 박사 졸업생', en: 'Ph.D. Alumni · Graduate School', rows: a.filter(x => x.level === 'PhD'), phd: true },
      { ko: '일반대학원 석사 졸업생', en: 'M.S. Alumni · Graduate School', rows: a.filter(x => x.prog === 'grad' && x.level === 'MS') },
      { ko: '도시과학대학원 석사 졸업생', en: 'M.S. Alumni · Graduate School of Urban Sciences', rows: a.filter(x => x.prog === 'urban') },
      { ko: '국제도시과학대학원 석사 졸업생', en: 'M.S. Alumni · International School of Urban Sciences', rows: a.filter(x => x.prog === 'intl') }
    ];
    el.innerHTML = blocks.filter(b => b.rows.length).map(b => `<div class="cat"><h3>${lang() ? b.en : b.ko}</h3><span class="en">${lang() ? b.ko : b.en}</span><span class="count">${b.rows.length}</span></div><div class="agrid2${b.phd ? ' phd' : ''}">${b.rows.map(x => card(x, b.phd)).join('')}</div>`).join('');
  }

  /* ---------- gallery ---------- */
  function layoutGallery() {
    const W0 = innerWidth, GAP = 8;
    const H = W0 < 640 ? 150 : W0 < 900 ? 200 : 250;      /* 목표 높이 */
    const MAX = W0 < 640 ? 230 : W0 < 900 ? 300 : 400;    /* 상한 높이 */
    document.querySelectorAll('.grow').forEach(row => {
      const W = row.clientWidth; if (!W) return;
      let line = [], sum = 0;
      const flush = () => {
        if (!line.length) return;
        let h = (W - GAP * (line.length - 1)) / sum;
        if (h > MAX) h = MAX;
        line.forEach(el => { const r = +el.dataset.r || 1.333;
          el.style.height = Math.round(h) + 'px'; el.style.width = Math.round(r * h) + 'px'; });
        line = []; sum = 0;
      };
      [...row.children].forEach(el => {
        const r = +el.dataset.r || 1.333;
        line.push(el); sum += r;
        if (sum * H + GAP * (line.length - 1) >= W) flush();
      });
      flush();
    });
  }
  let glTimer; addEventListener('resize', () => { clearTimeout(glTimer); glTimer = setTimeout(layoutGallery, 120); });

  function renderGallery() {
    const el = document.getElementById('gallery'); if (!el) return;
    const G = D.gallery.slice().sort((x, y) => String(y.date).localeCompare(String(x.date)));
    const years = [...new Set(G.map(g => String(g.date).slice(0, 4)))];
    const ph = (g, i, k) => { const r = (g.ratios || [])[k] || 1.333; return `<figure class="gp" data-i="${i}" data-k="${k}" data-r="${r}" tabindex="0" style="--r:${r}"><img src="${esc(g.imgs[k])}" alt="" loading="lazy" data-alt="${esc((g.imgs_src || [])[k] || '')}" onerror="imgFallback(this)"></figure>`; };
    const ev = (g, i) => `<article class="gev"><header><time>${fmtDate(g.date)}</time><h3>${esc(g.title)}</h3>${g.body ? `<p>${esc(g.body)}</p>` : ''}</header><div class="grow">${g.imgs.map((_, k) => ph(g, i, k)).join('')}</div></article>`;
    el.innerHTML = years.map(y => {
      const rows = G.map((g, i) => [g, i]).filter(([g]) => String(g.date).startsWith(y));
      const n = rows.reduce((a, [g]) => a + g.imgs.length, 0);
      return `<section class="gy"><div class="gy-head"><span class="gy-y">${y}</span><span class="gy-n">${rows.length} ${lang() ? 'events' : '행사'} · ${n} ${lang() ? 'photos' : '장'}</span></div>${rows.map(([g, i]) => ev(g, i)).join('')}</section>`;
    }).join('');
    layoutGallery();
    const lb = document.getElementById('lightbox'), img = lb.querySelector('img.main'), cap = lb.querySelector('.cap'), th = lb.querySelector('.thumbs'), ctr = lb.querySelector('.ctr'); let cur = 0, idx = 0;
    function show(i, j) { cur = i; idx = j; const g = G[i]; img.dataset.alt = (g.imgs_src || [])[j] || ''; img.onerror = () => imgFallback(img); img.src = g.imgs[j]; cap.innerHTML = `<time>${fmtDate(g.date)}</time>${esc(g.title)}${g.body ? `<em>${esc(g.body)}</em>` : ''}`; ctr.textContent = g.imgs.length > 1 ? `${j + 1} / ${g.imgs.length}` : ''; th.innerHTML = g.imgs.length > 1 ? g.imgs.map((s, k) => `<img src="${s}" class="${k === j ? 'on' : ''}" data-k="${k}" data-alt="${esc((g.imgs_src || [])[k] || '')}" onerror="imgFallback(this)" alt="">`).join('') : ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    const step = d => { const n = G[cur].imgs.length; if (n > 1) show(cur, (idx + d + n) % n); else { show((cur + d + G.length) % G.length, 0); } };
    el.addEventListener('click', e => { const g = e.target.closest('.gp'); if (g) show(+g.dataset.i, +g.dataset.k); });
    el.addEventListener('keydown', e => { const g = e.target.closest('.gp'); if (g && e.key === 'Enter') show(+g.dataset.i, +g.dataset.k); });
    th.addEventListener('click', e => { const k = e.target.dataset.k; if (k != null) show(cur, +k); });
    lb.querySelector('.x').addEventListener('click', close);
    lb.querySelector('.prev').addEventListener('click', () => step(-1));
    lb.querySelector('.next').addEventListener('click', () => step(1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  }

  /* ---------- CV ---------- */
  const yearPills = y => String(y).split(',').map(x => x.trim()).filter(Boolean).map(x => `<span class="yp">${esc(x.replace('-', '–'))}</span>`).join('');
  function cvList(id, rows) { const el = document.getElementById(id); if (el) el.innerHTML = rows.map(([txt, y]) => `<li><span class="ys">${yearPills(y)}</span><span class="tx">${esc(txt)}</span></li>`).join(''); }
  function renderCV() { const c = D.cv; if (!c || !document.getElementById('cv-career')) return;
    cvList('cv-edu', c.edu); cvList('cv-career', c.career); cvList('cv-public', c.public); cvList('cv-academic', c.academic); cvList('cv-awards', c.awards);
    const tg = document.getElementById('cv-toggle'), pn = document.getElementById('cv-panel');
    if (tg && pn && !tg.dataset.bound) { tg.dataset.bound = 1; tg.addEventListener('click', () => { const open = pn.hidden; pn.hidden = !open; tg.setAttribute('aria-expanded', open); tg.classList.toggle('open', open); }); }
    const b = document.getElementById('books'); if (b) b.innerHTML = D.books.map(x => `<li><span class="ys">${yearPills(x.year)}</span><span class="tx">${esc(x.title)}, ${esc(x.pub)}</span></li>`).join('');
    const tabs = document.querySelectorAll('.cv-tab'); tabs.forEach(tb => { if (tb.dataset.bound) return; tb.dataset.bound = 1; tb.addEventListener('click', () => { tabs.forEach(x => x.setAttribute('aria-selected', x === tb)); document.querySelectorAll('.cv-pane').forEach(p => p.hidden = p.dataset.pane !== tb.dataset.tab); }); }); }

  const TL = [
    ['2026', [['proj','한국연구재단 핵심연구 선정: 의료 빅데이터 및 고해상도 공간정보 기반 다층적 도시건강 진단과 정밀 정책 시뮬레이션 모델 개발 (2026–2029)','NRF Core Research Grant: Multiscale urban-health diagnosis and policy simulation model based on medical big data and high-resolution spatial data (2026–2029)'],['people','박사과정 송명희·손은영 졸업','Ph.D. graduates: Myunghee Song, Eunyoung Son'],['award','한국도시행정학회 야립공동연구상','Yarip Collaborative Research Award, KAUA']]],
    ['2025', [['people','연구실 첫 박사 배출: 박사과정 허유경 졸업','First Ph.D. graduate: Yoogyeong Hur'],['award','석사과정 정재영·박사과정 김지수 한국주택학회 우수논문상, 석사과정 정재영 한국지역학회 우수논문상','Best paper awards: Jaeyoung Jung and Jisu Kim (KAHPS); Jaeyoung Jung (KRSA)'],['proj','수원시정연구원 공동연구 성과 발간','Joint research reports published with the Suwon Research Institute']]],
    ['2024', [['people','박사과정 김지수·박진홍, ACSP 연례대회(시애틀) 발표','Ph.D. students Jisu Kim and Jinhong Park present at the ACSP annual conference, Seattle'],['award','석사과정 정재영, 대한국토도시계획학회 춘계학술대회 우수논문상','Jaeyoung Jung: best paper award, KPA spring conference'],['lab','강민규 교수님 부교수 승진','Mingyu Kang promoted to Associate Professor']]],
    ['2023', [['lab','강민규 교수님 서울시립대–국토연구원–리버풀대 국제세미나 기조발제','Mingyu Kang: keynote at the UOS–KRIHS–Liverpool international seminar'],['proj','서울시 도시데이터 연구 확대: 민원 텍스트, 도시센서, 보건의료데이터','Seoul urban-data projects expand'],['lab','강민규 교수님 Seoul AI Conference·Seoul Big Data Forum 발표','Mingyu Kang: talks at the Seoul AI Conference and Seoul Big Data Forum']]],
    ['2022', [['proj','한국연구재단 과제 첫 선정: 증거기반 국토균형발전 계획지원체계 (2022–2025)','First NRF grant as PI'],['lab','강민규 교수님 도시과학빅데이터·AI연구원(UBAI) 빅데이터연구센터장 취임','Mingyu Kang appointed Director, Big Data Research Center, UBAI'],['pub','연구실 학생 1저자 논문 게재 시작: 허유경·김지수·박진홍','First student-led publications: Yoogyeong Hur, Jisu Kim, Jinhong Park']]],
    ['2021', [['lab','강민규 교수님 도시행정학과 학과장 (2021–2023)','Mingyu Kang: Department chair, 2021–2023'],['proj','서울 도시데이터 센서(S-DoT) 빅데이터 연구 시작','S-DoT urban sensor big-data research begins'],['lab','강민규 교수님 국토교통부 데이터 유관기관 협의체 자문위원 (2021–2023)','Mingyu Kang: advisory member, data institutions council, Ministry of Land, Infrastructure and Transport (2021–2023)']]],
    ['2020', [['proj','인공위성 빅데이터 기반 도시경제 측정 연구 시작','Satellite big-data research on urban economies begins'],['proj','국토연구원 초광역 연계·국가위기지역 연구 공동 수행','Joint projects with KRIHS on mega-regions and crisis regions'],['lab','강민규 교수님 서울시립대학교 도시행정학과 부임, STAR Lab 설립','Mingyu Kang joins the University of Seoul; STAR Lab founded']]]
  ];
  function renderTimeline() {
    const el = document.getElementById('timeline'); if (!el) return;
    el.innerHTML = TL.map(([y, items]) => `<div class="tl-year"><div class="tl-y">${y}</div><div class="tl-items">${items.map(([k, ko, en]) => `<div class="tl-item k-${k}"><span class="tl-dot"></span><span>${lang() ? esc(en) : esc(ko)}</span></div>`).join('')}</div></div>`).join('');
  }
  function render() {
    document.getElementById('site-header').innerHTML = header();
    document.getElementById('site-footer').innerHTML = footer();
    document.getElementById('lang-btn').onclick = toggleLang;
    document.getElementById('menu-btn').onclick = () => document.getElementById('nav').classList.toggle('open');
    document.querySelectorAll('[data-more]').forEach(a => a.textContent = t(I18N.more));
    renderHome(); renderResearch(); renderNews(); renderPubs(); renderProjects(); renderMembers(); renderAlumni(); renderGallery(); renderCV(); renderTimeline();
  }
  initLang();
  document.addEventListener('DOMContentLoaded', () => { render(); hero(); ytLite(); });
})();

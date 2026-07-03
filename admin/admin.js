(() => {
  const AUTH_KEY = 'deflorio.admin.auth.v1';
  const USERNAME = 'admin';
  const PASSWORD = 'Deflorio2026!';
  const data = window.DeflorioData;
  const portfolioRepo = data ? new data.PortfolioRepository() : null;
  const reviewRepo = data ? new data.ReviewRepository() : null;
  const page = document.body.dataset.adminPage;
  const isLogin = page === 'login';
  const authStorage = window.sessionStorage;
  const isAuthenticated = () => authStorage.getItem(AUTH_KEY) === 'ok';
  const go = (url) => { window.location.href = url; };

  if (!isLogin && !isAuthenticated()) { go('../login/'); return; }
  if (isLogin && isAuthenticated()) { go('../dashboard/'); return; }

  function animateIn() {
    if (!window.gsap) return;
    gsap.fromTo('.admin-sidebar', { x: -22, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    gsap.fromTo('.admin-content > *,.login-card', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.48, stagger: 0.06, ease: 'power3.out' });
  }

  function mountShell() {
    document.querySelectorAll('[data-nav]').forEach((link) => link.classList.toggle('is-active', link.dataset.nav === page));
    document.querySelector('[data-logout]')?.addEventListener('click', () => { authStorage.removeItem(AUTH_KEY); window.localStorage.removeItem(AUTH_KEY); go('../login/'); });
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); });
  }

  function resolveAdminImageSrc(src) {
    if (!src) return '';
    if (src.startsWith('/') || /^(data:|blob:|https?:)/.test(src)) return src;
    if (src.startsWith('assets/')) return '../../' + src;
    return src;
  }

  class Modal {
    constructor(id) {
      this.overlay = document.getElementById(id);
      this.modal = this.overlay?.querySelector('.admin-modal');
      this.overlay?.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => this.close()));
      this.overlay?.addEventListener('click', (event) => { if (event.target === this.overlay) this.close(); });
      document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && this.overlay && !this.overlay.hidden) this.close(); });
    }
    open() { if (!this.overlay) return; this.overlay.hidden = false; if (window.gsap) { gsap.fromTo(this.overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: 'power3.out' }); gsap.fromTo(this.modal, { y: 16, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.34, ease: 'power3.out' }); } }
    close() { if (!this.overlay) return; const done = () => { this.overlay.hidden = true; }; if (window.gsap) gsap.to(this.overlay, { autoAlpha: 0, duration: 0.18, ease: 'power2.out', onComplete: done }); else done(); }
  }

  function renderDashboard() {
    document.querySelector('[data-portfolio-count]').textContent = String(portfolioRepo.read().length);
    document.querySelector('[data-review-count]').textContent = String(reviewRepo.read().length);
  }

  function renderPortfolio() {
    const grid = document.querySelector('[data-lavori-grid]');
    if (!grid) return;
    const items = portfolioRepo.read();
    grid.innerHTML = items.length ? '' : '<p class="empty-state">Nessuna immagine nei lavori.</p>';
    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'admin-card image-card';
      card.innerHTML = '<div class="image-preview"><img alt="Anteprima lavoro"></div><div class="image-meta"><strong></strong><div class="card-actions"><button class="admin-button danger" type="button" data-delete>Elimina</button></div></div>';
      card.querySelector('img').src = resolveAdminImageSrc(item.image);
      card.querySelector('img').alt = item.alt || item.category;
      card.querySelector('strong').textContent = item.category;
      card.querySelector('[data-delete]').addEventListener('click', () => { portfolioRepo.delete(item.id); renderPortfolio(); });
      grid.appendChild(card);
    });
  }

  function initPortfolioPage() {
    const modal = new Modal('lavori-modal');
    const form = document.querySelector('[data-lavori-form]');
    document.querySelector('[data-add-work-image]')?.addEventListener('click', () => { form.reset(); modal.open(); });
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const files = [...form.images.files];
      if (!files.length) return;
      for (const file of files) portfolioRepo.create({ category: 'Lavori', image: await fileToDataUrl(file), alt: file.name });
      modal.close();
      renderPortfolio();
    });
    renderPortfolio();
  }

  function stars(value) { return '★★★★★'.slice(0, Number(value || 5)); }
  function renderReviews() {
    const list = document.querySelector('[data-review-list]');
    if (!list) return;
    const reviews = reviewRepo.read();
    list.innerHTML = reviews.length ? '' : '<p class="empty-state">Nessuna recensione presente.</p>';
    reviews.forEach((review) => {
      const card = document.createElement('article');
      card.className = 'admin-card review-admin-card';
      const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('it-IT') : '';
      card.innerHTML = '<span class="stars"></span><h3></h3><p></p><span class="review-date"></span><div class="card-actions"><button class="admin-button secondary" type="button" data-edit>Modifica</button><button class="admin-button danger" type="button" data-delete>Elimina</button></div>';
      card.querySelector('.stars').textContent = stars(review.rating);
      card.querySelector('h3').textContent = review.name;
      card.querySelector('p').textContent = review.comment;
      card.querySelector('.review-date').textContent = date;
      card.querySelector('[data-edit]').addEventListener('click', () => openReviewModal(review));
      card.querySelector('[data-delete]').addEventListener('click', () => { reviewRepo.delete(review.id); renderReviews(); });
      list.appendChild(card);
    });
  }

  function setupStars(container, initial = 5) {
    let value = Number(initial || 5);
    const buttons = [...container.querySelectorAll('button')];
    const paint = () => buttons.forEach((button, index) => button.classList.toggle('is-active', index < value));
    buttons.forEach((button, index) => button.addEventListener('click', () => { value = index + 1; paint(); }));
    paint();
    return { get value() { return value; }, set value(next) { value = Number(next || 5); paint(); } };
  }

  let activeReviewId = null;
  let reviewStars = null;
  function openReviewModal(review = null) {
    const modal = window.reviewModalInstance;
    const form = document.querySelector('[data-review-form]');
    activeReviewId = review?.id || null;
    form.name.value = review?.name || '';
    form.email.value = review?.email || '';
    form.comment.value = review?.comment || '';
    reviewStars.value = review?.rating || 5;
    modal.open();
  }

  function initReviewsPage() {
    window.reviewModalInstance = new Modal('review-modal');
    const form = document.querySelector('[data-review-form]');
    reviewStars = setupStars(document.querySelector('[data-star-input]'), 5);
    document.querySelector('[data-add-review]')?.addEventListener('click', () => openReviewModal());
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = { name: form.name.value.trim(), email: form.email.value.trim(), rating: reviewStars.value, comment: form.comment.value.trim() };
      if (!payload.name || !payload.email || !payload.comment || !payload.rating) return;
      if (activeReviewId) reviewRepo.update(activeReviewId, payload); else reviewRepo.create(payload);
      window.reviewModalInstance.close();
      renderReviews();
    });
    renderReviews();
  }

  function initLogin() {
    const form = document.querySelector('[data-login-form]');
    const error = document.querySelector('[data-login-error]');
    const passwordInput = form?.querySelector('input[name="password"]');
    const passwordToggle = form?.querySelector('[data-password-toggle]');

    passwordToggle?.addEventListener('click', () => {
      if (!passwordInput) return;
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordToggle.setAttribute('aria-pressed', String(isHidden));
      passwordToggle.setAttribute('aria-label', isHidden ? 'Nascondi password' : 'Mostra password');
      passwordInput.focus({ preventScroll: true });
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      error.textContent = '';
      const username = form.username.value.trim();
      const password = form.password.value;
      if (username !== USERNAME || password !== PASSWORD) {
        error.textContent = 'Credenziali non corrette.';
        return;
      }
      authStorage.setItem(AUTH_KEY, 'ok');
      go('../dashboard/');
    });
  }

  if (isLogin) initLogin(); else mountShell();
  if (page === 'dashboard') renderDashboard();
  if (page === 'lavori') initPortfolioPage();
  if (page === 'reviews') initReviewsPage();
  animateIn();
})();

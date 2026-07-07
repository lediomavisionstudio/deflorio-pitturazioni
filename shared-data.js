(() => {
  const KEYS = {
    portfolio: 'deflorio.portfolio.v1',
    reviews: 'deflorio.reviews.v1',
    quoteRequests: 'deflorio.quoteRequests.v1'
  };

  const now = '2026-07-02T00:00:00.000Z';
  const defaultPortfolio = [
    {
        id: "lavoro-01",
        category: "Lavori",
        image: "assets/lavori/lavoro-01.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 1",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-02",
        category: "Lavori",
        image: "assets/lavori/lavoro-02.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 2",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-03",
        category: "Lavori",
        image: "assets/lavori/lavoro-03.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 3",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-04",
        category: "Lavori",
        image: "assets/lavori/lavoro-04.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 4",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-05",
        category: "Lavori",
        image: "assets/lavori/lavoro-05.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 5",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-06",
        category: "Lavori",
        image: "assets/lavori/lavoro-06.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 6",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-07",
        category: "Lavori",
        image: "assets/lavori/lavoro-07.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 7",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-08",
        category: "Lavori",
        image: "assets/lavori/lavoro-08.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 8",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-09",
        category: "Lavori",
        image: "assets/lavori/lavoro-09.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 9",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-10",
        category: "Lavori",
        image: "assets/lavori/lavoro-10.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 10",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-11",
        category: "Lavori",
        image: "assets/lavori/lavoro-11.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 11",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-12",
        category: "Lavori",
        image: "assets/lavori/lavoro-12.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 12",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-13",
        category: "Lavori",
        image: "assets/lavori/lavoro-13.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 13",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-14",
        category: "Lavori",
        image: "assets/lavori/lavoro-14.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 14",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-15",
        category: "Lavori",
        image: "assets/lavori/lavoro-15.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 15",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-16",
        category: "Lavori",
        image: "assets/lavori/lavoro-16.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 16",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-17",
        category: "Lavori",
        image: "assets/lavori/lavoro-17.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 17",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-18",
        category: "Lavori",
        image: "assets/lavori/lavoro-18.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 18",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-19",
        category: "Lavori",
        image: "assets/lavori/lavoro-19.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 19",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-20",
        category: "Lavori",
        image: "assets/lavori/lavoro-20.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 20",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-21",
        category: "Lavori",
        image: "assets/lavori/lavoro-21.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 21",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-22",
        category: "Lavori",
        image: "assets/lavori/lavoro-22.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 22",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-23",
        category: "Lavori",
        image: "assets/lavori/lavoro-23.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 23",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-24",
        category: "Lavori",
        image: "assets/lavori/lavoro-24.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 24",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-25",
        category: "Lavori",
        image: "assets/lavori/lavoro-25.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 25",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-26",
        category: "Lavori",
        image: "assets/lavori/lavoro-26.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 26",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-27",
        category: "Lavori",
        image: "assets/lavori/lavoro-27.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 27",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-28",
        category: "Lavori",
        image: "assets/lavori/lavoro-28.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 28",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-29",
        category: "Lavori",
        image: "assets/lavori/lavoro-29.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 29",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-30",
        category: "Lavori",
        image: "assets/lavori/lavoro-30.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 30",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-31",
        category: "Lavori",
        image: "assets/lavori/lavoro-31.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 31",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-32",
        category: "Lavori",
        image: "assets/lavori/lavoro-32.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 32",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-33",
        category: "Lavori",
        image: "assets/lavori/lavoro-33.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 33",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-34",
        category: "Lavori",
        image: "assets/lavori/lavoro-34.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 34",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-35",
        category: "Lavori",
        image: "assets/lavori/lavoro-35.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 35",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-36",
        category: "Lavori",
        image: "assets/lavori/lavoro-36.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 36",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-37",
        category: "Lavori",
        image: "assets/lavori/lavoro-37.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 37",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-38",
        category: "Lavori",
        image: "assets/lavori/lavoro-38.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 38",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-39",
        category: "Lavori",
        image: "assets/lavori/lavoro-39.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 39",
        createdAt: "2026-07-02T00:00:00.000Z"
    },
    {
        id: "lavoro-40",
        category: "Lavori",
        image: "assets/lavori/lavoro-40.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 40",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-41",
        category: "Lavori",
        image: "assets/lavori/lavoro-41.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 41",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-42",
        category: "Lavori",
        image: "assets/lavori/lavoro-42.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 42",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-43",
        category: "Lavori",
        image: "assets/lavori/lavoro-43.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 43",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-44",
        category: "Lavori",
        image: "assets/lavori/lavoro-44.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 44",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-45",
        category: "Lavori",
        image: "assets/lavori/lavoro-45.jpeg",
        alt: "Lavoro Deflorio Pitturazioni 45",
        createdAt: "2026-07-06T00:00:00.000Z"
    },
    {
        id: "lavoro-46",
        category: "Lavori",
        image: "assets/lavori/lavoro-46.png",
        alt: "Lavoro Deflorio Pitturazioni 46",
        createdAt: "2026-07-07T00:00:00.000Z"
    },
    {
        id: "lavoro-47",
        category: "Lavori",
        image: "assets/lavori/lavoro-47.png",
        alt: "Lavoro Deflorio Pitturazioni 47",
        createdAt: "2026-07-07T00:00:00.000Z"
    }
];
  const defaultReviews = [
    { id: 'review-maria-default', name: 'Maria L.', email: 'maria.default@deflorio.local', rating: 5, comment: 'Precisi, ordinati e molto attenti ai dettagli. Hanno trasformato il soggiorno senza lasciarci stress.', createdAt: now },
    { id: 'review-giuseppe-default', name: 'Giuseppe R.', email: 'giuseppe.default@deflorio.local', rating: 5, comment: 'Cartongesso e pitturazione eseguiti con cura. Tempi rispettati e ambiente riconsegnato pulito.', createdAt: now },
    { id: 'review-studio-default', name: 'Studio M.', email: 'studio.default@deflorio.local', rating: 5, comment: 'Ottimo lavoro per il nostro ufficio. Materiali di qualità, comunicazione chiara e risultato elegante.', createdAt: now },
    { id: 'review-angela-default', name: 'Angela P.', email: 'angela.default@deflorio.local', rating: 5, comment: 'Disponibili dal primo sopralluogo. Colori consigliati benissimo e finiture molto pulite.', createdAt: now },
    { id: 'review-francesco-default', name: 'Francesco D.', email: 'francesco.default@deflorio.local', rating: 5, comment: 'Lavoro preciso su controsoffitto e pareti. Hanno rispettato casa e tempi concordati.', createdAt: now },
    { id: 'review-lucia-default', name: 'Lucia S.', email: 'lucia.default@deflorio.local', rating: 5, comment: 'Carta da parati applicata alla perfezione. Risultato elegante e comunicazione sempre chiara.', createdAt: now }
  ];

  class LocalRepository {
    constructor(key, defaults = []) { this.key = key; this.defaults = defaults; this.seed(); }
    seed() {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) { this.write(this.defaults, false); return; }
      try {
        const items = JSON.parse(raw);
        const onlyOldDefaults = Array.isArray(items) && items.length <= 4 && items.every((item) => String(item.id || '').startsWith('portfolio-'));
        if (this.key === KEYS.portfolio && onlyOldDefaults) this.write(this.defaults, false);
        if (this.key === KEYS.portfolio && Array.isArray(items) && !onlyOldDefaults) {
          const storedIds = new Set(items.map((item) => item.id));
          const migrationIds = new Set(['lavoro-40', 'lavoro-41', 'lavoro-42', 'lavoro-43', 'lavoro-44', 'lavoro-45', 'lavoro-46', 'lavoro-47']);
          const missingDefaults = this.defaults.filter((item) => migrationIds.has(item.id) && !storedIds.has(item.id));
          if (missingDefaults.length) this.write([...items, ...missingDefaults], false);
        }
      } catch (error) {
        this.write(this.defaults, false);
      }
    }
    read() { try { const raw = window.localStorage.getItem(this.key); const items = raw ? JSON.parse(raw) : this.defaults; return Array.isArray(items) ? items : []; } catch (error) { return []; } }
    write(items, notify = true) { window.localStorage.setItem(this.key, JSON.stringify(items)); if (notify) window.dispatchEvent(new CustomEvent('deflorio:data-changed', { detail: { key: this.key } })); }
    create(item) { const next = { id: item.id || (crypto.randomUUID ? crypto.randomUUID() : 'item-' + Date.now()), ...item, createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() }; this.write([next, ...this.read()]); return next; }
    update(id, patch) { let updated = null; const items = this.read().map((item) => { if (item.id !== id) return item; updated = { ...item, ...patch, id, updatedAt: new Date().toISOString() }; return updated; }); this.write(items); return updated; }
    delete(id) { this.write(this.read().filter((item) => item.id !== id)); }
  }

  class PortfolioRepository extends LocalRepository { constructor() { super(KEYS.portfolio, defaultPortfolio); } }
  class ReviewRepository extends LocalRepository {
    constructor() { super(KEYS.reviews, defaultReviews); }
    normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
    findByEmail(email) { const normalized = this.normalizeEmail(email); return this.read().find((review) => this.normalizeEmail(review.email) === normalized) || null; }
    upsert(review) { const email = this.normalizeEmail(review.email); const existing = this.findByEmail(email); if (existing) return this.update(existing.id, { ...review, email }); return this.create({ ...review, email }); }
  }
  class QuoteRequestRepository extends LocalRepository {
    constructor() { super(KEYS.quoteRequests, []); }
    normalizeEmail(email) { return String(email || '').trim().toLowerCase(); }
    existsByEmail(email) { const normalized = this.normalizeEmail(email); return this.read().some((request) => this.normalizeEmail(request.email) === normalized); }
    save(request) { const email = this.normalizeEmail(request.email); if (!email) return null; const items = this.read().filter((item) => this.normalizeEmail(item.email) !== email); const next = { id: crypto.randomUUID ? crypto.randomUUID() : 'quote-' + Date.now(), ...request, email, createdAt: request.createdAt || new Date().toISOString() }; this.write([next, ...items]); return next; }
  }
  window.DeflorioData = { KEYS, defaultPortfolio, defaultReviews, PortfolioRepository, ReviewRepository, QuoteRequestRepository };
})();

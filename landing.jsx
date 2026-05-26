/* eslint-disable */
/**
 * AfricaPortal — public landing page.
 * Hero, search widget, categories, destinations, featured listings,
 * how it works, partner CTA, testimonials, stats, footer.
 */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroPhoto": "savanna",
  "heroHeadline": "balanced",
  "showSearch": true
}/*EDITMODE-END*/;

const HERO_PHOTOS = {
  savanna:  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=2000&q=85&auto=format&fit=crop',
  elephant: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=2000&q=85&auto=format&fit=crop',
  zanzibar: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=2000&q=85&auto=format&fit=crop',
  desert:   'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=2000&q=85&auto=format&fit=crop',
};

const HERO_PHOTO_LABEL = {
  savanna: 'Серенгети', elephant: 'Этоша', zanzibar: 'Занзибар', desert: 'Сахара',
};

/* ─── Inline icons ─── */
const I = {
  search: (p = 18) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  arr: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  check: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6"/></svg>,
  cal: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  pin: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  users: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 21c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 16c2 0 5 1.5 5 5"/></svg>,
  globe: (p = 14) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
  menu: (p = 20) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  star: (p = 14) => <svg width={p} height={p} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9"/></svg>,
  plane: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10h5a2 2 0 0 1 0 4h-5l-4 8h-3l2-8H7l-2 3H2l1-5-1-5h3l2 3h4l-2-8h3l4 8z"/></svg>,
  ig: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>,
  fb: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-9h3l.5-4H13V6.5c0-1.1.3-1.8 1.8-1.8H17V1.2C16.6 1.1 15.4 1 14 1c-2.9 0-4.9 1.8-4.9 5v3H6v4h3.1v9z"/></svg>,
  yt: (p = 16) => <svg width={p} height={p} viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.4s-.2-1.5-.9-2.2c-.8-.8-1.7-.8-2.1-.9-3-.2-7.5-.2-7.5-.2s-4.5 0-7.5.2c-.4.1-1.3.1-2.1.9C2.2 5.9 2 7.4 2 7.4S1.8 9.2 1.8 11v1.9c0 1.8.2 3.6.2 3.6s.2 1.5.9 2.2c.8.8 1.9.8 2.4.9 1.7.2 7.2.2 7.2.2s4.5 0 7.5-.2c.4-.1 1.3-.1 2.1-.9.7-.7.9-2.2.9-2.2s.2-1.8.2-3.6V11c0-1.8-.2-3.6-.2-3.6zM9.7 14.6v-7l5.8 3.5z"/></svg>,
};

/* ──────────── DATA ──────────── */
const CATEGORIES = [
  { id: 'safari',   name: 'Сафари',       glyph: '🦁', count: '420 туров',  bg: 'linear-gradient(135deg, #FFE5C2, #FFD18A)' },
  { id: 'beach',    name: 'Пляжи',        glyph: '🏝️', count: '186 отелей', bg: 'linear-gradient(135deg, #C2EAFF, #8BB8FF)' },
  { id: 'culture',  name: 'Культура',     glyph: '🏛️', count: '78 экскурсий', bg: 'linear-gradient(135deg, #FFE5E5, #FFB3B3)' },
  { id: 'desert',   name: 'Пустыня',      glyph: '🐪', count: '94 тура',    bg: 'linear-gradient(135deg, #FFEDC2, #F5C842)' },
  { id: 'climb',    name: 'Восхождения',  glyph: '⛰️', count: '32 маршрута', bg: 'linear-gradient(135deg, #E8F5E9, #A5D6A7)' },
  { id: 'food',     name: 'Гастрономия',  glyph: '🍲', count: '46 туров',   bg: 'linear-gradient(135deg, #F0E5C2, #D7BA73)' },
];

const DESTINATIONS = [
  { code: 'TZ', name: 'Танзания',  meta: '142 объекта · от $480', bg: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80&auto=format&fit=crop', tall: true },
  { code: 'NA', name: 'Намибия',   meta: '88 объектов · от $620', bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80&auto=format&fit=crop' },
  { code: 'KE', name: 'Кения',     meta: '178 объектов · от $410', bg: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=1200&q=80&auto=format&fit=crop' },
  { code: 'MA', name: 'Марокко',   meta: '212 объектов · от $290', bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80&auto=format&fit=crop' },
  { code: 'ZA', name: 'ЮАР',       meta: '256 объектов · от $340', bg: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80&auto=format&fit=crop' },
];

const FEATURED = [
  {
    id: 1, name: 'Etosha Safari Lodge', country: 'Намибия · Этоша',
    type: 'Лодж', tags: ['Featured', '5★'],
    desc: 'Аутентичный сафари-лодж у солончака Этоша. Утренние выезды к водопою, частная веранда, гид-маасай.',
    price: 240, rating: 4.9, reviews: 128,
    bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 2, name: 'Серенгети — полёт на шаре', country: 'Танзания · Серенгети',
    type: 'Экскурсия', tags: ['Популярное'],
    desc: 'Восход над миграцией антилоп гну. 1 час в небе, шампанский завтрак на саванне, фото-сертификат.',
    price: 580, rating: 4.8, reviews: 84,
    bg: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 3, name: 'Zanzibar Beach Villa', country: 'Занзибар · Стоун-Таун',
    type: 'Вилла', tags: ['Honeymoon'],
    desc: 'Бутик-вилла на белом песке. Дайвинг с черепахами, специи-тур, ужины при свечах на дау-боуте.',
    price: 320, rating: 4.7, reviews: 94,
    bg: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1200&q=80&auto=format&fit=crop',
  },
];

const TESTIMONIALS = [
  {
    text: 'Через AfricaPortal нашли невероятный лодж в Намибии — с прямой связью с хозяином, без посредников. Поездка в апреле 2026 года стала лучшей в нашей жизни.',
    name: 'Мария Иванова', role: 'Москва · поездка в Намибию',
    feature: true,
  },
  {
    text: 'Просто, прозрачно, локально. Никакой Booking-комиссии.',
    name: 'Hans Müller', role: 'Берлин',
  },
  {
    text: 'Гид Самуэль в Серенгети — лучший. Спасибо порталу!',
    name: 'Sophie Laurent', role: 'Париж',
  },
];

const STATS = [
  { num: '1 284', lbl: 'Проверенных объекта', col: 'var(--pa-red)' },
  { num: '348',   lbl: 'Локальных партнёра',  col: 'var(--pa-green)' },
  { num: '42 ‹k', lbl: 'Туристов в месяц',     col: 'var(--pa-gold)' },
  { num: '4.8★',  lbl: 'Средний рейтинг',     col: 'white' },
];

/* Готовые маршруты — раздел «Маршруты» из ТЗ (B.4 п.3) */
const ROUTES = [
  {
    id: 'r1', title: 'Большая Намибия за 10 дней',
    country: 'Намибия', days: 10, budget: 'от $1 980',
    points: ['Виндхук', 'Сесрием', 'Соссусфлей', 'Свакопмунд', 'Этоша', 'Окаханджа'],
    tags: ['Сафари', 'Пустыня', '4×4'],
    bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'r2', title: 'Серенгети + Занзибар',
    country: 'Танзания', days: 8, budget: 'от $2 340',
    points: ['Арушу', 'Тарангире', 'Серенгети', 'Нгоронгоро', 'Стоун-Таун', 'Кендва'],
    tags: ['Сафари', 'Пляж', 'Перелёт'],
    bg: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'r3', title: 'Кения: классическое сафари',
    country: 'Кения', days: 7, budget: 'от $1 740',
    points: ['Найроби', 'Амбосели', 'Озеро Накуру', 'Масаи-Мара'],
    tags: ['Сафари', 'Семейный', 'Большая пятёрка'],
    bg: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'r4', title: 'Марокко: Имперские города + Сахара',
    country: 'Марокко', days: 9, budget: 'от $1 280',
    points: ['Касабланка', 'Фес', 'Эрфуд', 'Мерзуга', 'Уарзазат', 'Марракеш'],
    tags: ['Культура', 'Пустыня', 'Гастро'],
    bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80&auto=format&fit=crop',
  },
];

/* Практическая информация — ТЗ (B.4 п.4) */
const PRACTICAL = [
  { id: 'visa',  glyph: '📘', title: 'Визы',          desc: 'Намибия — e-visa за 72ч. Кения — on-arrival. Танзания — онлайн. Марокко — безвиз для РФ.' },
  { id: 'fly',   glyph: '✈️', title: 'Перелёты',      desc: 'Прямые из Москвы — нет. Стыковки: Стамбул, Дубай, Доха, Аддис-Абеба. От 14–18 часов в пути.' },
  { id: 'clima', glyph: '🌤', title: 'Климат',        desc: 'Сезон сафари: июнь–октябрь (сухой). Пляжи Занзибара — июль–март. Сахара — октябрь–апрель.' },
  { id: 'safe',  glyph: '🛡', title: 'Безопасность',  desc: 'Прививки по ВОЗ: жёлтая лихорадка для ряда стран. Малярия-профилактика. Страховка от $2/сутки.' },
  { id: 'cash',  glyph: '💳', title: 'Деньги',        desc: 'Доллар США — везде. Карты МИР не работают. Снятие наличных — в столицах. Чаевые 10%.' },
];

/* Фотогалерея — ТЗ (B.4 п.6). Используем существующие PHOTOS из data.jsx, плюс несколько новых. */
const GALLERY = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80&auto=format&fit=crop', label: 'Этоша · Намибия', tall: true },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80&auto=format&fit=crop', label: 'Серенгети · Танзания' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=900&q=80&auto=format&fit=crop', label: 'Занзибар' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80&auto=format&fit=crop', label: 'Сахара · Марокко' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=900&q=80&auto=format&fit=crop', label: 'Масаи-Мара · Кения', tall: true },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&q=80&auto=format&fit=crop', label: 'Кейптаун · ЮАР' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=900&q=80&auto=format&fit=crop', label: 'Гиза · Египет' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1591793219735-1da95da6cf6c?w=900&q=80&auto=format&fit=crop', label: 'Водопад Виктория · Зимбабве' },
];

/* Блог / Новости — ТЗ (B.4 п.5) */
const BLOG = [
  {
    id: 'b1', cat: 'Гид', date: '18 мая 2026', read: '8 мин',
    title: 'Лучшее время для сафари в Серенгети: помесячный календарь',
    excerpt: 'Великая миграция, сезон отёла, дождливый «зелёный сезон» — когда ехать ради конкретной цели и как избежать толп.',
    bg: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'b2', cat: 'Маршрут', date: '14 мая 2026', read: '12 мин',
    title: 'Намибия на арендованной 4×4: маршрут на 10 дней',
    excerpt: 'От Виндхука до Соссусфлей и Этоши — какие дороги выбрать, где ночевать в кемпингах и сколько брать наличных.',
    bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'b3', cat: 'Практика', date: '10 мая 2026', read: '6 мин',
    title: 'Как получить e-visa в Танзанию: пошаговая инструкция',
    excerpt: 'Документы, фото-требования, оплата, сроки. Что делать, если заявка зависла, и как пройти границу без очереди.',
    bg: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=900&q=80&auto=format&fit=crop',
  },
];

/* ──────────── COMPONENTS ──────────── */

function PaStripe({ height = 4, style }) {
  return (
    <div className="pa-stripe" style={{ height, ...style }}>
      <span className="s1" /><span className="s2" /><span className="s3" /><span className="s4" />
    </div>
  );
}

function LangSwitcher() {
  // Список языков: код Google Translate + подпись для UI
  const LANGS = [
    { code: 'ru', label: 'RU', full: 'Русский' },
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'fr', label: 'FR', full: 'Français' },
  ];

  // Текущий язык читаем из cookie googtrans (формат "/ru/en")
  const readCurrent = () => {
    const m = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/i);
    return m ? m[1].toLowerCase() : 'ru';
  };

  const [current, setCurrent] = useState(readCurrent);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Закрываем дропдаун кликом вне
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const setLang = (code) => {
    // Ставим cookie googtrans для текущего домена и для корневого (.vercel.app и т.п.)
    const host = window.location.hostname;
    const value = code === 'ru' ? '' : `/ru/${code}`;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    // Текущий хост
    document.cookie = `googtrans=${value}; expires=${expires}; path=/`;
    // Корневой домен (например, .vercel.app), чтобы перевод сохранялся между поддоменами
    const parts = host.split('.');
    if (parts.length > 1) {
      const rootDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `googtrans=${value}; expires=${expires}; path=/; domain=${rootDomain}`;
    }
    // Если выбрали русский — обнуляем куку (удаляем перевод)
    if (code === 'ru') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      if (parts.length > 1) {
        const rootDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${rootDomain}`;
      }
    }
    setCurrent(code);
    setOpen(false);
    // Перезагрузка нужна, чтобы Google заново применил перевод по cookie
    window.location.reload();
  };

  const currentLang = LANGS.find(l => l.code === current) || LANGS[0];

  return (
    <div className="lang-switcher" ref={ref} style={{ position: 'relative' }}>
      <button
        className="lang"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {I.globe()} {currentLang.label}
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            margin: 0, padding: 6, listStyle: 'none',
            background: '#fff', border: '1px solid rgba(0,0,0,.08)',
            borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)',
            minWidth: 140, zIndex: 1000,
          }}
        >
          {LANGS.map(l => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === current}
              onClick={() => setLang(l.code)}
              style={{
                padding: '8px 12px', cursor: 'pointer', borderRadius: 6,
                fontSize: 14, fontWeight: l.code === current ? 600 : 400,
                background: l.code === current ? 'rgba(0,0,0,.04)' : 'transparent',
                color: '#222',
              }}
              onMouseEnter={(e) => { if (l.code !== current) e.currentTarget.style.background = 'rgba(0,0,0,.04)'; }}
              onMouseLeave={(e) => { if (l.code !== current) e.currentTarget.style.background = 'transparent'; }}
            >
              {l.full}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Nav({ onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation">
      <div className="nav-inner">
        <a href="#" className="brand" aria-label="AfricaPortal">
          <div className="brand-mark">A</div>
          <div className="brand-text">AfricaP<span className="accent">ortal</span></div>
        </a>
        <div className="nav-links">
          <a href="#destinations">Направления</a>
          <a href="#routes">Маршруты</a>
          <a href="#categories">Категории</a>
          <a href="#practical">Практика</a>
          <a href="#blog">Блог</a>
          <a href="#partner">Партнёрам</a>
        </div>
        <div className="nav-actions">
          <LangSwitcher />

          <button className="btn btn-sm btn-gold" onClick={onLogin}>
            Войти в ЛК {I.arr(14)}
          </button>
          <button className="hamburger" aria-label="Меню">{I.menu()}</button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ photo, onLogin, showSearch }) {
  const [tab, setTab] = useState('tour');
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${HERO_PHOTOS[photo]})` }} />
      <div className="hero-inner">
        <div className="hero-grid">
          <div>
            <div className="cap light" style={{ marginBottom: 22 }}>Karibu · Добро пожаловать</div>
            <h1 className="hero-title">
              Откройте <span className="gold">Африку</span><br />
              для своего сердца
            </h1>
            <p className="hero-lead">
              Прямые бронирования у локальных партнёров — без посредников.
              1284 проверенных объекта в 12 странах: сафари, пляжи, горы, пустыни,
              культура, которой не учат учебники.
            </p>
            <div className="hero-trust">
              <div className="stat">
                <span className="num">1 284</span>
                <span className="lbl">Объектов</span>
              </div>
              <span className="sep" />
              <div className="stat">
                <span className="num">348</span>
                <span className="lbl">Партнёров</span>
              </div>
              <span className="sep" />
              <div className="stat">
                <span className="num">4.8★</span>
                <span className="lbl">5 621 отзыв</span>
              </div>
            </div>
          </div>

          {showSearch && (
            <div>
              <div className="search-widget">
                <div className="search-tabs">
                  <button className={tab === 'tour' ? 'active' : ''} onClick={() => setTab('tour')}>
                    <span className="icon">{I.plane(14)}</span> Тур / Сафари
                  </button>
                  <button className={tab === 'hotel' ? 'active' : ''} onClick={() => setTab('hotel')}>
                    <span className="icon">🏨</span> Отель
                  </button>
                  <button className={tab === 'excursion' ? 'active' : ''} onClick={() => setTab('excursion')}>
                    <span className="icon">{I.pin(14)}</span> Экскурсия
                  </button>
                  <button className={tab === 'guide' ? 'active' : ''} onClick={() => setTab('guide')}>
                    <span className="icon">{I.users(14)}</span> Гид
                  </button>
                </div>

                <div className="search-row">
                  <div className="search-field">
                    <label>Куда</label>
                    <input placeholder="Танзания, Серенгети..." />
                  </div>
                  <div className="search-field">
                    <label>Когда</label>
                    <div className="val" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sand-600)' }}>
                      {I.cal(14)} 12 — 19 апр
                    </div>
                  </div>
                  <div className="search-field">
                    <label>Гостей</label>
                    <div className="val" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sand-600)' }}>
                      {I.users(14)} 2 взрослых
                    </div>
                  </div>
                  <button className="search-go">{I.search(16)} Найти</button>
                </div>
              </div>

              <div className="search-tags">
                <span className="lbl">Популярно:</span>
                <button className="tag">🦁 Сафари в Кении</button>
                <button className="tag">🏝 Виллы Занзибара</button>
                <button className="tag">🐘 Этоша 5 дней</button>
                <button className="tag">🐪 Сахара 4×4</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="scroll-hint">Прокрутите</div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section className="stats-strip">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat" key={i} style={{ '--col': s.col }}>
              <div className="num">{s.num}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Категории</span>
            <h2 className="title">
              Какой будет ваша <em>Африка?</em>
            </h2>
          </div>
          <p className="lead">
            Сафари в Серенгети, восхождение на Килиманджаро, отдых на Занзибаре,
            культура Марракеша. 12 стран, шесть видов путешествий — и одна Африка.
          </p>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map(c => (
            <div className="cat-card" key={c.id} style={{ '--cat-bg': c.bg }}>
              <div className="cat-glyph">{c.glyph}</div>
              <div className="cat-name">{c.name}</div>
              <div className="cat-count">{c.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Иерархия направлений: Континент → Страна → Регион/Область (ТЗ Лист 1). */
const DEST_TREE = {
  Африка: {
    'Восточная Африка': {
      countries: {
        'TZ-Танзания':  ['Серенгети', 'Нгоронгоро', 'Занзибар', 'Стоун-Таун'],
        'KE-Кения':     ['Масаи-Мара', 'Найроби', 'Момбаса', 'Амбосели'],
        'UG-Уганда':    ['Бвинди', 'Куин-Элизабет', 'Кампала'],
        'ET-Эфиопия':   ['Аддис-Абеба', 'Лалибэла', 'Данакиль'],
      },
    },
    'Южная Африка': {
      countries: {
        'NA-Намибия':   ['Этоша', 'Соссусвлей', 'Свакопмунд', 'Каприви', 'Дамараленд'],
        'ZA-ЮАР':       ['Кейптаун', 'Крюгер', 'Гарден-Рут', 'Стелленбос'],
        'BW-Ботсвана':  ['Окаванго', 'Чобе', 'Калахари'],
        'ZW-Зимбабве':  ['Водопад Виктория', 'Хваге', 'Мана-Пулс'],
      },
    },
    'Северная Африка': {
      countries: {
        'MA-Марокко':   ['Марракеш', 'Фес', 'Сахара (Мерзуга)', 'Эссуэйра', 'Атласские горы'],
        'EG-Египет':    ['Каир / Гиза', 'Луксор', 'Асуан', 'Шарм-эль-Шейх', 'Хургада'],
      },
    },
  },
};

function DestinationsTree() {
  const [continent, setContinent] = useState('Африка');
  const [region,    setRegion]    = useState('Южная Африка');
  const [country,   setCountry]   = useState('NA-Намибия');

  const continents = Object.keys(DEST_TREE);
  const regions    = Object.keys(DEST_TREE[continent]);
  const countries  = Object.keys(DEST_TREE[continent][region].countries);
  const areas      = DEST_TREE[continent][region].countries[country] || [];

  const FLAGS_MAP = { TZ:'🇹🇿', KE:'🇰🇪', UG:'🇺🇬', ET:'🇪🇹', NA:'🇳🇦', ZA:'🇿🇦', BW:'🇧🇼', ZW:'🇿🇼', MA:'🇲🇦', EG:'🇪🇬' };
  const code = country.split('-')[0];
  const name = country.split('-')[1];

  return (
    <section className="section" id="destinations" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Каталог направлений</span>
            <h2 className="title">Континент → Страна → <em>Регион</em></h2>
          </div>
          <p className="lead">
            Иерархический каталог из ТЗ: выбирайте от континента до конкретного региона.
            Каждое направление — локальная команда с лицензией NTB.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12, padding: 16, borderRadius: 14,
          background: 'var(--sand-50)', border: '1px solid var(--sand-200)',
          marginBottom: 24,
        }}>
          <Tree label="1 · Континент" options={continents} value={continent} onChange={(v) => { setContinent(v); setRegion(Object.keys(DEST_TREE[v])[0]); }} />
          <Tree label="2 · Регион"    options={regions}    value={region}    onChange={(v) => { setRegion(v); setCountry(Object.keys(DEST_TREE[continent][v].countries)[0]); }} />
          <Tree label="3 · Страна"    options={countries}  value={country}   onChange={setCountry} labelMap={(c) => `${FLAGS_MAP[c.split('-')[0]]} ${c.split('-')[1]}`} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>4 · Регион / область</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {areas.map(a => (
                <span key={a} style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 999,
                  background: 'white', border: '1px solid var(--sand-300)', cursor: 'pointer',
                }}>{a}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: 22, borderRadius: 14, marginBottom: 28,
          background: `linear-gradient(135deg, rgba(46,125,50,.08), rgba(245,200,66,.12))`,
          border: '1px solid var(--sand-200)',
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 42 }}>{FLAGS_MAP[code]}</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="serif" style={{ fontSize: 26 }}>{name}</div>
            <div style={{ fontSize: 13, color: 'var(--sand-700)', marginTop: 4 }}>
              {continent} · {region} · {areas.length} регионов в каталоге
            </div>
          </div>
          <button
            className="btn-pri"
            onClick={() => window.__LANDING && window.__LANDING.openTours({ code, name, region, continent })}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Найти туры по {name} {I.arr(12)}
          </button>
        </div>

        <div className="dest-grid">
          {DESTINATIONS.map(d => (
            <div className={`dest-card ${d.tall ? 'tall' : ''}`} key={d.code}>
              <div className="bg" style={{ backgroundImage: `url(${d.bg})` }} />
              <PaStripe />
              <div className="dest-body">
                <div className="dest-flag">{FLAGS_MAP[d.code] || '🌍'}</div>
                <h3 className="dest-name">{d.name}</h3>
                <div className="dest-meta">{d.meta}</div>
                <div className="dest-cta">Смотреть {I.arr(12)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tree({ label, options, value, onChange, labelMap }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: '100%', padding: '10px 12px', borderRadius: 10,
        border: '1px solid var(--sand-300)', background: 'white',
        fontSize: 14, fontWeight: 600,
      }}>
        {options.map(o => <option key={o} value={o}>{labelMap ? labelMap(o) : o}</option>)}
      </select>
    </div>
  );
}

function Destinations() {
  return <DestinationsTree />;
}

function Featured() {
  return (
    <section className="section" id="featured" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Подборки портала</span>
            <h2 className="title">
              Рекомендовано <em>командой</em>
            </h2>
          </div>
          <p className="lead">
            Подборки от нашей редакции — то, что мы лично проверили
            и куда отправили бы родителей.
          </p>
        </div>
        <div className="feat-grid">
          {FEATURED.map(f => (
            <div
              className="feat-card" key={f.id}
              onClick={() => window.__LANDING && window.__LANDING.openListing(f)}
              style={{ cursor: 'pointer' }}
            >
              <div className="feat-cover" style={{ backgroundImage: `url(${f.bg})` }}>
                <div className="feat-tags">
                  {f.tags.map((t, i) => (
                    <span key={i} className={`feat-tag ${i === 0 ? 'gold' : ''}`}>{t}</span>
                  ))}
                </div>
                <div className="feat-price">от <b>${f.price}</b><br /><span style={{ fontSize: 10, opacity: .7 }}>за ночь / чел</span></div>
                <PaStripe />
              </div>
              <div className="feat-body">
                <div className="feat-meta">
                  <span>{f.type}</span>
                  <span className="dot" />
                  <span>{f.country}</span>
                </div>
                <h3 className="feat-title">{f.name}</h3>
                <p className="feat-desc">{f.desc}</p>
                <div className="feat-foot">
                  <div className="feat-rating">
                    {I.star(15)} {f.rating} <span className="count">· {f.reviews} отзывов</span>
                  </div>
                  <span className="ghost">Подробнее {I.arr(14)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn btn-outline btn-lg">Все 1284 объекта {I.arr()}</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Маршруты (ТЗ B.4 п.3) ─── */
function Routes() {
  return (
    <section className="section" id="routes" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Готовые маршруты</span>
            <h2 className="title">
              Спланировано <em>за вас</em>
            </h2>
          </div>
          <p className="lead">
            Готовые маршруты от наших гидов — с картой, длительностью и бюджетом.
            Можно бронировать как есть или адаптировать под себя.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {ROUTES.map(r => (
            <div key={r.id}
              onClick={() => window.__LANDING && window.__LANDING.openRoute(r)}
              style={{
                background: 'var(--sand-50)',
                border: '1px solid var(--sand-200)',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform .2s, box-shadow .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,10,0,.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                height: 180,
                backgroundImage: `url(${r.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(255,255,255,.92)', color: 'var(--pa-night)',
                  padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                }}>
                  {r.country}
                </div>
                <PaStripe height={4} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                <h3 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, lineHeight: 1.25, margin: 0 }}>
                  {r.title}
                </h3>

                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--sand-600)' }}>
                  <span><b style={{ color: 'var(--pa-night)' }}>{r.days}</b> дней</span>
                  <span><b style={{ color: 'var(--pa-green)' }}>{r.budget}</b></span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--sand-700)', lineHeight: 1.6 }}>
                  {r.points.map((p, i) => (
                    <span key={i}>
                      {p}
                      {i < r.points.length - 1 && <span style={{ color: 'var(--pa-gold)', margin: '0 6px' }}>→</span>}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
                  {r.tags.map((t, i) => (
                    <span key={i} style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '4px 10px', borderRadius: 999,
                      background: 'var(--pa-gold-light)', color: 'var(--pa-gold-mid)',
                    }}>{t}</span>
                  ))}
                </div>

                <button style={{
                  marginTop: 8,
                  background: 'transparent', border: 'none',
                  color: 'var(--pa-red)', fontWeight: 600, fontSize: 14,
                  textAlign: 'left', padding: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Маршрут на карте {I.arr(14)}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-outline btn-lg">Все маршруты {I.arr()}</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Практическая информация (ТЗ B.4 п.4) ─── */
function PracticalInfo() {
  return (
    <section className="section" id="practical" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Практическая информация</span>
            <h2 className="title">
              Всё, что нужно <em>знать заранее</em>
            </h2>
          </div>
          <p className="lead">
            Визы, перелёты, климат, безопасность и деньги — короткие гайды по каждой стране,
            актуальные на 2026 год.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {PRACTICAL.map(p => (
            <div key={p.id} style={{
              background: 'white',
              border: '1px solid var(--sand-200)',
              borderRadius: 16,
              padding: 24,
              transition: 'border-color .2s, transform .2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pa-red)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sand-200)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{p.glyph}</div>
              <h3 style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontSize: 22, margin: '0 0 10px', color: 'var(--pa-night)',
              }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--sand-700)', margin: 0 }}>
                {p.desc}
              </p>
              <div style={{
                marginTop: 16, fontSize: 13, fontWeight: 600,
                color: 'var(--pa-red)', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                Подробнее {I.arr(12)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Фотогалерея (ТЗ B.4 п.6) ─── */
function Gallery() {
  return (
    <section className="section" id="gallery" style={{ background: 'white' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Фотогалерея</span>
            <h2 className="title">
              Африка <em>в кадре</em>
            </h2>
          </div>
          <p className="lead">
            Снимки от путешественников и гидов портала. Кликните на фото — попадёте
            на страницу региона с подробной картой и подборкой объектов.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '180px',
          gap: 14,
        }}>
          {GALLERY.map(g => (
            <div key={g.id} style={{
              gridRow: g.tall ? 'span 2' : 'span 1',
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              backgroundImage: `url(${g.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
              transition: 'transform .25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,10,0,.7) 0%, transparent 50%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 14, left: 14, right: 14,
                color: 'white', fontSize: 13, fontWeight: 600,
                textShadow: '0 1px 4px rgba(0,0,0,.6)',
              }}>
                {g.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-outline btn-lg">Открыть галерею {I.arr()}</button>
        </div>
      </div>
    </section>
  );
}

/* ─── Блог / Новости (ТЗ B.4 п.5) ─── */
function Blog() {
  return (
    <section className="section" id="blog" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Блог и новости</span>
            <h2 className="title">
              Истории и <em>путеводители</em>
            </h2>
          </div>
          <p className="lead">
            Гайды, маршруты, репортажи из поездок и практические лайфхаки от команды портала
            и наших партнёров на местах.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {BLOG.map(b => (
            <article key={b.id} style={{
              background: 'white',
              border: '1px solid var(--sand-200)',
              borderRadius: 16,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform .2s, box-shadow .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,10,0,.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                height: 200,
                backgroundImage: `url(${b.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--sand-600)' }}>
                  <span style={{
                    color: 'var(--pa-red)', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: 0.5,
                  }}>{b.cat}</span>
                  <span>·</span>
                  <span>{b.date}</span>
                  <span>·</span>
                  <span>{b.read}</span>
                </div>
                <h3 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 22, lineHeight: 1.3, margin: 0, color: 'var(--pa-night)',
                }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--sand-700)', margin: 0 }}>
                  {b.excerpt}
                </p>
                <div style={{
                  marginTop: 'auto', paddingTop: 12, fontSize: 13, fontWeight: 600,
                  color: 'var(--pa-red)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  Читать статью {I.arr(12)}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn btn-outline btn-lg">Все статьи блога {I.arr()}</button>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section how-section" id="how">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap light">Как это работает</span>
            <h2 className="title">
              Три шага<br />до вашей <em style={{ color: 'var(--pa-gold)' }}>Африки</em>
            </h2>
          </div>
          <p className="lead">
            Все объекты проходят верификацию командой портала: документы,
            фото на месте, тестовое бронирование. Никаких сюрпризов.
          </p>
        </div>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-num">01</div>
            <h3>Выберите направление</h3>
            <p>Сафари, пляжи, культура — фильтры по бюджету, датам, языку гида. AI подскажет, если первый раз в Африке.</p>
          </div>
          <div className="how-step">
            <div className="how-num">02</div>
            <h3>Общайтесь напрямую</h3>
            <p>Все вопросы — лично с местным партнёром. Без агентств, без 15% комиссии. Ответ обычно в течение 4 часов.</p>
          </div>
          <div className="how-step">
            <div className="how-num">03</div>
            <h3>Бронируйте уверенно</h3>
            <p>Защищённая оплата, полная страховка путешественника, поддержка 24/7 на русском, английском и французском.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCTA({ onLogin }) {
  return (
    <section className="section partner-section" id="partner">
      <div className="container">
        <div className="partner-grid">
          <div className="partner-visual">
            <PaStripe height={6} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 6 }} />
            <div className="partner-badge">
              <div className="av">SC</div>
              <div>
                <div className="t">Safari Co. Namibia</div>
                <div className="s">Верифицирован · 4 объекта</div>
              </div>
            </div>
            <div className="partner-stat">
              <div className="n">+38%</div>
              <div className="l">Бронирований / квартал</div>
            </div>
          </div>

          <div>
            <span className="cap" style={{ color: 'var(--pa-green)' }}>Для партнёров</span>
            <h2 className="partner-title">
              Развивайте бизнес с <em>AfricaPortal</em>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--sand-700)', lineHeight: 1.65, maxWidth: 520 }}>
              348 локальных компаний уже работают с нами. Лиды напрямую,
              без комиссий по бронированиям, аналитика и CRM в одном кабинете.
            </p>

            <ul className="partner-points">
              <li>
                <div className="check">{I.check(16)}</div>
                <div>
                  <b>0% комиссии с бронирований</b>
                  <span>Платите только за подписку — от $49/мес. Лиды и платежи идут напрямую к вам.</span>
                </div>
              </li>
              <li>
                <div className="check">{I.check(16)}</div>
                <div>
                  <b>CRM, аналитика, отзывы</b>
                  <span>Управляйте лидами как в почтовом клиенте. Аналитика просмотров, конверсии и географии.</span>
                </div>
              </li>
              <li>
                <div className="check">{I.check(16)}</div>
                <div>
                  <b>Поддержка модераторов</b>
                  <span>Помощь с фотосессией, переводами, оформлением карточек. Бесплатно для верифицированных.</span>
                </div>
              </li>
            </ul>

            <div className="partner-actions">
              <button className="btn btn-primary btn-lg">Стать партнёром {I.arr()}</button>
              <button className="btn btn-outline btn-lg" onClick={onLogin}>Войти в кабинет</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Отзывы</span>
            <h2 className="title">
              Что говорят <em>наши путешественники</em>
            </h2>
          </div>
          <p className="lead">
            5 621 отзыв на платформе, средний рейтинг 4.8★. Каждый отзыв проходит модерацию.
          </p>
        </div>
        <div className="t-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`t-card ${t.feature ? 'feature' : ''}`}>
              <div className="t-stars">★★★★★</div>
              <div className="t-text">«{t.text}»</div>
              <div className="t-foot">
                <div className="av">{t.name[0]}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <PaStripe height={5} style={{ marginBottom: 60, maxWidth: 1240, marginLeft: 'auto', marginRight: 'auto' }} />
      <div className="container">
        <div className="footer-top">
          <div className="footer-about">
            <a href="#" className="brand">
              <div className="brand-mark">A</div>
              <div className="brand-text" style={{ fontSize: 22 }}>AfricaP<span className="accent">ortal</span></div>
            </a>
            <p>
              Туристический портал AfricaPortal — прямой мост между путешественниками
              и локальными операторами 12 африканских стран.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram">{I.ig()}</a>
              <a href="#" aria-label="Facebook">{I.fb()}</a>
              <a href="#" aria-label="YouTube">{I.yt()}</a>
            </div>
          </div>

          <div>
            <h4>Направления</h4>
            <ul>
              <li><a href="#">Танзания</a></li>
              <li><a href="#">Кения</a></li>
              <li><a href="#">Намибия</a></li>
              <li><a href="#">ЮАР</a></li>
              <li><a href="#">Марокко</a></li>
              <li><a href="#">Все страны</a></li>
            </ul>
          </div>

          <div>
            <h4>Категории</h4>
            <ul>
              <li><a href="#">Сафари</a></li>
              <li><a href="#">Пляжи</a></li>
              <li><a href="#">Культура</a></li>
              <li><a href="#">Пустыня</a></li>
              <li><a href="#">Гиды</a></li>
            </ul>
          </div>

          <div>
            <h4>Партнёрам</h4>
            <ul>
              <li><a href="#">Стать партнёром</a></li>
              <li><a href="index.html">Войти в ЛК</a></li>
              <li><a href="#">Тарифы</a></li>
              <li><a href="#">Документы</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Рассылка</h4>
            <p style={{ fontSize: 13, marginBottom: 14, marginTop: 0, color: 'rgba(255,255,255,.6)' }}>
              Подборки направлений, скидки партнёров. Раз в месяц.
            </p>
            <input type="email" placeholder="your@email.com" />
            <button className="btn btn-gold btn-sm" style={{ height: 44 }}>Подписаться</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AfricaPortal. Зарегистрирован в Намибии. Лицензия NTB № 12-3456.</span>
          <div className="legal">
            <a href="#">Условия</a>
            <a href="#">Приватность</a>
            <a href="#">Контакты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────── APP ──────────── */
/* ─── #FOOD — каталог гастрономии (ТЗ Лист 1) ─── */
function FoodCatalog() {
  const FOOD = window.FOOD_PLACES || [];
  return (
    <section className="section" id="food">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">#FOOD · Гастрономия</span>
            <h2 className="title">Вкус <em>Африки</em></h2>
          </div>
          <p className="lead">
            Локальные рестораны, уличная еда и винодельни — отобранные редакцией.
            Средний чек, фирменные блюда, часы работы.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {FOOD.map(f => (
            <div key={f.id}
              onClick={() => window.__LANDING && window.__LANDING.openPlace(f, 'food')}
              style={{ borderRadius: 18, overflow: 'hidden', background: 'white', border: '1px solid var(--sand-200)', cursor: 'pointer', transition: 'transform .25s' }}>
              <div style={{ height: 160, backgroundImage: `url(${f.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{f.name}</div>
                  <span style={{ background: 'var(--pa-gold-light)', color: 'var(--pa-gold-mid)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{f.rating} ★</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 4 }}>📍 {f.city} · {f.cuisine}</div>
                <div style={{ fontSize: 13, marginTop: 10, color: 'var(--sand-900)' }}>🍴 <b>{f.signature}</b></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                  {f.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--sand-100)', borderRadius: 999, color: 'var(--sand-700)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--sand-200)', fontSize: 12.5 }}>
                  <span>⏰ {f.hours}</span>
                  <span><b style={{ color: 'var(--pa-green)' }}>~${f.avg}</b> / гость</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── #ACTIVITIES — каталог активностей (ТЗ Лист 1) ─── */
function ActivitiesCatalog() {
  const ACT = window.ACTIVITY_LIST || [];
  const DIFF_COLOR = {
    'Лёгкая':  'var(--pa-green)',
    'Средняя': 'var(--pa-gold-mid)',
    'Сложная': 'var(--pa-red)',
  };
  return (
    <section className="section" id="activities" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">#ACTIVITIES · Активности</span>
            <h2 className="title">Чем заняться в <em>Африке</em></h2>
          </div>
          <p className="lead">
            Сафари, восхождения, дайвинг, пустынные ночёвки. Сложность, длительность, сезонность — на каждой карточке.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {ACT.map(a => (
            <div key={a.id}
              onClick={() => window.__LANDING && window.__LANDING.openPlace(a, 'activity')}
              style={{ borderRadius: 18, overflow: 'hidden', background: 'white', border: '1px solid var(--sand-200)', cursor: 'pointer', transition: 'transform .25s' }}>
              <div style={{ height: 180, backgroundImage: `url(${a.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 10, background: DIFF_COLOR[a.difficulty], color: 'white', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  {a.difficulty}
                </span>
                <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.6)', color: 'white', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                  {a.rating} ★
                </span>
              </div>
              <div style={{ padding: 14 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 4 }}>📍 {a.place}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {a.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--sand-100)', borderRadius: 999, color: 'var(--sand-700)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 12, fontSize: 11.5, textAlign: 'center' }}>
                  <div><div style={{ color: 'var(--sand-700)' }}>Длительность</div><b>{a.duration}</b></div>
                  <div><div style={{ color: 'var(--sand-700)' }}>Сезон</div><b>{a.season}</b></div>
                  <div><div style={{ color: 'var(--sand-700)' }}>Цена</div><b style={{ color: 'var(--pa-green)' }}>${a.price}</b></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── #SHOPING — каталог магазинов/базаров (ТЗ Лист 1) ─── */
function ShopingCatalog() {
  const SH = window.SHOPING_LIST || [];
  return (
    <section className="section" id="shoping">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">#SHOPING · Шопинг</span>
            <h2 className="title">Что привезти из <em>Африки</em></h2>
          </div>
          <p className="lead">
            Базары, ремёсла, дизайн-студии. От сувенирной мелочи до hand-made керамики и серебра.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {SH.map(s => (
            <div key={s.id}
              onClick={() => window.__LANDING && window.__LANDING.openPlace(s, 'shoping')}
              style={{ borderRadius: 18, overflow: 'hidden', background: 'white', border: '1px solid var(--sand-200)', cursor: 'pointer', transition: 'transform .25s' }}>
              <div style={{ height: 160, backgroundImage: `url(${s.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{s.name}</div>
                  <span style={{ background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{s.price}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 4 }}>📍 {s.city} · {s.type}</div>
                <div style={{ fontSize: 13, marginTop: 10, color: 'var(--sand-900)' }}>🛍 {s.signature}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                  {s.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--sand-100)', borderRadius: 999, color: 'var(--sand-700)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--sand-200)', fontSize: 12.5 }}>
                  <span>⏰ {s.hours}</span>
                  <span style={{ color: 'var(--pa-gold-mid)', fontWeight: 600 }}>{s.rating} ★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Каталог гидов (ТЗ Лист 1 — карточка гида с обязательными атрибутами) ─── */
function GuidesCatalog() {
  const GS = window.GUIDES || [];
  const FLAGS_LOCAL = { KE:'🇰🇪', NA:'🇳🇦', MA:'🇲🇦', TZ:'🇹🇿', ZA:'🇿🇦', EG:'🇪🇬' };
  return (
    <section className="section" id="guides" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Гиды и эксперты</span>
            <h2 className="title">Локальные <em>гиды</em></h2>
          </div>
          <p className="lead">
            Лицензированные гиды с языковыми скилами, специализацией и проверенными отзывами.
            Все карточки прошли верификацию NTB / KWS / ONMT / TANAPA.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {GS.map(g => (
            <div key={g.id}
              onClick={() => window.__LANDING && window.__LANDING.openGuide(g)}
              style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--sand-200)', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', gap: 14, padding: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundImage: `url(${g.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, border: '3px solid var(--pa-gold-light)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <div className="serif" style={{ fontSize: 18, fontWeight: 600 }}>{g.name}</div>
                    {g.verified && <span style={{ color: 'var(--pa-green)', fontSize: 14 }} title="Верифицирован">✓</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 2 }}>
                    {FLAGS_LOCAL[g.country] || '🌍'} · {g.experience} лет опыта · {g.rating} ★ ({g.reviews})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                    {g.badges.map((b, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--pa-gold-light)', borderRadius: 999, color: 'var(--pa-gold-mid)', fontWeight: 700 }}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--sand-700)' }}>Языки:</span>{' '}
                  <b>{g.languages.join(', ')}</b>
                </div>
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--sand-700)' }}>Специализация:</span>{' '}
                  {g.specialization.map((s, i) => (
                    <span key={i} style={{ display: 'inline-block', fontSize: 11, padding: '1px 7px', background: 'var(--pa-green-light)', borderRadius: 999, color: 'var(--pa-green-dark)', marginRight: 4, marginTop: 2 }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: 'var(--sand-700)' }}>Регионы:</span>{' '}
                  <b>{g.regions.join(' · ')}</b>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--sand-700)', marginTop: 8, marginBottom: 12 }}>
                  📜 {g.license}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--sand-200)' }}>
                  <b style={{ color: 'var(--pa-green)', fontSize: 16 }}>{g.rate}</b>
                  <button
                    className="btn-pri"
                    onClick={(e) => { e.stopPropagation(); window.__LANDING && window.__LANDING.openGuide(g); }}
                    style={{ padding: '8px 18px', fontSize: 12.5 }}
                  >
                    Связаться
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Каталог туркомпаний (ТЗ Лист 1) ─── */
function TourCompaniesCatalog() {
  const TC = window.TOURCOMPANIES || [];
  const FLAGS_LOCAL = { NA:'🇳🇦', TZ:'🇹🇿', MA:'🇲🇦', KE:'🇰🇪', ZA:'🇿🇦', EG:'🇪🇬' };
  return (
    <section className="section" id="operators">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Туркомпании-партнёры</span>
            <h2 className="title">Локальные <em>операторы</em></h2>
          </div>
          <p className="lead">
            Туроператоры с национальными лицензиями. Тарифы Economy / Standard / Premium, страхование, способы оплаты.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {TC.map(c => (
            <div key={c.id}
              onClick={() => window.__LANDING && window.__LANDING.openCompany(c)}
              style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--sand-200)', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ height: 100, backgroundImage: `url(${c.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6))' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, opacity: .9 }}>{FLAGS_LOCAL[c.country] || '🌍'} · с {c.founded} г. · {c.employees} сотр.</div>
                  </div>
                  {c.verified && (
                    <span style={{ background: 'var(--pa-green)', color: 'white', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>✓ Verified</span>
                  )}
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {c.badges.map((b, i) => (
                    <span key={i} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--pa-gold-light)', borderRadius: 999, color: 'var(--pa-gold-mid)', fontWeight: 700 }}>{b}</span>
                  ))}
                  <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--sand-100)', borderRadius: 999, color: 'var(--sand-700)' }}>{c.languages.join('/')}</span>
                </div>
                <div style={{ fontSize: 12, marginBottom: 8 }}>
                  <span style={{ color: 'var(--sand-700)' }}>Услуги:</span>{' '}
                  <b>{c.services.join(' · ')}</b>
                </div>

                {/* Тарифы */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 8, background: 'var(--sand-50)', borderRadius: 8, marginTop: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>Economy</div>
                    <b style={{ fontSize: 13 }}>от ${c.tariffs.economy}</b>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--sand-200)', borderRight: '1px solid var(--sand-200)' }}>
                    <div style={{ fontSize: 10, color: 'var(--pa-green-dark)' }}>Standard</div>
                    <b style={{ fontSize: 13, color: 'var(--pa-green)' }}>от ${c.tariffs.standard}</b>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--pa-gold-mid)' }}>Premium</div>
                    <b style={{ fontSize: 13, color: 'var(--pa-gold-mid)' }}>от ${c.tariffs.premium}</b>
                  </div>
                </div>

                <div style={{ fontSize: 11.5, color: 'var(--sand-700)', marginTop: 10, lineHeight: 1.5 }}>
                  📜 {c.license}<br />
                  🛡 {c.insurance}<br />
                  💳 {c.payment}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--sand-200)' }}>
                  <div style={{ fontSize: 12 }}>
                    <b style={{ color: 'var(--pa-gold-mid)' }}>{c.rating} ★</b> ({c.reviews} отзывов) · {c.listings} объектов
                  </div>
                  <button
                    className="btn-pri"
                    onClick={(e) => { e.stopPropagation(); window.__LANDING && window.__LANDING.openCompany(c); }}
                    style={{ padding: '8px 18px', fontSize: 12.5 }}
                  >
                    Открыть
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── #Season — сезонный календарь по странам (ТЗ B.4 п.5) ─── */
function SeasonCalendar() {
  const data = window.SEASON_DATA;
  if (!data) return null;
  const colorFor = (v) => v === 2 ? 'var(--pa-green)' : v === 1 ? 'var(--pa-gold-mid)' : 'var(--pa-red)';
  return (
    <section className="section" id="season" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">#Season · Когда ехать</span>
            <h2 className="title">Сезонный <em>календарь</em></h2>
          </div>
          <p className="lead">
            Помесячный план поездок по странам Африки. Зелёный — отличное время,
            жёлтый — допустимо, красный — лучше отложить.
          </p>
        </div>

        {/* Легенда */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          {data.legend.map(l => (
            <div key={l.v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, background: l.color, display: 'inline-block' }} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Таблица */}
        <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '1px solid var(--sand-200)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', padding: '8px 12px', textTransform: 'uppercase' }}>Страна</th>
                {data.months.map(m => (
                  <th key={m} style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', padding: '8px 4px', textTransform: 'uppercase' }}>{m}</th>
                ))}
                <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', padding: '8px 12px', textTransform: 'uppercase' }}>Активности</th>
              </tr>
            </thead>
            <tbody>
              {data.countries.map(c => (
                <tr key={c.code}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                    {window.FLAGS[c.code]} {c.name}
                  </td>
                  {c.months.map((v, i) => (
                    <td key={i} style={{ padding: 2 }}>
                      <div style={{
                        height: 36, borderRadius: 6,
                        background: colorFor(v), opacity: .85,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 11, fontWeight: 700,
                      }} title={`${data.months[i]} · ${data.legend.find(l => l.v === v).label}`}>
                        {v === 2 ? '★' : v === 1 ? '·' : '×'}
                      </div>
                    </td>
                  ))}
                  <td style={{ padding: '8px 12px', fontSize: 11.5, color: 'var(--sand-700)' }}>
                    {Object.entries(c.activities).map(([k, v]) => (
                      <div key={k}><b style={{ color: 'var(--sand-900)' }}>{k}:</b> {v}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ─── Конструктор маршрута — пошаговая форма (ТЗ Лист 3, B.4 п.3) ─── */
function RouteBuilder() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('NA');
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState('standard');
  const [activities, setActivities] = useState(['safari', 'nature']);
  const [generated, setGenerated] = useState(null);

  const COUNTRY_POINTS = {
    NA: ['Виндхук', 'Сесрием', 'Соссусфлей', 'Свакопмунд', 'Этоша', 'Окаханджа', 'Дамараленд', 'Каприви'],
    TZ: ['Арушу', 'Тарангире', 'Серенгети', 'Нгоронгоро', 'Стоун-Таун', 'Кендва', 'Кратер', 'Маньяра'],
    KE: ['Найроби', 'Амбосели', 'Озеро Накуру', 'Масаи-Мара', 'Лайкипия', 'Самбуру'],
    ZA: ['Кейптаун', 'Стелленбос', 'Гарден-Рут', 'Крюгер', 'Йоханнесбург'],
    MA: ['Касабланка', 'Фес', 'Эрфуд', 'Мерзуга', 'Уарзазат', 'Марракеш', 'Эссуэйра'],
  };
  const COUNTRY_NAME = { NA: 'Намибия', TZ: 'Танзания', KE: 'Кения', ZA: 'ЮАР', MA: 'Марокко' };
  const COUNTRY_FLAG = { NA: '🇳🇦', TZ: '🇹🇿', KE: '🇰🇪', ZA: '🇿🇦', MA: '🇲🇦' };

  const ACTIVITIES_OPT = [
    { id: 'safari',  label: 'Сафари',         glyph: '🦁' },
    { id: 'beach',   label: 'Пляж',           glyph: '🏝️' },
    { id: 'culture', label: 'Культура',        glyph: '🏛️' },
    { id: 'nature',  label: 'Природа / парки', glyph: '🌳' },
    { id: 'desert',  label: 'Пустыня',         glyph: '🐪' },
    { id: 'climb',   label: 'Восхождение',     glyph: '⛰️' },
    { id: 'food',    label: 'Гастрономия',     glyph: '🍲' },
    { id: 'photo',   label: 'Фототур',         glyph: '📷' },
  ];

  const BUDGET_OPT = [
    { id: 'economy',  label: 'Эконом',   sub: '$80–120/день',   mult: 1 },
    { id: 'standard', label: 'Стандарт', sub: '$150–250/день',  mult: 1.8 },
    { id: 'premium',  label: 'Премиум',  sub: '$300–500/день',  mult: 3.2 },
    { id: 'luxury',   label: 'Люкс',     sub: '$700+/день',     mult: 6 },
  ];

  const toggleAct = (id) => {
    setActivities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const generate = () => {
    const points = COUNTRY_POINTS[country] || [];
    const useCount = Math.min(points.length, Math.max(3, Math.ceil(days / 1.5)));
    const selected = points.slice(0, useCount);
    const itinerary = Array.from({ length: days }, (_, i) => {
      const point = selected[i % selected.length];
      const act = ACTIVITIES_OPT.find(a => a.id === activities[i % Math.max(activities.length, 1)]) || ACTIVITIES_OPT[0];
      return { day: i + 1, point, act };
    });
    const mult = (BUDGET_OPT.find(b => b.id === budget) || BUDGET_OPT[1]).mult;
    const total = Math.round(days * 180 * mult);
    setGenerated({ country, days, budget, points: selected, itinerary, total, activities });
    setStep(5);
  };

  const reset = () => {
    setGenerated(null);
    setStep(1);
  };

  return (
    <section className="section" id="builder" style={{ background: 'var(--sand-50)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="cap">Конструктор маршрута</span>
            <h2 className="title">Построй свой <em>маршрут</em></h2>
          </div>
          <p className="lead">
            4 шага — и у тебя готовый план поездки с точками, активностями и оценкой бюджета.
            Можно сохранить, переслать партнёру или открыть на карте.
          </p>
        </div>

        {!generated && (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid var(--sand-200)' }}>
            {/* Прогресс шагов */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: s <= step ? 'var(--pa-green)' : 'var(--sand-200)',
                }} />
              ))}
            </div>

            {step === 1 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', marginBottom: 6 }}>Шаг 1 / 4</div>
                <div className="serif" style={{ fontSize: 24, marginBottom: 16 }}>Куда едем?</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  {Object.keys(COUNTRY_POINTS).map(c => (
                    <button key={c} onClick={() => setCountry(c)} style={{
                      padding: 16, borderRadius: 12, cursor: 'pointer',
                      border: country === c ? '2px solid var(--pa-green)' : '1px solid var(--sand-200)',
                      background: country === c ? 'var(--pa-green-light)' : 'white',
                      fontSize: 14, fontWeight: 600,
                    }}>
                      <div style={{ fontSize: 28 }}>{COUNTRY_FLAG[c]}</div>
                      <div style={{ marginTop: 4 }}>{COUNTRY_NAME[c]}</div>
                      <div style={{ fontSize: 11, color: 'var(--sand-700)', marginTop: 2 }}>{COUNTRY_POINTS[c].length} регионов</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', marginBottom: 6 }}>Шаг 2 / 4</div>
                <div className="serif" style={{ fontSize: 24, marginBottom: 16 }}>На сколько дней?</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                  <button onClick={() => setDays(Math.max(3, days - 1))} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--sand-300)', background: 'white', fontSize: 18, cursor: 'pointer' }}>−</button>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--pa-green)', lineHeight: 1 }}>{days}</div>
                    <div style={{ fontSize: 13, color: 'var(--sand-700)' }}>дней</div>
                  </div>
                  <button onClick={() => setDays(Math.min(21, days + 1))} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--sand-300)', background: 'white', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
                <input type="range" min="3" max="21" value={days} onChange={e => setDays(+e.target.value)} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--sand-700)', marginTop: 4 }}>
                  <span>3 дня</span><span>14 дней</span><span>21 день</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', marginBottom: 6 }}>Шаг 3 / 4</div>
                <div className="serif" style={{ fontSize: 24, marginBottom: 16 }}>Бюджет на человека</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
                  {BUDGET_OPT.map(b => (
                    <button key={b.id} onClick={() => setBudget(b.id)} style={{
                      padding: 14, borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                      border: budget === b.id ? '2px solid var(--pa-gold-mid)' : '1px solid var(--sand-200)',
                      background: budget === b.id ? 'var(--pa-gold-light)' : 'white',
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{b.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 2 }}>{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sand-700)', textTransform: 'uppercase', marginBottom: 6 }}>Шаг 4 / 4</div>
                <div className="serif" style={{ fontSize: 24, marginBottom: 16 }}>Активности (выбери 2-5)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                  {ACTIVITIES_OPT.map(a => {
                    const checked = activities.includes(a.id);
                    return (
                      <button key={a.id} onClick={() => toggleAct(a.id)} style={{
                        padding: 12, borderRadius: 10, cursor: 'pointer',
                        border: checked ? '2px solid var(--pa-green)' : '1px solid var(--sand-200)',
                        background: checked ? 'var(--pa-green-light)' : 'white',
                        textAlign: 'left',
                      }}>
                        <span style={{ fontSize: 18, marginRight: 6 }}>{a.glyph}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--sand-200)' }}>
              <button
                className="btn-pri"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                style={{ background: 'transparent', color: 'var(--sand-700)', opacity: step === 1 ? 0.4 : 1 }}
              >
                ← Назад
              </button>
              {step < 4 ? (
                <button className="btn-pri" onClick={() => setStep(step + 1)}>
                  Дальше →
                </button>
              ) : (
                <button className="btn-pri" onClick={generate} style={{ background: 'var(--pa-green)' }}>
                  ✨ Построить маршрут
                </button>
              )}
            </div>
          </div>
        )}

        {generated && (
          <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid var(--sand-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="cap" style={{ color: 'var(--pa-green)' }}>✓ Маршрут готов</span>
                <h3 className="serif" style={{ fontSize: 28, marginTop: 4 }}>
                  {COUNTRY_FLAG[generated.country]} {COUNTRY_NAME[generated.country]} — {generated.days} {generated.days === 1 ? 'день' : generated.days < 5 ? 'дня' : 'дней'}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--sand-700)', marginTop: 4 }}>
                  Бюджет: <b style={{ color: 'var(--pa-green)' }}>~${generated.total.toLocaleString('ru-RU')}</b> на человека · {generated.points.length} точек
                </div>
              </div>
              <button onClick={reset} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>
                ↺ Построить заново
              </button>
            </div>

            {/* Точки маршрута */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18, padding: 14, background: 'var(--sand-50)', borderRadius: 10 }}>
              {generated.points.map((p, i) => (
                <React.Fragment key={i}>
                  <span style={{ background: 'white', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: '1px solid var(--sand-200)' }}>
                    {p}
                  </span>
                  {i < generated.points.length - 1 && <span style={{ color: 'var(--pa-gold)', alignSelf: 'center' }}>→</span>}
                </React.Fragment>
              ))}
            </div>

            {/* День за днём */}
            <div className="cap" style={{ marginBottom: 10 }}>План по дням</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {generated.itinerary.map(d => (
                <div key={d.day} style={{
                  display: 'flex', gap: 14, padding: '10px 14px',
                  background: 'var(--sand-50)', borderRadius: 8,
                  alignItems: 'center',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--pa-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                    {d.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <b>{d.point}</b>
                    <div style={{ fontSize: 12, color: 'var(--sand-700)' }}>{d.act.glyph} {d.act.label}</div>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--sand-700)' }}>
                    День {d.day} из {generated.days}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <button className="btn-pri" style={{ background: 'var(--pa-green)', flex: 1, minWidth: 200 }}>
                💾 Сохранить маршрут
              </button>
              <button className="btn-pri" style={{ background: 'var(--pa-gold-mid)', flex: 1, minWidth: 200 }}>
                📧 Отправить партнёру
              </button>
              <button className="btn-pri" style={{ background: 'var(--pa-red)', flex: 1, minWidth: 200 }}>
                🗺️ Открыть на карте
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Универсальные модалки лендинга ─── */
function LandingModal({ open, onClose, title, children, foot, maxWidth = 720 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(26,10,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, zIndex: 1000, animation: 'fade-in .2s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 18, maxWidth, width: '100%',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        animation: 'modal-in .25s cubic-bezier(.16,1,.3,1)',
      }}>
        <PaStripe height={4} />
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--sand-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="serif" style={{ fontSize: 22 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--sand-700)' }}>×</button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
        {foot && <div style={{ padding: '14px 24px', borderTop: '1px solid var(--sand-200)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>{foot}</div>}
      </div>
    </div>
  );
}

/* Координаты ключевых точек для карт маршрутов */
const ROUTE_COORDS = {
  // Намибия
  'Виндхук': [-22.560, 17.083], 'Сесрием': [-24.482, 15.795], 'Соссусфлей': [-24.728, 15.300],
  'Свакопмунд': [-22.679, 14.526], 'Этоша': [-19.000, 16.000], 'Окаханджа': [-21.984, 16.913],
  'Дамараленд': [-20.500, 14.500], 'Каприви': [-17.800, 24.300],
  // Танзания
  'Арушу': [-3.367, 36.683], 'Тарангире': [-3.840, 36.000], 'Серенгети': [-2.333, 34.833],
  'Нгоронгоро': [-3.166, 35.583], 'Стоун-Таун': [-6.165, 39.198], 'Кендва': [-5.928, 39.301],
  'Кратер': [-3.166, 35.583], 'Маньяра': [-3.500, 35.833],
  // Кения
  'Найроби': [-1.286, 36.817], 'Амбосели': [-2.652, 37.260], 'Озеро Накуру': [-0.367, 36.083],
  'Масаи-Мара': [-1.500, 35.000], 'Лайкипия': [0.500, 36.800], 'Самбуру': [0.583, 37.533],
  // ЮАР
  'Кейптаун': [-33.925, 18.424], 'Стелленбос': [-33.937, 18.864], 'Гарден-Рут': [-34.050, 22.800],
  'Крюгер': [-23.989, 31.555], 'Йоханнесбург': [-26.204, 28.047],
  // Марокко
  'Касабланка': [33.573, -7.589], 'Фес': [34.034, -5.000], 'Эрфуд': [31.434, -4.231],
  'Мерзуга': [31.099, -4.013], 'Уарзазат': [30.918, -6.893], 'Марракеш': [31.629, -7.981],
  'Эссуэйра': [31.514, -9.770],
};

/* Мини-карта Leaflet для модалки маршрута */
function RouteMiniMap({ points, height = 260 }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    if (!elRef.current || !window.L) return;
    const coords = points.map(p => ROUTE_COORDS[p]).filter(Boolean);
    if (coords.length === 0) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    const map = window.L.map(elRef.current, { scrollWheelZoom: false }).setView(coords[0], 6);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 18,
    }).addTo(map);
    // Линия маршрута
    window.L.polyline(coords, { color: '#F5C842', weight: 4, dashArray: '8,8' }).addTo(map);
    // Маркеры с номерами
    coords.forEach((c, i) => {
      const icon = window.L.divIcon({
        className: '',
        html: `<div style="background:#D32F2F;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)">${i + 1}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14],
      });
      window.L.marker(c, { icon }).bindPopup(`<b>${i + 1}. ${points[i]}</b>`).addTo(map);
    });
    map.fitBounds(window.L.latLngBounds(coords).pad(0.15));
    mapRef.current = map;
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [points]);
  return <div ref={elRef} style={{ height, borderRadius: 12, marginBottom: 18, border: '1px solid var(--sand-200)' }} />;
}

/* Модал готового маршрута (Routes) */
function RouteDetailsModal({ route, onClose }) {
  if (!route) return null;
  // Раскладка по дням: распределяем точки равномерно
  const itinerary = Array.from({ length: route.days }, (_, i) => ({
    day: i + 1,
    point: route.points[Math.min(i, route.points.length - 1)],
    activity: route.tags[i % route.tags.length],
  }));
  return (
    <LandingModal
      open onClose={onClose} title={route.title} maxWidth={820}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>Забронировать маршрут</button>
        </>
      }
    >
      <div style={{ height: 180, backgroundImage: `url(${route.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, marginBottom: 14, position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,.95)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
          {route.country}
        </div>
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Маршрут на карте</div>
      <RouteMiniMap points={route.points} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{route.days}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>дней</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-green)' }}>{route.budget}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>стартовый бюджет</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{route.points.length}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>точек</div>
        </div>
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Точки маршрута</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {route.points.map((p, i) => (
          <React.Fragment key={i}>
            <span style={{ padding: '4px 12px', background: 'var(--pa-gold-light)', color: 'var(--pa-gold-mid)', borderRadius: 999, fontSize: 12.5, fontWeight: 600 }}>{p}</span>
            {i < route.points.length - 1 && <span style={{ color: 'var(--pa-gold)', alignSelf: 'center' }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>План по дням</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {itinerary.map(d => (
          <div key={d.day} style={{ display: 'flex', gap: 12, padding: 10, background: 'var(--sand-50)', borderRadius: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--pa-green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{d.day}</div>
            <div style={{ flex: 1 }}>
              <b>{d.point}</b>
              <div style={{ fontSize: 12, color: 'var(--sand-700)' }}>Тематика дня: {d.activity}</div>
            </div>
          </div>
        ))}
      </div>
    </LandingModal>
  );
}

/* Модал гида */
function GuideProfileModal({ guide, onClose }) {
  if (!guide) return null;
  const FLAGS_LOCAL = { KE:'🇰🇪', NA:'🇳🇦', MA:'🇲🇦', TZ:'🇹🇿', ZA:'🇿🇦', EG:'🇪🇬' };
  return (
    <LandingModal
      open onClose={onClose} title="Профиль гида" maxWidth={720}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-gold-mid)' }}>📧 Написать</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>Забронировать</button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 18, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', backgroundImage: `url(${guide.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, border: '4px solid var(--pa-gold-light)' }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <h3 className="serif" style={{ fontSize: 26 }}>{guide.name}</h3>
            {guide.verified && <span style={{ color: 'var(--pa-green)', fontSize: 18 }} title="Верифицирован">✓</span>}
          </div>
          <div style={{ fontSize: 13, color: 'var(--sand-700)', marginBottom: 6 }}>
            {FLAGS_LOCAL[guide.country] || '🌍'} · {guide.experience} лет опыта · ставка <b style={{ color: 'var(--pa-green)' }}>{guide.rate}</b>
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 13.5, marginBottom: 8 }}>
            <span><b style={{ color: 'var(--pa-gold-mid)' }}>{guide.rating} ★</b> ({guide.reviews})</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {guide.badges.map((b, i) => (
              <span key={i} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--pa-gold-light)', borderRadius: 999, color: 'var(--pa-gold-mid)', fontWeight: 700 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
          <div className="cap" style={{ fontSize: 10 }}>Лицензия</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>📜 {guide.license}</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
          <div className="cap" style={{ fontSize: 10 }}>Языки</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>🗣 {guide.languages.join(', ')}</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
          <div className="cap" style={{ fontSize: 10 }}>Специализация</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>🎯 {guide.specialization.join(', ')}</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
          <div className="cap" style={{ fontSize: 10 }}>Регионы работы</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>📍 {guide.regions.join(' · ')}</div>
        </div>
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Последние отзывы</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { name: 'Anna S.',     text: 'Невероятный гид! Знает все локации, отлично общается на русском.', stars: 5 },
          { name: 'Hans M.',     text: 'Профессионал, всё прошло чётко и в срок. Рекомендую.', stars: 5 },
          { name: 'Sophie L.',  text: 'Очень дружелюбный и опытный. Жаль, не было больше времени.', stars: 4 },
        ].map((r, i) => (
          <div key={i} style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <b>{r.name}</b>
              <span style={{ color: 'var(--pa-gold-mid)' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--sand-700)', marginTop: 4 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </LandingModal>
  );
}

/* Модал туркомпании */
function CompanyProfileModal({ company, onClose }) {
  if (!company) return null;
  const FLAGS_LOCAL = { NA:'🇳🇦', TZ:'🇹🇿', MA:'🇲🇦', KE:'🇰🇪', ZA:'🇿🇦', EG:'🇪🇬' };
  return (
    <LandingModal
      open onClose={onClose} title="Туркомпания" maxWidth={780}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-gold-mid)' }}>📧 Связаться</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>Каталог туров</button>
        </>
      }
    >
      <div style={{ height: 160, backgroundImage: `url(${company.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, marginBottom: 18, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.7))', borderRadius: 12 }} />
        <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18, color: 'white' }}>
          <div className="serif" style={{ fontSize: 26, marginBottom: 4 }}>{company.name}</div>
          <div style={{ fontSize: 13, opacity: .9 }}>{FLAGS_LOCAL[company.country]} с {company.founded} г. · {company.employees} сотр. · {company.languages.join('/')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
        <div style={{ padding: 12, background: 'var(--pa-gold-light)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-gold-mid)' }}>{company.rating} ★</div>
          <div style={{ fontSize: 10.5, color: 'var(--sand-700)' }}>{company.reviews} отзывов</div>
        </div>
        <div style={{ padding: 12, background: 'var(--pa-green-light)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-green)' }}>{company.listings}</div>
          <div style={{ fontSize: 10.5, color: 'var(--sand-700)' }}>объектов в каталоге</div>
        </div>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{new Date().getFullYear() - company.founded}+</div>
          <div style={{ fontSize: 10.5, color: 'var(--sand-700)' }}>лет на рынке</div>
        </div>
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Тарифы</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        {['economy', 'standard', 'premium'].map(t => (
          <div key={t} style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div className="cap" style={{ fontSize: 10 }}>{t === 'economy' ? 'Economy' : t === 'standard' ? 'Standard' : 'Premium'}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: t === 'standard' ? 'var(--pa-green)' : t === 'premium' ? 'var(--pa-gold-mid)' : 'inherit' }}>
              от ${company.tariffs[t]}
            </div>
          </div>
        ))}
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Услуги</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {company.services.map((s, i) => (
          <span key={i} style={{ padding: '4px 12px', background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)', borderRadius: 999, fontSize: 12.5 }}>{s}</span>
        ))}
      </div>

      <div style={{ fontSize: 13, color: 'var(--sand-700)', lineHeight: 1.7, padding: 14, background: 'var(--sand-50)', borderRadius: 10 }}>
        📜 <b>{company.license}</b><br />
        🛡 {company.insurance}<br />
        💳 {company.payment}
      </div>
    </LandingModal>
  );
}

/* Модал «Найти туры по стране» — подборка по стране из всех каталогов */
function ToursByCountryModal({ country, onClose }) {
  if (!country) return null;
  const { code, name } = country;
  const FLAGS = { TZ:'🇹🇿', KE:'🇰🇪', UG:'🇺🇬', ET:'🇪🇹', NA:'🇳🇦', ZA:'🇿🇦', BW:'🇧🇼', ZW:'🇿🇼', MA:'🇲🇦', EG:'🇪🇬' };

  // Подбор готовых маршрутов по стране
  const routes  = ROUTES.filter(r => r.country.toLowerCase().includes(name.toLowerCase()));
  // Объекты Featured по стране (поиск по подстроке)
  const featured = FEATURED.filter(f => f.country.toLowerCase().includes(name.toLowerCase()));
  // Гиды + туркомпании по коду страны
  const guides    = (window.GUIDES || []).filter(g => g.country === code);
  const companies = (window.TOURCOMPANIES || []).filter(c => c.country === code);
  // Активности по стране
  const activities = (window.ACTIVITY_LIST || []).filter(a => a.place && a.place.toLowerCase().includes(name.toLowerCase()));
  // Рестораны
  const food     = (window.FOOD_PLACES || []).filter(f => f.city && f.city.toLowerCase().includes(name.toLowerCase()));

  const totalTours = routes.length + featured.length + activities.length;

  return (
    <LandingModal
      open onClose={onClose}
      title={`${FLAGS[code] || '🌍'} Туры по стране: ${name}`}
      maxWidth={920}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>Связаться с менеджером</button>
        </>
      }
    >
      {/* Сводка */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 22,
      }}>
        <div style={{ padding: 14, background: 'var(--pa-green-light)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--pa-green)' }}>{totalTours}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>Предложений</div>
        </div>
        <div style={{ padding: 14, background: 'var(--pa-gold-light)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--pa-gold-mid)' }}>{routes.length}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>Маршрутов</div>
        </div>
        <div style={{ padding: 14, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{guides.length}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>Гидов</div>
        </div>
        <div style={{ padding: 14, background: 'var(--sand-50)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{companies.length}</div>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>Туркомпаний</div>
        </div>
      </div>

      {/* Готовые маршруты */}
      {routes.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8, color: 'var(--pa-green)' }}>🗺 Готовые маршруты</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {routes.map(r => (
              <div key={r.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openRoute(r), 50); }}
                style={{
                  display: 'flex', gap: 12, padding: 12, borderRadius: 10, cursor: 'pointer',
                  background: 'var(--sand-50)', border: '1px solid var(--sand-200)',
                }}
              >
                <div style={{ width: 80, height: 60, backgroundImage: `url(${r.bg})`, backgroundSize: 'cover', borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <b>{r.title}</b>
                  <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 2 }}>
                    {r.days} дней · {r.budget} · {r.points.slice(0, 3).join(' → ')}{r.points.length > 3 ? ' …' : ''}
                  </div>
                </div>
                <span style={{ color: 'var(--pa-red)', fontWeight: 600, alignSelf: 'center' }}>Подробнее →</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Объекты размещения */}
      {featured.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8, color: 'var(--pa-gold-mid)' }}>🏨 Объекты размещения</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 18 }}>
            {featured.map(f => (
              <div key={f.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openListing(f), 50); }}
                style={{ borderRadius: 10, overflow: 'hidden', background: 'white', border: '1px solid var(--sand-200)', cursor: 'pointer' }}
              >
                <div style={{ height: 110, backgroundImage: `url(${f.bg})`, backgroundSize: 'cover' }} />
                <div style={{ padding: 10 }}>
                  <b style={{ fontSize: 13 }}>{f.name}</b>
                  <div style={{ fontSize: 11.5, color: 'var(--sand-700)', marginTop: 2 }}>{f.type} · от ${f.price}/ночь</div>
                  <div style={{ fontSize: 11, color: 'var(--pa-gold-mid)', marginTop: 4 }}>{f.rating} ★ · {f.reviews} отзывов</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Активности */}
      {activities.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8 }}>⛰ Активности</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {activities.map(a => (
              <div key={a.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openPlace(a, 'activity'), 50); }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--sand-50)', borderRadius: 8, cursor: 'pointer' }}
              >
                <div>
                  <b>{a.name}</b> <span style={{ fontSize: 12, color: 'var(--sand-700)' }}>· {a.duration} · {a.difficulty}</span>
                </div>
                <span style={{ color: 'var(--pa-green)', fontWeight: 600 }}>${a.price}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Гиды */}
      {guides.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8 }}>👤 Локальные гиды</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 18 }}>
            {guides.map(g => (
              <div key={g.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openGuide(g), 50); }}
                style={{ display: 'flex', gap: 10, padding: 10, background: 'var(--sand-50)', borderRadius: 8, cursor: 'pointer' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundImage: `url(${g.photo})`, backgroundSize: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13 }}>{g.name}</b>
                  <div style={{ fontSize: 11.5, color: 'var(--sand-700)' }}>{g.specialization[0]} · {g.rate}</div>
                  <div style={{ fontSize: 11, color: 'var(--pa-gold-mid)' }}>{g.rating} ★ ({g.reviews})</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Туркомпании */}
      {companies.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8 }}>🏢 Туркомпании</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {companies.map(c => (
              <div key={c.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openCompany(c), 50); }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'var(--sand-50)', borderRadius: 8, cursor: 'pointer' }}
              >
                <div>
                  <b>{c.name}</b>
                  <div style={{ fontSize: 12, color: 'var(--sand-700)', marginTop: 2 }}>
                    с {c.founded} г. · {c.listings} объектов · от ${c.tariffs.economy}
                  </div>
                </div>
                <span style={{ color: 'var(--pa-gold-mid)', alignSelf: 'center', fontWeight: 600 }}>{c.rating} ★</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Рестораны */}
      {food.length > 0 && (
        <>
          <div className="cap" style={{ marginBottom: 8 }}>🍴 Где поесть</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {food.map(f => (
              <div key={f.id}
                onClick={() => { onClose(); setTimeout(() => window.__LANDING.openPlace(f, 'food'), 50); }}
                style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--sand-50)', borderRadius: 8, cursor: 'pointer' }}
              >
                <div>
                  <b>{f.name}</b> <span style={{ fontSize: 12, color: 'var(--sand-700)' }}>· {f.cuisine} · {f.city}</span>
                </div>
                <span style={{ color: 'var(--pa-green)', fontWeight: 600 }}>~${f.avg}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {totalTours === 0 && guides.length === 0 && companies.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', background: 'var(--sand-50)', borderRadius: 10 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌍</div>
          <b>Скоро будут предложения</b>
          <div style={{ fontSize: 13, color: 'var(--sand-700)', marginTop: 6 }}>
            По стране «{name}» подборка готовится. Оставьте заявку — менеджер свяжется в течение 24 часов.
          </div>
        </div>
      )}
    </LandingModal>
  );
}

/* Модал детальной карточки объекта (Featured / Listing) */
function ListingDetailsModal({ listing, onClose }) {
  if (!listing) return null;
  return (
    <LandingModal
      open onClose={onClose} title={listing.name} maxWidth={780}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-gold-mid)' }}>📅 Доступность</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>Забронировать от ${listing.price}</button>
        </>
      }
    >
      <div style={{ height: 240, backgroundImage: `url(${listing.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, marginBottom: 18, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          {listing.tags.map((t, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              background: i === 0 ? 'var(--pa-gold)' : 'rgba(255,255,255,.92)',
              color: i === 0 ? 'var(--pa-night)' : 'var(--pa-night)',
            }}>{t}</span>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,.95)', padding: '8px 14px', borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--sand-700)' }}>от</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-green)' }}>${listing.price}</div>
          <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>за ночь / чел</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--sand-700)' }}>
            {listing.type} · {listing.country}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
            <span style={{ color: 'var(--pa-gold-mid)', fontSize: 16, fontWeight: 800 }}>{listing.rating} ★</span>
            <span style={{ fontSize: 12, color: 'var(--sand-700)' }}>· {listing.reviews} отзывов</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 14, color: 'var(--sand-700)', lineHeight: 1.7, marginBottom: 16 }}>{listing.desc}</p>

      <div className="cap" style={{ marginBottom: 8 }}>В стоимость включено</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, marginBottom: 18 }}>
        {['Завтрак', 'Wi-Fi', 'Трансфер из аэропорта', 'Гид (англ/нем)', 'Утренний сафари-выезд', 'Налоги и сборы'].map((inc, i) => (
          <div key={i} style={{ padding: '6px 10px', background: 'var(--pa-green-light)', borderRadius: 6, fontSize: 12.5, color: 'var(--pa-green-dark)' }}>
            ✓ {inc}
          </div>
        ))}
      </div>

      <div className="cap" style={{ marginBottom: 8 }}>Цены на 2026 (от/чел)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
          <div className="cap" style={{ fontSize: 10 }}>Низкий сезон (ноя–апр)</div>
          <b style={{ fontSize: 16 }}>${Math.round(listing.price * 0.8)}</b>
        </div>
        <div style={{ padding: 12, background: 'var(--pa-green-light)', borderRadius: 8, textAlign: 'center' }}>
          <div className="cap" style={{ fontSize: 10, color: 'var(--pa-green-dark)' }}>Стандарт (май, окт)</div>
          <b style={{ fontSize: 16, color: 'var(--pa-green)' }}>${listing.price}</b>
        </div>
        <div style={{ padding: 12, background: 'var(--pa-gold-light)', borderRadius: 8, textAlign: 'center' }}>
          <div className="cap" style={{ fontSize: 10, color: 'var(--pa-gold-mid)' }}>Высокий (июн–сен)</div>
          <b style={{ fontSize: 16, color: 'var(--pa-gold-mid)' }}>${Math.round(listing.price * 1.4)}</b>
        </div>
      </div>

      <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 10, fontSize: 12.5, lineHeight: 1.6 }}>
        📞 <b>+264 81 234 5678</b> · ✉ booking@africaportal.com<br />
        🛡 Бесплатная отмена за 14 дней до заезда · оплата картой или SWIFT
      </div>
    </LandingModal>
  );
}

/* Модал заведения (Food / Shoping / Activity) — универсальный */
function PlaceProfileModal({ place, kind, onClose }) {
  if (!place) return null;
  const TITLES = { food: 'Ресторан', shoping: 'Магазин / базар', activity: 'Активность' };
  return (
    <LandingModal
      open onClose={onClose} title={TITLES[kind] || 'Карточка'} maxWidth={680}
      foot={
        <>
          <button onClick={onClose} className="btn-pri" style={{ background: 'transparent', color: 'var(--sand-700)', border: '1px solid var(--sand-300)' }}>Закрыть</button>
          <button className="btn-pri" style={{ background: 'var(--pa-green)' }}>
            {kind === 'food' ? 'Забронировать столик' : kind === 'activity' ? 'Записаться' : 'Открыть на карте'}
          </button>
        </>
      }
    >
      <div style={{ height: 220, backgroundImage: `url(${place.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 12, marginBottom: 16 }} />

      <div className="serif" style={{ fontSize: 24, marginBottom: 6 }}>{place.name}</div>
      <div style={{ fontSize: 13, color: 'var(--sand-700)', marginBottom: 14 }}>
        📍 {place.city || place.place} {place.cuisine && `· ${place.cuisine}`} {place.type && `· ${place.type}`}
      </div>

      {kind === 'food' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pa-green)' }}>~${place.avg}</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>средний чек</div>
          </div>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pa-gold-mid)' }}>{place.rating} ★</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>оценка</div>
          </div>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>⏰</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>{place.hours}</div>
          </div>
        </div>
      )}

      {kind === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          <div style={{ padding: 10, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div className="cap" style={{ fontSize: 10 }}>Длительность</div>
            <b>{place.duration}</b>
          </div>
          <div style={{ padding: 10, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div className="cap" style={{ fontSize: 10 }}>Сложность</div>
            <b>{place.difficulty}</b>
          </div>
          <div style={{ padding: 10, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div className="cap" style={{ fontSize: 10 }}>Сезон</div>
            <b>{place.season}</b>
          </div>
          <div style={{ padding: 10, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div className="cap" style={{ fontSize: 10 }}>Цена</div>
            <b style={{ color: 'var(--pa-green)' }}>${place.price}</b>
          </div>
        </div>
      )}

      {kind === 'shoping' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pa-green)' }}>{place.price}</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>уровень цен</div>
          </div>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--pa-gold-mid)' }}>{place.rating} ★</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>оценка</div>
          </div>
          <div style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>⏰</div>
            <div style={{ fontSize: 10, color: 'var(--sand-700)' }}>{place.hours}</div>
          </div>
        </div>
      )}

      {place.signature && (
        <div style={{ padding: 14, background: 'var(--pa-gold-light)', borderRadius: 10, marginBottom: 14, borderLeft: '3px solid var(--pa-gold)' }}>
          <div className="cap" style={{ fontSize: 10, color: 'var(--pa-gold-mid)' }}>{kind === 'food' ? 'Фирменное блюдо' : 'Что брать'}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{place.signature}</div>
        </div>
      )}

      {place.tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {place.tags.map((t, i) => (
            <span key={i} style={{ fontSize: 11.5, padding: '3px 10px', background: 'var(--sand-100)', borderRadius: 999, color: 'var(--sand-700)' }}>{t}</span>
          ))}
        </div>
      )}
    </LandingModal>
  );
}

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Модалки лендинга
  const [routeModal,   setRouteModal]   = useState(null);
  const [guideModal,   setGuideModal]   = useState(null);
  const [companyModal, setCompanyModal] = useState(null);
  const [placeModal,   setPlaceModal]   = useState(null); // {place, kind}
  const [listingModal, setListingModal] = useState(null);
  const [toursModal,   setToursModal]   = useState(null); // {code, name, region, continent}

  // Глобальный bus для модалок: каталоги вызывают window.__LANDING.openX
  useEffect(() => {
    window.__LANDING = {
      openRoute:   (r) => setRouteModal(r),
      openGuide:   (g) => setGuideModal(g),
      openCompany: (c) => setCompanyModal(c),
      openPlace:   (p, kind) => setPlaceModal({ place: p, kind }),
      openListing: (l) => setListingModal(l),
      openTours:   (c) => setToursModal(c),
    };
    return () => { delete window.__LANDING; };
  }, []);

  const goLogin = () => {
    if (window.__PORTAL_ROUTER) return window.__PORTAL_ROUTER.goDashboard();
    window.location.href = 'index.html';
  };

  return (
    <>
      <Nav onLogin={goLogin} />
      <Hero photo={t.heroPhoto} showSearch={t.showSearch !== false} onLogin={goLogin} />
      <StatsStrip />
      <Categories />
      <Destinations />
      <SeasonCalendar />
      <Routes />
      <RouteBuilder />
      <Featured />
      <ActivitiesCatalog />
      <FoodCatalog />
      <ShopingCatalog />
      <GuidesCatalog />
      <TourCompaniesCatalog />
      <HowItWorks />
      <PracticalInfo />
      <PartnerCTA onLogin={goLogin} />
      <Gallery />
      <Blog />
      <Testimonials />
      <Footer />

      {/* Модалки */}
      <RouteDetailsModal    route={routeModal}     onClose={() => setRouteModal(null)} />
      <GuideProfileModal    guide={guideModal}     onClose={() => setGuideModal(null)} />
      <CompanyProfileModal  company={companyModal} onClose={() => setCompanyModal(null)} />
      <ListingDetailsModal  listing={listingModal} onClose={() => setListingModal(null)} />
      <ToursByCountryModal  country={toursModal}   onClose={() => setToursModal(null)} />
      {placeModal && (
        <PlaceProfileModal place={placeModal.place} kind={placeModal.kind} onClose={() => setPlaceModal(null)} />
      )}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Hero">
          <window.TweakSelect
            label="Фото"
            value={t.heroPhoto}
            onChange={(v) => setTweak('heroPhoto', v)}
            options={[
              { label: 'Серенгети (саванна)', value: 'savanna' },
              { label: 'Этоша (слон)', value: 'elephant' },
              { label: 'Занзибар (пляж)', value: 'zanzibar' },
              { label: 'Сахара (пустыня)', value: 'desert' },
            ]}
          />
          <window.TweakToggle
            label="Виджет поиска"
            value={t.showSearch !== false}
            onChange={(v) => setTweak('showSearch', v)}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

window.LandingApp = App;
if (!window.__SKIP_AUTO_MOUNT) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

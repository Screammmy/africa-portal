/* eslint-disable */
/**
 * Icons — Lucide v0.x (популярная иконк-библиотека, используется в shadcn/ui, Linear, Vercel).
 * Загружается через UMD-сборку. Внутри — мостовой компонент: если Lucide доступен,
 * рендерим иконку из его реестра; иначе fallback на ручной SVG-path из `path`.
 */

/* Мост к Lucide: name — строка (kebab-case) для имени иконки в lucide.icons.
   Lucide UMD выставляет window.lucide; полные имена доступны в lucide.icons. */
const LucideSvg = ({ name, size = 18, stroke = 2 }) => {
  const L = typeof window !== 'undefined' ? window.lucide : null;
  // lucide.icons — массив [tagName, attrs, children] в виде [['line', {x1:..}], ...]
  const def = L && L.icons && L.icons[name];
  if (!def) return null;
  const renderNode = (node, idx) => {
    if (Array.isArray(node)) {
      const [tag, attrs, ...kids] = node;
      const reactAttrs = {};
      Object.keys(attrs || {}).forEach(k => {
        // Конверсия kebab → camelCase для React (stroke-width → strokeWidth)
        const rk = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        reactAttrs[rk] = attrs[k];
      });
      return React.createElement(tag, { key: idx, ...reactAttrs }, kids.map(renderNode));
    }
    return node;
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {def.map((child, i) => renderNode(child, i))}
    </svg>
  );
};

const Icon = ({ path, size = 18, stroke = 2, fill = 'none' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

/* Маппинг наших имён → имена в Lucide (kebab-case). Если иконка отсутствует
   в lucide.icons (старая UMD-сборка), LucideSvg вернёт null и упадём на fallback. */
const LUCIDE_MAP = {
  dashboard:  'layout-dashboard',
  chart:      'trending-up',
  pin:        'map-pin',
  store:      'store',
  star:       'star',
  megaphone:  'megaphone',
  users:      'users',
  usercheck:  'user-check',
  card:       'credit-card',
  settings:   'settings',
  user:       'user',
  logout:     'log-out',
  bell:       'bell',
  search:     'search',
  messages:   'message-square',
  clock:      'clock',
  check:      'check',
  x:          'x',
  arrowup:    'arrow-up',
  arrowdown:  'arrow-down',
  arrowright: 'arrow-right',
  arrowleft:  'arrow-left',
  filter:     'filter',
  plus:       'plus',
  eye:        'eye',
  pencil:     'pencil',
  trash:      'trash-2',
  dots:       'more-horizontal',
  globe:      'globe',
  download:   'download',
  upload:     'upload',
  menu:       'menu',
  layout:     'layout',
  shield:     'shield-check',
  document:   'file-text',
  send:       'send',
  reply:      'reply',
  views:      'eye',
  inbox:      'inbox',
  camera:     'camera',
  sparkles:   'sparkles',
  flame:      'flame',
  info:       'info',
  refresh:    'refresh-cw',
  layers:     'layers',
  utensils:   'utensils',
  shopping:   'shopping-bag',
  compass:    'compass',
  calendar:   'calendar-days',
  link:       'link',
  plug:       'plug',
  heart:      'heart',
  bookmark:   'bookmark',
  briefcase:  'briefcase',
  building:   'building-2',
  award:      'award',
  zap:        'zap',
  map:        'map',
  navigation: 'navigation',
  route:      'route',
  flag:       'flag',
  key:        'key',
  lock:       'lock-keyhole',
  helpcircle: 'help-circle',
  phone:      'phone',
  mail:       'mail',
  copy:       'copy',
  share:      'share-2',
  loader:     'loader-2',
};

/* Fallback пути для случая, если Lucide UMD не загрузится — старые ручные SVG. */
const FALLBACK_PATHS = {
  dashboard: <><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></>,
  chart:     <><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></>,
  pin:       <><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
  star:      <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2"/>,
  user:      <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
  check:     <polyline points="4 12 10 18 20 6"/>,
  x:         <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
  search:    <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></>,
  globe:     <><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
};

/* Универсальная фабрика: возвращает компонент, который сначала пытается отрендерить
   Lucide-иконку; если её нет — fallback на наш path. */
function makeIcon(localName) {
  return (p = {}) => {
    const lucideName = LUCIDE_MAP[localName];
    const L = typeof window !== 'undefined' ? window.lucide : null;
    if (L && L.icons && lucideName && L.icons[lucideName]) {
      return <LucideSvg name={lucideName} {...p} />;
    }
    return <Icon {...p} path={FALLBACK_PATHS[localName] || FALLBACK_PATHS.dashboard} />;
  };
}

const Ic = Object.fromEntries(
  Object.keys(LUCIDE_MAP).map(k => [k, makeIcon(k)])
);

Object.assign(window, { Ic, Icon });

/* ───────────────── MOCK DATA ───────────────── */

// Country code → flag emoji
const FLAGS = {
  NA: '🇳🇦', TZ: '🇹🇿', KE: '🇰🇪', ZA: '🇿🇦', BW: '🇧🇼',
  MA: '🇲🇦', EG: '🇪🇬', ZW: '🇿🇼', UG: '🇺🇬', ET: '🇪🇹',
  RU: '🇷🇺', DE: '🇩🇪', FR: '🇫🇷', GB: '🇬🇧', US: '🇺🇸',
  CN: '🇨🇳', IT: '🇮🇹',
};
const COUNTRY_NAME = {
  NA: 'Намибия', TZ: 'Танзания', KE: 'Кения', ZA: 'ЮАР', BW: 'Ботсвана',
  MA: 'Марокко', EG: 'Египет', ZW: 'Зимбабве', UG: 'Уганда', ET: 'Эфиопия',
};

// Unsplash photo IDs for African travel imagery
const PHOTOS = {
  etosha:    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80&auto=format&fit=crop',
  serengeti: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80&auto=format&fit=crop',
  zanzibar:  'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&q=80&auto=format&fit=crop',
  kruger:    'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&q=80&auto=format&fit=crop',
  victoria:  'https://images.unsplash.com/photo-1591793219735-1da95da6cf6c?w=800&q=80&auto=format&fit=crop',
  sahara:    'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&auto=format&fit=crop',
  capetown:  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80&auto=format&fit=crop',
  giza:      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80&auto=format&fit=crop',
  safari:    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80&auto=format&fit=crop',
  giraffe:   'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80&auto=format&fit=crop',
};

const LISTINGS = [
  { id: 'L01', name: 'Etosha Safari Lodge', nameEn: 'Etosha Safari Lodge', type: 'hotel', country: 'NA', region: 'Кунене', status: 'active', rating: 4.8, reviewCount: 128, viewCount: 2840, leadCount: 12, profileScore: 92, cover: PHOTOS.etosha, partnerName: 'Safari Co. Namibia', tags: ['Сафари', 'Луксор', 'Семейный'], lat: -19.0, lng: 16.3 },
  { id: 'L02', name: 'Серенгети Балун Тур', nameEn: 'Serengeti Balloon Safari', type: 'tour', country: 'TZ', region: 'Серенгети', status: 'pending', rating: 4.9, reviewCount: 64, viewCount: 1820, leadCount: 8, profileScore: 78, cover: PHOTOS.serengeti, partnerName: 'Maasai Adventures', tags: ['Воздушный шар', 'Сафари'], lat: -2.333, lng: 34.833 },
  { id: 'L03', name: 'Zanzibar Beach Villa', nameEn: 'Zanzibar Beach Villa', type: 'hotel', country: 'TZ', region: 'Стоун-Таун', status: 'active', rating: 4.6, reviewCount: 94, viewCount: 1640, leadCount: 5, profileScore: 88, cover: PHOTOS.zanzibar, partnerName: 'Indian Ocean Resorts', tags: ['Пляж', 'Спа'], lat: -6.165, lng: 39.202 },
  { id: 'L04', name: 'Kruger Wild Camp', nameEn: 'Kruger Wild Camp', type: 'hotel', country: 'ZA', region: 'Мпумаланга', status: 'rejected', rating: 4.2, reviewCount: 38, viewCount: 920, leadCount: 2, profileScore: 54, cover: PHOTOS.kruger, partnerName: 'WildSouth SA', tags: ['Сафари', 'Кемпинг'], lat: -23.988, lng: 31.555 },
  { id: 'L05', name: 'Водопад Виктория — экскурсия', nameEn: 'Victoria Falls Day Tour', type: 'excursion', country: 'ZW', region: 'Матабелеленд', status: 'active', rating: 4.7, reviewCount: 71, viewCount: 1280, leadCount: 4, profileScore: 81, cover: PHOTOS.victoria, partnerName: 'Falls Expeditions', tags: ['Водопад', 'Однодневный'], lat: -17.924, lng: 25.856 },
  { id: 'L06', name: 'Сахара Дюны 4×4', nameEn: 'Sahara Dunes 4×4', type: 'tour', country: 'MA', region: 'Эрг-Шебби', status: 'draft', rating: 0, reviewCount: 0, viewCount: 0, leadCount: 0, profileScore: 42, cover: PHOTOS.sahara, partnerName: 'Atlas Routes', tags: ['Пустыня', 'Приключение'], lat: 31.150, lng: -4.005 },
];

/* GIS — точки интереса Намибии (для интерактивной карты) */
const MAP_POIS = [
  /* Размещение (lodging) */
  { id: 'P01', layer: 'lodging', name: 'Etosha Safari Lodge',     lat: -19.000, lng: 16.300, info: 'Лодж 4★ · Кунене · сафари' },
  { id: 'P02', layer: 'lodging', name: 'Sossusvlei Desert Lodge', lat: -24.730, lng: 15.900, info: 'Лодж 5★ · Намиб · дюны' },
  { id: 'P03', layer: 'lodging', name: 'Swakopmund Boutique',     lat: -22.679, lng: 14.526, info: 'Бутик-отель · океан' },
  { id: 'P04', layer: 'lodging', name: 'Windhoek City Hotel',     lat: -22.560, lng: 17.083, info: 'Городской отель 4★' },
  { id: 'P05', layer: 'lodging', name: 'Caprivi River Camp',      lat: -17.800, lng: 24.300, info: 'Кемп на реке · Каприви' },
  /* Парки (parks) */
  { id: 'P06', layer: 'parks', name: 'Национальный парк Этоша',    lat: -18.860, lng: 16.300, info: '«Большая пятёрка»' },
  { id: 'P07', layer: 'parks', name: 'Намиб-Науклуфт (Соссусвлей)', lat: -24.760, lng: 15.290, info: 'Пустыня и дюны' },
  { id: 'P08', layer: 'parks', name: 'Парк Скелетного берега',     lat: -20.000, lng: 13.000, info: 'Кладбище кораблей' },
  { id: 'P09', layer: 'parks', name: 'Парк Каприви',                lat: -18.000, lng: 22.500, info: 'Слоны, бегемоты' },
  /* Маршруты (routes) — узловые точки */
  { id: 'P10', layer: 'routes', name: 'Виндхук → Этоша',           lat: -21.000, lng: 16.700, info: 'Маршрут 450 км · асфальт' },
  { id: 'P11', layer: 'routes', name: 'Свакопмунд → Соссусвлей',   lat: -23.500, lng: 15.200, info: 'Маршрут 380 км · грунт' },
  /* Дороги (roads) */
  { id: 'P12', layer: 'roads',  name: 'B1 (Виндхук — север)',       lat: -22.000, lng: 17.083, info: 'Магистраль B1' },
  { id: 'P13', layer: 'roads',  name: 'C39 на Скелетный берег',     lat: -20.500, lng: 14.000, info: 'Гравий, 4×4' },
  /* POI (достопримечательности) */
  { id: 'P14', layer: 'poi',    name: 'Дюна 45',                    lat: -24.733, lng: 15.450, info: 'Известная дюна' },
  { id: 'P15', layer: 'poi',    name: 'Деддвлей',                   lat: -24.760, lng: 15.293, info: 'Мёртвая долина' },
  { id: 'P16', layer: 'poi',    name: 'Каньон Фиш-Ривер',           lat: -27.620, lng: 17.800, info: '2-й по величине каньон' },
  { id: 'P17', layer: 'poi',    name: 'Тропа Сан-бушменов',         lat: -19.500, lng: 18.500, info: 'Этнографический тур' },
  { id: 'P18', layer: 'poi',    name: 'Колчанное дерево',           lat: -28.380, lng: 18.300, info: 'Заповедник' },
  { id: 'P19', layer: 'poi',    name: 'Тви́фельфонтейн (петроглифы)', lat: -20.582, lng: 14.367, info: 'ЮНЕСКО' },
];

const RECENT_LEADS = [
  { id: 'D01', name: 'Мария Иванова', country: 'RU', message: 'Здравствуйте! Интересует тур на 5 дней в Этошу для двоих в марте. Есть ли свободные даты?', listingName: 'Etosha Safari Lodge', status: 'new', time: '2 часа назад', avatar: 'av-1' },
  { id: 'D02', name: 'Hans Müller', country: 'DE', message: 'Hello, I would like to book the balloon safari for 4 people on April 12. What is included in the price?', listingName: 'Serengeti Balloon Safari', status: 'new', time: '4 часа назад', avatar: 'av-2' },
  { id: 'D03', name: 'Sophie Laurent', country: 'FR', message: 'Bonjour, je cherche une villa avec piscine privée à Zanzibar pour ma lune de miel...', listingName: 'Zanzibar Beach Villa', status: 'in_progress', time: 'вчера', avatar: 'av-3' },
  { id: 'D04', name: 'James Wilson', country: 'GB', message: 'Cancellation policy question — what happens if our group needs to reschedule?', listingName: 'Etosha Safari Lodge', status: 'in_progress', time: '2 дня назад', avatar: 'av-4' },
  { id: 'D05', name: 'Алексей Петров', country: 'RU', message: 'Спасибо за организацию поездки — всё прошло идеально! Готов оставить отзыв.', listingName: 'Victoria Falls Day Tour', status: 'closed', time: '5 дней назад', avatar: 'av-6' },
];

const ACTIVITY_ADMIN = [
  { id: 'A1', type: 'new_listing', text: <><b>Maasai Adventures</b> добавил новый объект <b>«Серенгети Балун Тур»</b></>, time: '5 минут назад', dot: 'green', icon: 'pin' },
  { id: 'A2', type: 'moderation', text: <><b>Falls Expeditions</b> отправил <b>«Victoria Falls Day Tour»</b> на модерацию</>, time: '18 минут назад', dot: 'gold', icon: 'clock' },
  { id: 'A3', type: 'partner', text: <>Новый партнёр <b>Kalahari Trails</b> зарегистрирован, ожидает верификации</>, time: '1 час назад', dot: 'night', icon: 'store' },
  { id: 'A4', type: 'review', text: <>Получен отзыв 1★ на <b>«Kruger Wild Camp»</b> — требует проверки</>, time: '2 часа назад', dot: 'red', icon: 'star' },
  { id: 'A5', type: 'verified', text: <>Партнёр <b>Safari Co. Namibia</b> верифицирован модератором</>, time: '3 часа назад', dot: 'green', icon: 'check' },
  { id: 'A6', type: 'subscription', text: <><b>Indian Ocean Resorts</b> продлил подписку Premium</>, time: '5 часов назад', dot: 'gold', icon: 'card' },
];

const ACTIVITY_PARTNER = [
  { id: 'P1', type: 'lead', text: <>Новый лид от <b>Hans Müller</b> 🇩🇪 на <b>«Serengeti Balloon»</b></>, time: '4 часа назад', dot: 'red', icon: 'inbox' },
  { id: 'P2', type: 'review', text: <>Получен отзыв 5★ на <b>«Etosha Safari Lodge»</b></>, time: 'вчера', dot: 'gold', icon: 'star' },
  { id: 'P3', type: 'update', text: <>Вы обновили фото для объекта <b>«Zanzibar Beach Villa»</b></>, time: '2 дня назад', dot: 'green', icon: 'camera' },
  { id: 'P4', type: 'doc', text: <>Документ <b>NTB-лицензия</b> успешно проверен модератором</>, time: '4 дня назад', dot: 'green', icon: 'check' },
];

const MODERATION_QUEUE = [
  {
    id: 'M1', listingName: 'Серенгети Балун Тур', listingId: 'L02', partner: 'Maasai Adventures',
    type: 'tour', country: 'TZ', date: '18 мая, 14:32', ai: 'safe', cover: PHOTOS.serengeti,
    stars: null, classLabel: 'Эксклюзив', avgPrice: '$580 / чел',
    rooms: null, duration: '1 день · от 4ч',
    location: 'Центральный Серенгети, Танзания',
    contacts: { phone: '+255 754 123 456', email: 'book@maasai-adv.tz', site: 'maasai-adv.tz' },
    booking: 'Предоплата 30%, отмена за 14 дней — без штрафа. Сбор от 4 человек.',
    infrastructure: ['Воздушный шар', 'Шампанский завтрак', 'Фото-сертификат', 'Трансфер из лоджа'],
  },
  {
    id: 'M2', listingName: 'Atlas Mountains Trek', listingId: 'L10', partner: 'Berber Routes',
    type: 'tour', country: 'MA', date: '18 мая, 11:08', ai: 'review', cover: PHOTOS.sahara,
    stars: null, classLabel: 'Эко-туризм', avgPrice: '$340 / чел',
    rooms: null, duration: '3 дня / 2 ночи',
    location: 'Атласские горы, Имлиль',
    contacts: { phone: '+212 524 123 456', email: 'hello@berber-routes.ma', site: 'berber-routes.ma' },
    booking: 'Полная оплата за 7 дней до старта. Группа 2–8 человек.',
    infrastructure: ['Берберский гид', 'Палатки', 'Питание', 'Мулы для багажа'],
  },
  {
    id: 'M3', listingName: 'Sphinx Premium Tour', listingId: 'L11', partner: 'Pyramid Travel',
    type: 'excursion', country: 'EG', date: '17 мая, 18:50', ai: 'safe', cover: PHOTOS.giza,
    stars: null, classLabel: 'Люкс', avgPrice: '$180 / чел',
    rooms: null, duration: '8 часов',
    location: 'Гиза, Каир',
    contacts: { phone: '+20 2 1234 5678', email: 'tours@pyramid-travel.eg', site: 'pyramid-travel.eg' },
    booking: 'Оплата на месте либо онлайн. Бесплатная отмена за 24 часа.',
    infrastructure: ['Русскоговорящий гид', 'Транспорт', 'Билеты', 'Обед', 'Wi-Fi в авто'],
  },
  {
    id: 'M4', listingName: 'Cape Town Wine Tour', listingId: 'L12', partner: 'Cape Routes',
    type: 'excursion', country: 'ZA', date: '17 мая, 09:14', ai: 'flag', cover: PHOTOS.capetown,
    stars: null, classLabel: 'Гастро', avgPrice: '$120 / чел',
    rooms: null, duration: '6 часов',
    location: 'Стелленбос, Кейптаун',
    contacts: { phone: '+27 21 555 0199', email: 'info@cape-routes.za', site: 'cape-routes.za' },
    booking: 'Бронь за 48 часов. Минимум 4 человека.',
    infrastructure: ['3 винодельни', 'Дегустация', 'Сырная тарелка', 'Трансфер'],
  },
  {
    id: 'M5', listingName: 'Giraffe Manor Stay', listingId: 'L13', partner: 'Nairobi Hosts',
    type: 'hotel', country: 'KE', date: '16 мая, 22:01', ai: 'safe', cover: PHOTOS.giraffe,
    stars: 5, classLabel: 'Эксклюзив · Бутик-отель', avgPrice: '$1 200 / ночь',
    rooms: 12, duration: null,
    location: 'Карен, Найроби',
    contacts: { phone: '+254 20 891 0000', email: 'reservations@giraffemanor.ke', site: 'giraffemanor.ke' },
    booking: 'Предоплата 50%. Минимум 2 ночи. Заезд с 14:00, выезд до 11:00.',
    infrastructure: ['Завтрак с жирафами', 'Ресторан', 'Спа', 'Бассейн', 'Wi-Fi', 'Парковка', 'Трансфер из аэропорта'],
  },
];

const REVIEWS = [
  { id: 'R1', rating: 5, criteria: { quality: 5, price: 4, service: 5, location: 5 }, verifiedTrip: true,  text: 'Незабываемое сафари! Гид Самуэль был внимателен к каждой детали — увидели всю «большую пятёрку» за два дня.', author: 'Анна К.', country: 'RU', listing: 'Etosha Safari Lodge', date: '20 мая', ai: 'safe', replied: false },
  { id: 'R2', rating: 4, criteria: { quality: 5, price: 3, service: 4, location: 5 }, verifiedTrip: true,  text: 'Великолепный вид, отличный сервис. Единственное — Wi-Fi в номерах слабоват.', author: 'Tomáš N.', country: 'CZ', listing: 'Zanzibar Beach Villa', date: '19 мая', ai: 'safe', replied: true },
  { id: 'R3', rating: 1, criteria: { quality: 1, price: 2, service: 1, location: 3 }, verifiedTrip: false, text: 'Не приехали за нами в аэропорт. Менеджер недоступен два дня. Деньги назад не вернули!', author: 'James W.', country: 'GB', listing: 'Kruger Wild Camp', date: '19 мая', ai: 'flag', replied: false },
  { id: 'R4', rating: 5, criteria: { quality: 5, price: 4, service: 5, location: 5 }, verifiedTrip: true,  text: 'Полёт на воздушном шаре над Серенгети — это что-то нереальное. Дороже среднего, но стоит того.', author: 'Sophie L.', country: 'FR', listing: 'Serengeti Balloon Safari', date: '18 мая', ai: 'safe', replied: false },
];

const PARTNERS = [
  { id: 'PT1', name: 'Safari Co. Namibia', country: 'NA', objects: 4, status: 'verified', plan: 'Pro', initials: 'SC' },
  { id: 'PT2', name: 'Maasai Adventures', country: 'TZ', objects: 7, status: 'verified', plan: 'Premium', initials: 'MA' },
  { id: 'PT3', name: 'Indian Ocean Resorts', country: 'TZ', objects: 3, status: 'verified', plan: 'Pro', initials: 'IO' },
  { id: 'PT4', name: 'Kalahari Trails', country: 'BW', objects: 0, status: 'pending', plan: 'Basic', initials: 'KT' },
  { id: 'PT5', name: 'Cape Routes', country: 'ZA', objects: 2, status: 'pending', plan: 'Basic', initials: 'CR' },
];

const TRAFFIC_DATA = [
  { d: 'Пн', org: 1820, ref: 640 },
  { d: 'Вт', org: 2140, ref: 720 },
  { d: 'Ср', org: 1980, ref: 580 },
  { d: 'Чт', org: 2380, ref: 880 },
  { d: 'Пт', org: 2760, ref: 1020 },
  { d: 'Сб', org: 3180, ref: 1240 },
  { d: 'Вс', org: 2940, ref: 1180 },
];

const TOP_COUNTRIES = [
  { code: 'DE', name: 'Германия', value: 18420 },
  { code: 'RU', name: 'Россия', value: 16280 },
  { code: 'GB', name: 'Великобритания', value: 12640 },
  { code: 'FR', name: 'Франция', value: 9820 },
  { code: 'US', name: 'США', value: 8240 },
  { code: 'IT', name: 'Италия', value: 5180 },
  { code: 'CN', name: 'Китай', value: 4040 },
];

const SUBSCRIPTION_PLANS = [
  { id: 'basic',   name: 'Basic',   price: 0,   max: 2,  analytics: '7д',  features: ['До 2 объектов', 'Базовая аналитика', 'Email поддержка'] },
  { id: 'pro',     name: 'Pro',     price: 49,  max: 10, analytics: '30д', features: ['До 10 объектов', 'Аналитика за 30 дней', 'Приоритетная поддержка', 'CRM лидов'], current: true },
  { id: 'premium', name: 'Premium', price: 149, max: 50, analytics: '90д', features: ['До 50 объектов', 'Аналитика за 90 дней', 'Персональный менеджер', 'CRM + API доступ', 'Реклама'] },
];

const BILLING_HISTORY = [
  { date: '15 апр 2026', amount: 49, plan: 'Pro · мес', status: 'paid' },
  { date: '15 мар 2026', amount: 49, plan: 'Pro · мес', status: 'paid' },
  { date: '15 фев 2026', amount: 49, plan: 'Pro · мес', status: 'paid' },
  { date: '15 янв 2026', amount: 0,  plan: 'Basic',     status: 'paid' },
];

/* Министерства профильные по странам Африки (ТЗ Лист 3, #Authorities) */
const MINISTRIES = [
  { id: 'MN1', country: 'NA', name: 'Министерство окружающей среды и туризма Намибии', industry: 'Туризм', site: 'meft.gov.na', contact: '+264 61 284 2111' },
  { id: 'MN2', country: 'TZ', name: 'Министерство природных ресурсов и туризма Танзании', industry: 'Туризм', site: 'maliasili.go.tz', contact: '+255 22 286 6065' },
  { id: 'MN3', country: 'KE', name: 'Министерство туризма и дикой природы Кении', industry: 'Туризм', site: 'tourism.go.ke', contact: '+254 20 271 6938' },
  { id: 'MN4', country: 'ZA', name: 'Department of Tourism, ЮАР', industry: 'Туризм', site: 'tourism.gov.za', contact: '+27 12 444 6000' },
  { id: 'MN5', country: 'MA', name: 'Министерство туризма, ремёсел и социальной экономики Марокко', industry: 'Туризм', site: 'mtaess.gov.ma', contact: '+212 537 27 81 00' },
  { id: 'MN6', country: 'EG', name: 'Министерство туризма и древностей Египта', industry: 'Туризм', site: 'mota.gov.eg', contact: '+20 2 2735 6028' },
];

/* Посольства / дип.миссии России в странах Африки (ТЗ #Embassy) */
const EMBASSIES = [
  { id: 'EM1', country: 'NA', city: 'Виндхук',     type: 'Посольство РФ', contact: '+264 61 228 671',  email: 'embrusna@mweb.com.na' },
  { id: 'EM2', country: 'TZ', city: 'Дар-эс-Салам', type: 'Посольство РФ', contact: '+255 22 213 6577', email: 'rusembtz@mid.ru' },
  { id: 'EM3', country: 'KE', city: 'Найроби',     type: 'Посольство РФ', contact: '+254 20 272 8700', email: 'rusembke@mid.ru' },
  { id: 'EM4', country: 'ZA', city: 'Претория',    type: 'Посольство РФ', contact: '+27 12 362 1337',  email: 'embassy@russia.org.za' },
  { id: 'EM5', country: 'MA', city: 'Рабат',       type: 'Посольство РФ', contact: '+212 537 75 36 09', email: 'rusembma@mid.ru' },
  { id: 'EM6', country: 'EG', city: 'Каир',        type: 'Посольство РФ', contact: '+20 2 2748 9353',  email: 'rusembeg@mid.ru' },
];

/* Календарь праздников (ТЗ #Calendar) */
const HOLIDAYS = [
  { id: 'H1', date: '21 марта',   country: 'NA', name: 'День независимости Намибии',       type: 'Национальный' },
  { id: 'H2', date: '27 апреля',  country: 'ZA', name: 'День свободы (ЮАР)',                type: 'Национальный' },
  { id: 'H3', date: '12 декабря', country: 'KE', name: 'Джамхури — День Республики Кении',  type: 'Национальный' },
  { id: 'H4', date: '9 декабря',  country: 'TZ', name: 'День независимости Танзании',       type: 'Национальный' },
  { id: 'H5', date: '23 июля',    country: 'EG', name: 'День революции 23 июля (Египет)',    type: 'Национальный' },
  { id: 'H6', date: 'март–апрель', country: 'MA', name: 'Рамадан (плавающая дата)',          type: 'Религиозный' },
  { id: 'H7', date: '6 ноября',   country: 'MA', name: 'Зелёный марш',                       type: 'Национальный' },
  { id: 'H8', date: 'апрель',     country: 'ET', name: 'Фасика (Эфиопская Пасха)',          type: 'Религиозный' },
];

/* Блог / Статьи портала (ТЗ #Blog) */
const BLOG_POSTS = [
  { id: 'BP1', title: 'Лучшее время для сафари в Серенгети: помесячный календарь',           cat: 'Гид',      author: 'Алина К.',   date: '18 мая 2026', views: 8420, status: 'published' },
  { id: 'BP2', title: 'Намибия на арендованной 4×4: маршрут на 10 дней',                     cat: 'Маршрут',  author: 'Иван П.',    date: '14 мая 2026', views: 5180, status: 'published' },
  { id: 'BP3', title: 'Как получить e-visa в Танзанию: пошаговая инструкция',                cat: 'Практика', author: 'Команда AP', date: '10 мая 2026', views: 12640, status: 'published' },
  { id: 'BP4', title: 'Топ-7 эко-лоджей Восточной Африки 2026',                              cat: 'Подборка', author: 'Алина К.',   date: '5 мая 2026',  views: 3210, status: 'draft' },
  { id: 'BP5', title: 'Атласские горы зимой: трекинг для подготовленных',                    cat: 'Гид',      author: 'Иван П.',    date: '28 апр 2026', views: 1840, status: 'review' },
];

/* Бронирования путешественника (ТЗ — ЛК обычного пользователя) */
const USER_BOOKINGS = [
  {
    id: 'UB01', name: 'Etosha Safari Lodge — 5 дней', country: 'NA', region: 'Кунене',
    cover: PHOTOS.etosha, dates: '12–17 июня 2026', pax: 2, price: '$1 840',
    status: 'upcoming', reviewed: false,
  },
  {
    id: 'UB02', name: 'Водопад Виктория — экскурсия', country: 'ZW', region: 'Матабелеленд',
    cover: PHOTOS.victoria, dates: '20 июня 2026', pax: 2, price: '$240',
    status: 'upcoming', reviewed: false,
  },
  {
    id: 'UB03', name: 'Zanzibar Beach Villa — 7 ночей', country: 'TZ', region: 'Стоун-Таун',
    cover: PHOTOS.zanzibar, dates: '8–15 августа 2026', pax: 2, price: '$2 100',
    status: 'pending', reviewed: false,
  },
  {
    id: 'UB04', name: 'Серенгети Балун Тур', country: 'TZ', region: 'Серенгети',
    cover: PHOTOS.serengeti, dates: '12 марта 2026', pax: 2, price: '$1 160',
    status: 'completed', reviewed: true,
  },
  {
    id: 'UB05', name: 'Cape Town Wine Tour', country: 'ZA', region: 'Стелленбос',
    cover: PHOTOS.capetown, dates: '8 февраля 2026', pax: 4, price: '$480',
    status: 'completed', reviewed: false,
  },
  {
    id: 'UB06', name: 'Пирамиды Гизы — VIP-тур', country: 'EG', region: 'Каир',
    cover: PHOTOS.giza, dates: '22 января 2026', pax: 2, price: '$360',
    status: 'completed', reviewed: true,
  },
  {
    id: 'UB07', name: 'Kruger Wild Camp', country: 'ZA', region: 'Мпумаланга',
    cover: PHOTOS.kruger, dates: '15 декабря 2025', pax: 2, price: '$890',
    status: 'cancelled', reviewed: false,
  },
];

/* Уведомления путешественника */
const USER_NOTIFS = [
  { id: 'UN01', emoji: '✅', title: 'Бронирование подтверждено: Etosha Safari Lodge',
    body: 'Партнёр Safari Co. Namibia подтвердил вашу бронь на 12 июня 2026',
    time: '2 часа назад', unread: true },
  { id: 'UN02', emoji: '💬', title: 'Новое сообщение от Maasai Adventures',
    body: 'Здравствуйте! По вашему запросу о Серенгети — отправил доп. информацию...',
    time: '5 часов назад', unread: true },
  { id: 'UN03', emoji: '⭐', title: 'Можно оставить отзыв о Cape Town Wine Tour',
    body: 'Расскажите путешественникам, как прошла ваша экскурсия 8 февраля',
    time: 'вчера', unread: true },
  { id: 'UN04', emoji: '🔥', title: 'Скидка 25% на туры в Намибию',
    body: 'Сезонное предложение от 3 партнёров — действует до конца недели',
    time: '2 дня назад', unread: true },
  { id: 'UN05', emoji: '📄', title: 'Виза в Танзанию — напоминание',
    body: 'До поездки 8 августа осталось 75 дней. Самое время оформить e-visa',
    time: '3 дня назад', unread: true },
  { id: 'UN06', emoji: '🏆', title: 'Вы получили статус «Опытный путешественник»',
    body: 'Поздравляем! После 5 поездок вам доступны эксклюзивные офферы',
    time: '5 дней назад', unread: false },
  { id: 'UN07', emoji: '💰', title: 'Начислен кешбэк 1 240 ₽',
    body: 'За поездку «Пирамиды Гизы — VIP-тур»',
    time: '10 дней назад', unread: false },
];

/* Диалоги с партнёрами */
const USER_THREADS = [
  {
    id: 'UT01', partner: 'Safari Co. Namibia', avatar: 'av-2',
    listing: 'Etosha Safari Lodge', preview: 'Подтверждаем заезд 12 июня в 14:00, трансфер из Винд...',
    time: '2ч назад', unread: 2,
    messages: [
      { from: 'me',      text: 'Здравствуйте! Хочу уточнить — включён ли трансфер из аэропорта Виндхука?', time: '15 мая, 10:32' },
      { from: 'partner', text: 'Здравствуйте, Мария! Да, трансфер включён. Наш водитель встретит вас с табличкой AfricaPortal.', time: '15 мая, 11:08' },
      { from: 'me',      text: 'Отлично, спасибо! А завтрак с какого времени?', time: '15 мая, 11:12' },
      { from: 'partner', text: 'Завтрак сервируется с 6:30 до 10:00 — как раз перед утренним сафари.', time: '15 мая, 11:18' },
      { from: 'partner', text: 'Подтверждаем заезд 12 июня в 14:00, трансфер из Виндхука выслан на email.', time: '20 мая, 09:15' },
    ],
  },
  {
    id: 'UT02', partner: 'Maasai Adventures', avatar: 'av-3',
    listing: 'Серенгети Балун Тур', preview: 'Здравствуйте! По вашему запросу о Серенгети — отправил...',
    time: '5ч назад', unread: 0,
    messages: [
      { from: 'me',      text: 'Здравствуйте, интересует балун-тур на двоих в августе.', time: '18 мая, 16:00' },
      { from: 'partner', text: 'Конечно! У нас есть свободные даты с 8 по 15 августа. Хотите подробности?', time: '18 мая, 17:30' },
    ],
  },
  {
    id: 'UT03', partner: 'Falls Expeditions', avatar: 'av-4',
    listing: 'Водопад Виктория — экскурсия', preview: 'Полный пакет включает обед и трансфер...',
    time: 'вчера', unread: 0,
    messages: [
      { from: 'partner', text: 'Здравствуйте, Мария! Спасибо за бронирование. Полный пакет включает обед и трансфер.', time: '19 мая, 14:00' },
    ],
  },
  {
    id: 'UT04', partner: 'Поддержка AfricaPortal', avatar: 'av-1',
    listing: 'Общие вопросы', preview: 'Ваша заявка #4729 закрыта.',
    time: '3 дня назад', unread: 0,
    messages: [
      { from: 'me',      text: 'Как использовать бонусы при оплате?', time: '17 мая, 09:00' },
      { from: 'partner', text: 'При оплате выберите «Применить бонусы» — спишется до 10% стоимости. Ваша заявка #4729 закрыта.', time: '17 мая, 10:30' },
    ],
  },
];

/* Отзывы, оставленные пользователем */
const MY_REVIEWS = [
  {
    id: 'MR01', listing: 'Серенгети Балун Тур', cover: PHOTOS.serengeti,
    rating: 5, tripDate: '12 марта 2026', publishedDate: '18 марта 2026',
    text: 'Полёт на воздушном шаре над Серенгети на рассвете — самое сильное впечатление в моей жизни. Гид Самуэль был великолепен, шампанский завтрак — приятный бонус. Однозначно рекомендую!',
    partnerName: 'Maasai Adventures',
    partnerReply: 'Мария, спасибо за тёплые слова! Передадим Самуэлю. Будем рады видеть вас снова — у нас есть и наземные сафари на 5–7 дней.',
  },
  {
    id: 'MR02', listing: 'Пирамиды Гизы — VIP-тур', cover: PHOTOS.giza,
    rating: 4, tripDate: '22 января 2026', publishedDate: '25 января 2026',
    text: 'Отличная экскурсия с русскоговорящим гидом. Минус — было много очередей внутрь пирамиды, ожидали что VIP-формат это решает. В остальном — атмосфера, история и комфортный транспорт.',
    partnerName: 'Pyramid Travel',
    partnerReply: null,
  },
];

/* ─── Интеграции с внешними порталами (ТЗ — Sync с Google Reviews / TripAdvisor) ─── */
const INTEGRATIONS = [
  {
    id: 'google',
    name: 'Google Reviews',
    category: 'Отзывы',
    desc: 'Импорт отзывов и рейтинга из Google Business Profile. Обновление 2 раза в сутки.',
    color: '#4285F4',
    glyph: 'G',
    status: 'connected',
    lastSync: '25.05.2026, 09:14',
    stats: { imported: 1284, errors: 0, rate: 4.7 },
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    category: 'Отзывы',
    desc: 'Синхронизация отзывов и фото объектов. Ранжирование по индексу популярности.',
    color: '#00AF87',
    glyph: 'TA',
    status: 'connected',
    lastSync: '25.05.2026, 08:42',
    stats: { imported: 842, errors: 3, rate: 4.5 },
  },
  {
    id: 'booking',
    name: 'Booking.com',
    category: 'Объекты',
    desc: 'Импорт каталога объектов размещения, цен и наличия. Синхронизация раз в час.',
    color: '#003580',
    glyph: 'B',
    status: 'connected',
    lastSync: '25.05.2026, 09:48',
    stats: { imported: 348, errors: 1, rate: null },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Соцсети',
    desc: 'Импорт фотогалерей и отметок объектов по hashtag. Лента «Африка в фото».',
    color: '#E4405F',
    glyph: 'IG',
    status: 'pending',
    lastSync: '24.05.2026, 22:10',
    stats: { imported: 4280, errors: 12, rate: null },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Соцсети',
    desc: 'Импорт страниц партнёров, событий и отметок. Авторизация через Meta Business.',
    color: '#1877F2',
    glyph: 'FB',
    status: 'disconnected',
    lastSync: '—',
    stats: { imported: 0, errors: 0, rate: null },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Видео',
    desc: 'Подгрузка видео-туров по hashtag #AfricaPortal и каналу партнёра.',
    color: '#FF0000',
    glyph: 'YT',
    status: 'connected',
    lastSync: '25.05.2026, 06:00',
    stats: { imported: 96, errors: 0, rate: null },
  },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    category: 'Уведомления',
    desc: 'Уведомления туристам о новых предложениях, статусах броней, акциях.',
    color: '#0088CC',
    glyph: 'TG',
    status: 'disconnected',
    lastSync: '—',
    stats: { imported: 0, errors: 0, rate: null },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'Уведомления',
    desc: 'Прямой канал партнёр→турист, шаблоны ответов, лиды по клику в чат.',
    color: '#25D366',
    glyph: 'WA',
    status: 'pending',
    lastSync: '23.05.2026, 14:20',
    stats: { imported: 0, errors: 0, rate: null },
  },
];

/* ─── Каталоги FOOD / ACTIVITIES / SHOPING (ТЗ Лист 1) ─── */
const FOOD_PLACES = [
  { id: 'f1', name: 'Joe\'s Beerhouse',     city: 'Виндхук, Намибия',     cuisine: 'Намибийская',  avg: 18, rating: 4.6, signature: 'Капана с куду',         bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', hours: '11:00–23:00', tags: ['Местная', 'Дичь'] },
  { id: 'f2', name: 'Forodhani Gardens',    city: 'Стоун-Таун, Танзания', cuisine: 'Уличная',       avg: 6,  rating: 4.7, signature: 'Занзибар-пицца',         bg: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop', hours: '18:00–23:00', tags: ['Street food', 'Морепродукты'] },
  { id: 'f3', name: 'Café Clock',            city: 'Фес, Марокко',          cuisine: 'Марокканская', avg: 14, rating: 4.5, signature: 'Тажин с верблюжатиной', bg: 'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=800&q=80&auto=format&fit=crop', hours: '09:00–22:00', tags: ['Веган-опции'] },
  { id: 'f4', name: 'Carnivore Restaurant', city: 'Найроби, Кения',        cuisine: 'Гриль',         avg: 38, rating: 4.4, signature: 'Жаркое из крокодила',     bg: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&auto=format&fit=crop', hours: '12:00–23:00', tags: ['Дичь', 'Шведский стол'] },
  { id: 'f5', name: 'The Test Kitchen',     city: 'Кейптаун, ЮАР',         cuisine: 'Авторская',     avg: 96, rating: 4.9, signature: 'Дегустация из 12 блюд', bg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop', hours: '19:00–23:00', tags: ['Fine dining', 'Винотека'] },
  { id: 'f6', name: 'La Mamounia Garden',   city: 'Марракеш, Марокко',     cuisine: 'Французская',  avg: 64, rating: 4.7, signature: 'Утка по-арабски',       bg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop', hours: '12:30–00:00', tags: ['Гранд-отель'] },
];

const ACTIVITY_LIST = [
  { id: 'a1', name: 'Сафари на джипе',         place: 'Этоша, Намибия',      duration: '4 ч',  price: 85,  difficulty: 'Лёгкая',  rating: 4.9, season: 'июн–окт', bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80&auto=format&fit=crop',  tags: ['Сафари', 'Гид'] },
  { id: 'a2', name: 'Полёт на воздушном шаре', place: 'Серенгети, Танзания', duration: '1 ч',  price: 580, difficulty: 'Лёгкая',  rating: 4.8, season: 'круглогод', bg: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80&auto=format&fit=crop',  tags: ['Премиум', 'Романтика'] },
  { id: 'a3', name: 'Восхождение на Килиманджаро', place: 'Танзания',         duration: '7 дней', price: 1840, difficulty: 'Сложная', rating: 4.7, season: 'янв–мар', bg: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&q=80&auto=format&fit=crop',  tags: ['Трек', 'Высота'] },
  { id: 'a4', name: 'Дайвинг с черепахами',     place: 'Занзибар',             duration: '3 ч',  price: 65,  difficulty: 'Средняя', rating: 4.6, season: 'июл–мар', bg: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&q=80&auto=format&fit=crop',  tags: ['Море', 'Сертификат'] },
  { id: 'a5', name: 'Ночёвка в дюнах Сахары',   place: 'Мерзуга, Марокко',     duration: '2 дня', price: 195, difficulty: 'Лёгкая',  rating: 4.8, season: 'окт–апр', bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&auto=format&fit=crop',  tags: ['Пустыня', 'Верблюды'] },
  { id: 'a6', name: 'Полёт к водопаду Виктория', place: 'Зимбабве/Замбия',       duration: '15 мин', price: 165, difficulty: 'Лёгкая',  rating: 4.9, season: 'круглогод', bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80&auto=format&fit=crop',  tags: ['Вертолёт'] },
];

const SHOPING_LIST = [
  { id: 's1', name: 'Greenmarket Square',     city: 'Кейптаун, ЮАР',         type: 'Сувениры',     price: '$$', rating: 4.4, signature: 'Маски, бисер, ткани шви-шви', bg: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80&auto=format&fit=crop', hours: '08:00–18:00', tags: ['Торг уместен'] },
  { id: 's2', name: 'Souk Semmarine',          city: 'Марракеш, Марокко',     type: 'Восточный базар', price: '$', rating: 4.7, signature: 'Кожа, специи, тажины', bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&auto=format&fit=crop', hours: '09:00–21:00', tags: ['Лабиринт', 'Аутентика'] },
  { id: 's3', name: 'Maasai Market',           city: 'Найроби, Кения',         type: 'Этно',          price: '$', rating: 4.5, signature: 'Бисер, шуки, резьба', bg: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=800&q=80&auto=format&fit=crop', hours: '09:00–17:00', tags: ['Только нал'] },
  { id: 's4', name: 'Tashkeel Studios',        city: 'Виндхук, Намибия',      type: 'Дизайн',        price: '$$$', rating: 4.6, signature: 'Hand-made керамика, серебро', bg: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80&auto=format&fit=crop', hours: '10:00–18:00', tags: ['Локальные дизайнеры'] },
  { id: 's5', name: 'Khan El-Khalili',          city: 'Каир, Египет',          type: 'Базар',         price: '$$', rating: 4.3, signature: 'Папирус, золото, духи', bg: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80&auto=format&fit=crop', hours: '10:00–23:00', tags: ['XV век'] },
  { id: 's6', name: 'V&A Waterfront',           city: 'Кейптаун, ЮАР',         type: 'ТЦ',             price: '$$$', rating: 4.8, signature: 'Бренды + локальный дизайн', bg: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80&auto=format&fit=crop', hours: '09:00–21:00', tags: ['Цивилизация', 'Wi-Fi'] },
];

/* ─── Гиды (ТЗ Лист 1) ─── */
const GUIDES = [
  {
    id: 'g1', name: 'Samuel Kipngeno', country: 'KE',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
    languages: ['Английский', 'Суахили', 'Русский'],
    license: 'KWS Senior Guide #4821',
    specialization: ['Сафари', 'Большая пятёрка', 'Фототуры'],
    experience: 12, rating: 4.95, reviews: 184,
    rate: '$120/день', regions: ['Масаи-Мара', 'Амбосели', 'Накуру'],
    verified: true, badges: ['Featured', 'Fluent RU'],
  },
  {
    id: 'g2', name: 'Aïcha Mungi', country: 'NA',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&auto=format&fit=crop',
    languages: ['Английский', 'Африкаанс', 'Немецкий'],
    license: 'NTB Lic. 2019-A-0214',
    specialization: ['Пустыня', '4×4', 'Геология'],
    experience: 8, rating: 4.88, reviews: 92,
    rate: '$95/день', regions: ['Соссусфлей', 'Этоша', 'Дамараленд'],
    verified: true, badges: ['Eco-friendly'],
  },
  {
    id: 'g3', name: 'Hassan El-Mansouri', country: 'MA',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&auto=format&fit=crop',
    languages: ['Арабский', 'Французский', 'Английский', 'Испанский'],
    license: 'ONMT Cert. #M-9923',
    specialization: ['Культура', 'Сахара', 'Имперские города'],
    experience: 15, rating: 4.92, reviews: 248,
    rate: '€80/день', regions: ['Фес', 'Марракеш', 'Эрфуд'],
    verified: true, badges: ['Top-rated', '15 лет опыта'],
  },
  {
    id: 'g4', name: 'Ndidi Okonkwo', country: 'TZ',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop',
    languages: ['Английский', 'Суахили'],
    license: 'TANAPA Lic. SG-2023-118',
    specialization: ['Серенгети', 'Миграция', 'Орнитология'],
    experience: 6, rating: 4.78, reviews: 64,
    rate: '$110/день', regions: ['Серенгети', 'Нгоронгоро', 'Тарангире'],
    verified: true, badges: ['Birder'],
  },
];

/* ─── Туркомпании (ТЗ Лист 1) ─── */
const TOURCOMPANIES = [
  {
    id: 'tc1', name: 'Sahara Safari Co.', country: 'NA',
    logo: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80&auto=format&fit=crop',
    license: 'NTB Operator #NA-2018-447',
    founded: 2014, employees: 28,
    languages: ['EN', 'DE', 'FR', 'RU'],
    services: ['Сафари-туры', 'Аренда 4×4', 'Авиа-перелёты внутр.'],
    tariffs: { economy: 1280, standard: 2480, premium: 4800 },
    rating: 4.82, reviews: 312, listings: 24,
    verified: true, badges: ['Featured', 'Top Operator 2025'],
    insurance: 'NIB Global Cover до $1М', payment: 'Visa/MC/SWIFT',
  },
  {
    id: 'tc2', name: 'Serengeti Expeditions', country: 'TZ',
    logo: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80&auto=format&fit=crop',
    license: 'TZ-TALA #1182',
    founded: 2009, employees: 64,
    languages: ['EN', 'SW', 'IT', 'ES'],
    services: ['Серенгети-туры', 'Килиманджаро', 'Занзибар-комбо'],
    tariffs: { economy: 1840, standard: 3200, premium: 6400 },
    rating: 4.76, reviews: 528, listings: 38,
    verified: true, badges: ['Verified Trip'],
    insurance: 'Allianz Travel', payment: 'Visa/MC/Apple Pay',
  },
  {
    id: 'tc3', name: 'Atlas Discovery Maroc', country: 'MA',
    logo: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80&auto=format&fit=crop',
    license: 'ONMT Operator #M-04421',
    founded: 2016, employees: 18,
    languages: ['AR', 'FR', 'EN'],
    services: ['Имперские города', 'Сахара-туры', 'Гастро-туры'],
    tariffs: { economy: 920, standard: 1480, premium: 2840 },
    rating: 4.81, reviews: 196, listings: 16,
    verified: true, badges: ['Eco-friendly'],
    insurance: 'AXA Assistance', payment: 'Visa/MC',
  },
];

/* ─── Сезонный календарь #Season (ТЗ Лист 3, B.4 п.5) ─── */
const SEASON_DATA = {
  countries: [
    { code: 'NA', name: 'Намибия',
      // 0..2 = плохо, средне, отлично; ключ = месяц 0-11
      months: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1],
      activities: { 'Сафари': 'июн–окт', 'Пустыня': 'апр–окт', 'Пляж': '—' } },
    { code: 'TZ', name: 'Танзания',
      months: [1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 1, 1],
      activities: { 'Сафари': 'июн–окт', 'Килиманджаро': 'янв–мар, июл–сен', 'Занзибар': 'июл–март' } },
    { code: 'KE', name: 'Кения',
      months: [1, 1, 1, 0, 0, 2, 2, 2, 2, 1, 0, 1],
      activities: { 'Сафари': 'июл–окт', 'Большая миграция': 'июл–сен', 'Пляж Момбасы': 'окт–мар' } },
    { code: 'ZA', name: 'ЮАР',
      months: [2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2],
      activities: { 'Кейптаун': 'окт–апр', 'Сафари Крюгер': 'май–сен', 'Серфинг': 'окт–мар' } },
    { code: 'MA', name: 'Марокко',
      months: [1, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 1],
      activities: { 'Сахара': 'окт–апр', 'Имперские города': 'мар–май', 'Атлас': 'апр–окт' } },
    { code: 'EG', name: 'Египет',
      months: [2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2],
      activities: { 'Каир/Луксор': 'окт–апр', 'Дайвинг Шарм': 'круглый год' } },
  ],
  months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  legend: [
    { v: 2, label: 'Отлично',     color: 'var(--pa-green)' },
    { v: 1, label: 'Допустимо',   color: 'var(--pa-gold-mid)' },
    { v: 0, label: 'Не рекомендуем', color: 'var(--pa-red)' },
  ],
};

/* ─── Пользователи и роли портала (ТЗ Лист 3) ─── */
const PORTAL_USERS = [
  { id: 'u1', name: 'Айкуй Мунги',    email: 'admin@africaportal.com',  role: 'superadmin', country: 'NA', joined: '2024-08-12', status: 'active', lastLogin: '25.05.2026, 09:14' },
  { id: 'u2', name: 'Anna Schmidt',    email: 'a.schmidt@gmail.com',     role: 'user',       country: 'DE', joined: '2025-12-04', status: 'active', lastLogin: '24.05.2026, 22:48' },
  { id: 'u3', name: 'Safari Co.',       email: 'ops@safarico.na',          role: 'partner',    country: 'NA', joined: '2024-11-22', status: 'active', lastLogin: '25.05.2026, 08:02' },
  { id: 'u4', name: 'Hans Müller',      email: 'h.mueller@web.de',          role: 'user',       country: 'DE', joined: '2026-02-18', status: 'active', lastLogin: '23.05.2026, 14:20' },
  { id: 'u5', name: 'Serengeti Exp.',  email: 'sales@serengeti-exp.tz',    role: 'partner',    country: 'TZ', joined: '2025-04-09', status: 'pending', lastLogin: '22.05.2026, 11:00' },
  { id: 'u6', name: 'Sophie Laurent',  email: 's.laurent@orange.fr',       role: 'user',       country: 'FR', joined: '2026-01-30', status: 'active', lastLogin: '25.05.2026, 07:42' },
  { id: 'u7', name: 'Editor (журнал)',email: 'editor@africaportal.com',   role: 'editor',     country: 'RU', joined: '2025-03-14', status: 'active', lastLogin: '24.05.2026, 18:15' },
  { id: 'u8', name: 'Mariam Hassan',   email: 'm.hassan@outlook.com',      role: 'user',       country: 'EG', joined: '2026-03-22', status: 'blocked', lastLogin: '12.04.2026, 09:11' },
];

const ROLE_DEFS = [
  { id: 'superadmin', label: 'Суперадмин', count: 1,  desc: 'Полный доступ ко всем модулям + биллинг + конфиг',  color: 'var(--pa-red)' },
  { id: 'admin',      label: 'Админ',      count: 3,  desc: 'Модерация контента, верификация партнёров',          color: 'var(--pa-gold-mid)' },
  { id: 'editor',     label: 'Редактор',   count: 4,  desc: 'Блог, гид редакции, фотогалерея',                     color: 'var(--pa-green)' },
  { id: 'partner',    label: 'Партнёр',    count: 348, desc: 'Управление своими объектами, лиды, отзывы',          color: 'var(--pa-night)' },
  { id: 'user',       label: 'Турист',     count: 42180, desc: 'Бронирование, избранное, отзывы',                  color: '#6b7280' },
];

/* ─── Подписки (платежи) и Реклама ─── */
const SUBSCRIPTIONS_LIST = [
  { id: 'sub1', partner: 'Sahara Safari Co.',      plan: 'Pro',        country: 'NA', amount: 199, status: 'active',   nextBill: '01.06.2026' },
  { id: 'sub2', partner: 'Serengeti Expeditions', plan: 'Premium',    country: 'TZ', amount: 499, status: 'active',   nextBill: '12.06.2026' },
  { id: 'sub3', partner: 'Etosha Lodge',           plan: 'Pro',        country: 'NA', amount: 199, status: 'active',   nextBill: '03.06.2026' },
  { id: 'sub4', partner: 'Atlas Discovery Maroc', plan: 'Standard',  country: 'MA', amount: 89,  status: 'overdue', nextBill: 'просрочено 3 дн.' },
  { id: 'sub5', partner: 'Zanzibar Villas',         plan: 'Standard',  country: 'TZ', amount: 89,  status: 'active',   nextBill: '08.06.2026' },
  { id: 'sub6', partner: 'Marrakesh Tours',        plan: 'Free',       country: 'MA', amount: 0,    status: 'free',     nextBill: '—' },
  { id: 'sub7', partner: 'Cape Town Adventures',   plan: 'Premium',    country: 'ZA', amount: 499, status: 'cancelled', nextBill: 'отменён 18.04' },
];

const ADS_LIST = [
  { id: 'ad1', title: 'Сафари Эль-Доур — раннее бронирование',  partner: 'Sahara Safari Co.',     placement: 'Главная / Hero',   status: 'active',   period: '20.05 – 20.06',  budget: 1200, ctr: 4.8, clicks: 8420 },
  { id: 'ad2', title: 'Серенгети 8 дней — −15%',                 partner: 'Serengeti Expeditions', placement: 'Каталог / Топ',    status: 'active',   period: '15.05 – 15.07',  budget: 2400, ctr: 6.2, clicks: 12840 },
  { id: 'ad3', title: 'Винные туры Стелленбос',                   partner: 'Cape Town Wines',        placement: 'Главная / Stripe',  status: 'pending',  period: '25.05 – 25.08',  budget: 800,  ctr: null, clicks: 0 },
  { id: 'ad4', title: 'Дайвинг с черепахами на Занзибаре',       partner: 'Zanzibar Villas',        placement: 'Категория / Пляжи', status: 'active',   period: '01.05 – 01.09',  budget: 1600, ctr: 5.4, clicks: 6280 },
  { id: 'ad5', title: 'Имперский тур по Марокко',                 partner: 'Atlas Discovery Maroc', placement: 'Категория / Культура', status: 'paused', period: '10.04 – 10.07', budget: 1000, ctr: 3.2, clicks: 4180 },
  { id: 'ad6', title: 'Восхождение на Килиманджаро в январе',    partner: 'Serengeti Expeditions', placement: 'Маршруты',           status: 'rejected', period: '—',                budget: 0,    ctr: null, clicks: 0 },
];

Object.assign(window, {
  FLAGS, COUNTRY_NAME, PHOTOS,
  LISTINGS, RECENT_LEADS, ACTIVITY_ADMIN, ACTIVITY_PARTNER,
  MODERATION_QUEUE, REVIEWS, PARTNERS, TRAFFIC_DATA,
  TOP_COUNTRIES, SUBSCRIPTION_PLANS, BILLING_HISTORY,
  MINISTRIES, EMBASSIES, HOLIDAYS, BLOG_POSTS,
  USER_BOOKINGS, USER_NOTIFS, USER_THREADS, MY_REVIEWS,
  MAP_POIS,
  INTEGRATIONS, FOOD_PLACES, ACTIVITY_LIST, SHOPING_LIST,
  GUIDES, TOURCOMPANIES, SEASON_DATA,
  PORTAL_USERS, ROLE_DEFS, SUBSCRIPTIONS_LIST, ADS_LIST,
});

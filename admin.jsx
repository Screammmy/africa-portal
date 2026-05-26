/* eslint-disable */
/**
 * AdminShell — sidebar + topbar + page router for /admin/*
 * Pages: dashboard, objects, partners, reviews, ads,
 *        users, verification, subscriptions, analytics, settings.
 */
const { useState: useStateAdm, useEffect: useEffectAdm, useMemo: useMemoAdm } = React;

const ADMIN_NAV = [
  { section: 'Обзор' },
  { id: 'dashboard',  label: 'Дашборд',    icon: 'dashboard' },
  { id: 'analytics',  label: 'Аналитика',  icon: 'chart' },
  { section: 'Контент' },
  { id: 'objects',    label: 'Объекты',    icon: 'pin',       count: 23 },
  { id: 'partners',   label: 'Партнёры',   icon: 'store' },
  { id: 'reviews',    label: 'Отзывы',     icon: 'star',      count: 7 },
  { id: 'ads',        label: 'Реклама',    icon: 'megaphone' },
  { id: 'blog',       label: 'Блог',       icon: 'document',  count: 2 },
  { section: 'Карта и справочники' },
  { id: 'map',        label: 'Карта (GIS)', icon: 'pin' },
  { id: 'ministries', label: 'Министерства', icon: 'shield' },
  { id: 'embassies',  label: 'Посольства',  icon: 'globe' },
  { id: 'holidays',   label: 'Календарь',   icon: 'clock' },
  { section: 'Пользователи' },
  { id: 'users',      label: 'Все юзеры',  icon: 'users' },
  { id: 'verify',     label: 'Верификация',icon: 'usercheck', count: 4 },
  { section: 'Система' },
  { id: 'subs',         label: 'Подписки',     icon: 'card' },
  { id: 'integrations', label: 'Интеграции',   icon: 'plug', count: 4 },
  { id: 'settings',     label: 'Настройки',    icon: 'settings' },
  { id: 'profile',      label: 'Мой профиль',  icon: 'user' },
];

function ThemeSwitcher({ value, onChange, collapsed }) {
  const THEMES = [
    { id: 'white', label: 'Белый',   dots: ['#fff', '#D32F2F', '#2E7D32', '#F5C842'] },
    { id: 'green', label: 'Зелёный', dots: ['#1B5E20', '#D32F2F', '#F5C842'] },
    { id: 'dark',  label: 'Ночной',  dots: ['#1A0A00', '#F5C842', '#D32F2F'] },
    { id: 'gold',  label: 'Золотой', dots: ['#FFF8C4', '#D32F2F', '#2E7D32'] },
  ];
  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Тема">
      {THEMES.map(t => (
        <button
          key={t.id}
          role="radio"
          aria-checked={value === t.id}
          aria-label={t.label}
          title={t.label}
          className={`theme-dot-btn ${value === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.dots.map((c, i) => (
            <span key={i} className="theme-dot" style={{ background: c }} />
          ))}
        </button>
      ))}
    </div>
  );
}

function Sidebar({ nav, active, onNav, brandColor = 'red', logo = 'AP', theme, onTheme, footerExtra }) {
  return (
    <aside className="sidebar" aria-label="Главная навигация">
      <div className="sidebar-brand">
        <div className="brand-logo">{logo}</div>
        <div className="brand-text">
          AfricaP<span className="accent">ortal</span>
        </div>
      </div>
      <PanAfricanStripe height={3} />

      <nav className="sidebar-nav" aria-label="Разделы">
        {nav.map((n, i) => {
          if (n.section) {
            return <div key={`s${i}`} className="sidebar-section">{n.section}</div>;
          }
          const IconComp = window.Ic[n.icon] || window.Ic.dashboard;
          return (
            <button
              key={n.id}
              className={`nav-item ${active === n.id ? 'active' : ''}`}
              onClick={() => onNav(n.id)}
              aria-current={active === n.id ? 'page' : undefined}
              title={n.label}
            >
              <IconComp size={18} stroke={2} />
              <span className="nav-label">{n.label}</span>
              {n.count != null && <span className="nav-count">{n.count}</span>}
              {n.chip && <span className="nav-chip">{n.chip}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {footerExtra}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ThemeSwitcher value={theme} onChange={onTheme} />
          <button className="nav-item" style={{ color: 'var(--pa-red)', margin: 0, width: '100%' }}>
            <window.Ic.logout size={18} />
            <span className="nav-label">Выйти</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs, sub, user = { name: 'Айкуй Мунги', role: 'SUPERADMIN' }, extras, currentRole, onRoleChange, openSpec }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">›</span>}
            <span className={i === crumbs.length - 1 ? 'last' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-search">
        <span className="search-ico"><window.Ic.search size={16} /></span>
        <input className="input" type="text" placeholder="Поиск по объектам, партнёрам, лидам..." />
        <span className="kbd">⌘K</span>
      </div>

      {onRoleChange && (
        <div className="role-switch" aria-label="Просмотр от лица">
          <window.Ic.user size={13} />
          <select
            className="role-select"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            aria-label="Просмотр от лица"
            title="Переключить роль для просмотра"
          >
            <option value="admin">Админ</option>
            <option value="partner">Партнёр</option>
            <option value="partner_pending">Pending</option>
            <option value="user">Путешественник</option>
          </select>
        </div>
      )}

      {openSpec && (
        <button
          className="home-btn spec-btn"
          onClick={openSpec}
          title="Спецификация каркаса портала — карта функционала по ТЗ"
        >
          <window.Ic.layers size={15} />
          <span>Спецификация</span>
        </button>
      )}

      <button
        className="home-btn"
        onClick={() => {
          if (window.__PORTAL_ROUTER) return window.__PORTAL_ROUTER.goLanding();
          window.location.href = 'landing.html';
        }}
        title="На главную страницу портала"
      >
        <window.Ic.globe size={15} />
        <span>На сайт</span>
      </button>

      {extras}
      <button className="topbar-bell" aria-label="Уведомления">
        <window.Ic.bell size={18} />
        <span className="dot" />
      </button>
      <div className="user-chip">
        <Avatar name={user.name} size="sm" avClass="av-3" />
        <div style={{ minWidth: 0 }}>
          <div className="name">{user.name}</div>
          <div className="role">{user.role}</div>
        </div>
      </div>
    </header>
  );
}

/* ─── /admin/dashboard ─── */
function AdminDashboard({ openModeration }) {
  const [period, setPeriod] = useStateAdm('7д');
  const [selected, setSelected] = useStateAdm([]);

  const toggleRow = (id) =>
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Дашборд</h1>
          <div className="page-sub">Сегодня · 20 мая 2026 · Все активности портала</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm"><window.Ic.download size={14} /> Экспорт</button>
          <button className="btn btn-primary btn-sm"><window.Ic.plus size={14} /> Новый объект</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <MetricCard
          label="Всего объектов"
          value={<CountUp to={1284} />}
          delta={{ value: '+12', direction: 'up' }}
          sub="за неделю"
          icon="pin"
          sparkline={[1240, 1252, 1258, 1264, 1272, 1278, 1284]}
        />
        <MetricCard
          label="Активных партнёров"
          value={<CountUp to={348} />}
          delta={{ value: '+5', direction: 'up' }}
          sub="новых"
          accent="green"
          icon="store"
          sparkline={[330, 335, 338, 340, 343, 346, 348]}
        />
        <MetricCard
          label="На модерации"
          value={<CountUp to={23} />}
          delta={{ value: 'требуют внимания', direction: 'neutral' }}
          accent="red"
          icon="clock"
          pulse
        />
        <MetricCard
          label="Всего отзывов"
          value={<CountUp to={5621} />}
          delta={{ value: '+89', direction: 'up' }}
          sub="за месяц"
          accent="gold"
          icon="star"
          sparkline={[5400, 5460, 5510, 5550, 5580, 5602, 5621]}
        />
      </div>

      <div className="grid-12" style={{ marginBottom: 24 }}>
        {/* traffic chart */}
        <div className="card card-pad" style={{ gridColumn: 'span 8' }}>
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Трафик портала</h2>
              <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4, display: 'flex', gap: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--pa-green)' }} /> Органика
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--pa-gold-mid)' }} /> Реферал
                </span>
              </div>
            </div>
            <div className="tabs">
              {['7д', '30д', '90д'].map(p => (
                <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <AreaChart data={window.TRAFFIC_DATA} />
        </div>

        {/* activity */}
        <div className="card card-pad" style={{ gridColumn: 'span 4' }}>
          <div className="sec-head">
            <h2 className="sec-title">Лента активности</h2>
            <a className="sec-link">Все →</a>
          </div>
          <ActivityFeed items={window.ACTIVITY_ADMIN} max={6} />
        </div>
      </div>

      {/* Moderation queue */}
      <div className="table-wrap">
        <div className="table-toolbar">
          <div>
            <h2 className="sec-title" style={{ marginBottom: 4 }}>Очередь модерации</h2>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>5 объектов ожидают проверки</div>
          </div>
          <div style={{ marginLeft: 'auto' }} className="filter-pills">
            <button className="active">Все <span className="ct">5</span></button>
            <button>Ожидают <span className="ct">5</span></button>
            <button>Отклонённые <span className="ct">2</span></button>
            <button>Повторная подача <span className="ct">0</span></button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="bulk-bar">
            <b>{selected.length}</b> выбрано
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn btn-sm" style={{ background: 'var(--pa-green)', color: 'white' }}>
                <window.Ic.check size={14} /> Одобрить
              </button>
              <button className="btn btn-sm btn-danger">
                <window.Ic.x size={14} /> Отклонить
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setSelected([])}>Отмена</button>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <Checkbox
                    checked={selected.length === window.MODERATION_QUEUE.length}
                    onChange={(v) => setSelected(v ? window.MODERATION_QUEUE.map(m => m.id) : [])}
                  />
                </th>
                <th className="sorted">Объект <span className="sort-ic">▼</span></th>
                <th>Партнёр</th>
                <th>Тип</th>
                <th>Страна</th>
                <th>Подача</th>
                <th>AI-оценка</th>
                <th>Статус</th>
                <th style={{ width: 130 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {window.MODERATION_QUEUE.map((m) => (
                <tr key={m.id} className={selected.includes(m.id) ? 'selected' : ''}>
                  <td><Checkbox checked={selected.includes(m.id)} onChange={() => toggleRow(m.id)} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="thumb" style={{ backgroundImage: `url(${m.cover})` }} />
                      <div>
                        <div className="cell-title">{m.listingName}</div>
                        <div className="cell-sub">ID #{m.listingId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{m.partner}</td>
                  <td>
                    <span style={{ textTransform: 'capitalize', fontSize: 13 }}>
                      {m.type === 'hotel' ? 'Отель' : m.type === 'tour' ? 'Тур' : 'Экскурсия'}
                    </span>
                  </td>
                  <td><span className="flag">{window.FLAGS[m.country]}</span> {window.COUNTRY_NAME[m.country]}</td>
                  <td><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.date}</span></td>
                  <td><AiChip score={m.ai} /></td>
                  <td><StatusBadge status="pending" /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm" style={{ background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)', padding: '0 10px' }}
                        onClick={() => openModeration(m, 'approve')}>
                        <window.Ic.check size={14} />
                      </button>
                      <button className="btn btn-sm btn-danger" style={{ padding: '0 10px' }}
                        onClick={() => openModeration(m, 'reject')}>
                        <window.Ic.x size={14} />
                      </button>
                      <button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }} onClick={() => openModeration(m, 'view')}>
                        <window.Ic.eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* Таксономия из ТЗ (Лист 1 «Структура картотеки»):
   Регион → Страна → Отрасль → Тип → Подтип. Намибия — по умолчанию. */
const TAXONOMY = {
  regions: [
    { value: 'AF', label: 'Африка', tag: '#AFRICA' },
    { value: 'OTHER', label: 'Все остальные', tag: '#OTHER' },
  ],
  industries: [
    { value: 'tourism', label: 'Туризм', tag: '#TOURISM' },
    { value: 'mice',    label: 'Деловые конференции', tag: '#MICE' },
    { value: 'food',    label: 'Гастрономия (FOOD)', tag: '#FOOD' },
    { value: 'activities', label: 'Активности', tag: '#ACTIVITIES' },
    { value: 'shopping', label: 'Шопинг', tag: '#SHOPING' },
    { value: 'other',   label: 'Другое', tag: '#OTHER' },
  ],
  types: [
    { value: 'hotel',     label: 'Отель',         tag: '#HOTEL' },
    { value: 'tour',      label: 'Тур',           tag: '#TOUR' },
    { value: 'excursion', label: 'Экскурсия',     tag: '#EXCURSION' },
    { value: 'guide',     label: 'Гиды',          tag: '#GUIDE' },
    { value: 'company',   label: 'Туркомпания',   tag: '#TOURCO' },
  ],
  subtypes: {
    hotel:     ['Международная сеть', 'Местный отель', 'Лодж', 'Гестхаус'],
    tour:      ['Сафари', 'Люкс', 'Фототуризм', 'Эко-туризм', 'Этнографический', 'Эксклюзив', 'Экспедиция', 'MICE/Бизнес'],
    excursion: ['Природные парки / заповедники', 'Этнографические', 'Шопинг-туры'],
    guide:     ['Местные гиды', 'Российские/Русскоговорящие', 'Экскурсоводы', 'Сотрудники туроператоров'],
    company:   ['Туроператор РФ', 'Международная сеть', 'Страна'],
  },
};

const TAX_COUNTRIES = ['NA', 'ZA', 'ET', 'TZ', 'EG', 'BW', 'ZW', 'KE', 'MA', 'UG'];

/* ─── /admin/objects ─── */
function AdminObjects({ openModeration }) {
  const [filter, setFilter] = useStateAdm('all');
  // Намибия (NA) — страна по умолчанию по ТЗ.
  const [taxRegion,   setTaxRegion]   = useStateAdm('AF');
  const [taxCountry,  setTaxCountry]  = useStateAdm('NA');
  const [taxIndustry, setTaxIndustry] = useStateAdm('tourism');
  const [taxType,     setTaxType]     = useStateAdm('all');
  const [taxSubtype,  setTaxSubtype]  = useStateAdm('all');

  const list = useMemoAdm(() => {
    let arr = window.LISTINGS;
    if (filter !== 'all') arr = arr.filter(l => l.status === filter);
    if (taxCountry !== 'all') arr = arr.filter(l => l.country === taxCountry);
    if (taxType !== 'all')    arr = arr.filter(l => l.type === taxType);
    return arr;
  }, [filter, taxCountry, taxType]);

  const subtypesForType = taxType !== 'all' ? TAXONOMY.subtypes[taxType] : null;

  // Активные теги (для визуализации #NAMIBIA / #TOURISM / #HOTEL)
  const activeTags = [];
  const regTag = TAXONOMY.regions.find(r => r.value === taxRegion);
  if (regTag) activeTags.push(regTag.tag);
  if (taxCountry !== 'all') activeTags.push('#' + (window.COUNTRY_NAME[taxCountry] || taxCountry).toUpperCase());
  const indTag = TAXONOMY.industries.find(i => i.value === taxIndustry);
  if (indTag) activeTags.push(indTag.tag);
  if (taxType !== 'all') {
    const tt = TAXONOMY.types.find(t => t.value === taxType);
    if (tt) activeTags.push(tt.tag);
  }
  if (taxSubtype !== 'all') activeTags.push('#' + taxSubtype.toUpperCase().replace(/[^A-ZА-Я0-9]+/g, '_'));

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Объекты</h1>
          <div className="page-sub">Управление всеми объектами портала</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm"><window.Ic.filter size={14} /> Фильтры</button>
          <button className="btn btn-secondary"><window.Ic.plus size={16} /> Добавить объект</button>
        </div>
      </div>

      {/* Таксономия (Регион → Страна → Отрасль → Тип → Подтип) */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 22,
      }}>
        <div className="cap" style={{ marginBottom: 10 }}>Картотека · фильтр по таксономии</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>1 · Регион</span>
            <select className="input" value={taxRegion} onChange={e => setTaxRegion(e.target.value)}>
              {TAXONOMY.regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>2 · Страна</span>
            <select className="input" value={taxCountry} onChange={e => setTaxCountry(e.target.value)}>
              <option value="all">Все страны</option>
              {TAX_COUNTRIES.map(c => (
                <option key={c} value={c}>
                  {window.COUNTRY_NAME[c] || c}{c === 'NA' ? ' (по умолчанию)' : ''}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>3 · Отрасль</span>
            <select className="input" value={taxIndustry} onChange={e => setTaxIndustry(e.target.value)}>
              {TAXONOMY.industries.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>4 · Тип</span>
            <select className="input" value={taxType} onChange={e => { setTaxType(e.target.value); setTaxSubtype('all'); }}>
              <option value="all">Все типы</option>
              {TAXONOMY.types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>5 · Подтип</span>
            <select className="input" value={taxSubtype} onChange={e => setTaxSubtype(e.target.value)} disabled={!subtypesForType}>
              <option value="all">{subtypesForType ? 'Все подтипы' : '— выберите тип —'}</option>
              {subtypesForType && subtypesForType.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        </div>

        {activeTags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
            {activeTags.map((t, i) => (
              <span key={i} style={{
                fontSize: 11, fontWeight: 700,
                padding: '4px 10px', borderRadius: 999,
                background: 'var(--pa-red-light)', color: 'var(--pa-red-dark)',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Всего" value={1284} icon="pin" />
        <MetricCard label="Активных" value={1107} accent="green" icon="check" />
        <MetricCard label="На модерации" value={23} accent="gold" icon="clock" pulse />
        <MetricCard label="Отклонённые" value={154} accent="red" icon="x" />
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="filter-pills">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все</button>
            <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Активные</button>
            <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Модерация</button>
            <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>Отклонённые</button>
            <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Черновики</button>
          </div>
          <div className="grow" style={{ position: 'relative', maxWidth: 280 }}>
            <span style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-muted)' }}>
              <window.Ic.search size={16} />
            </span>
            <input className="input" placeholder="Поиск объектов..." style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ width: 40 }}><Checkbox checked={false} onChange={() => {}} /></th>
                <th>Название</th>
                <th>Страна</th>
                <th>Тип</th>
                <th>Партнёр</th>
                <th className="sorted">Рейтинг <span className="sort-ic">▼</span></th>
                <th>Просмотры</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((l) => (
                <tr key={l.id}>
                  <td><Checkbox checked={false} onChange={() => {}} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="thumb" style={{ backgroundImage: `url(${l.cover})` }} />
                      <div>
                        <div className="cell-title">{l.name}</div>
                        <div className="cell-sub">{l.nameEn}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="flag">{window.FLAGS[l.country]}</span> {window.COUNTRY_NAME[l.country]}</td>
                  <td style={{ textTransform: 'capitalize' }}>{l.type === 'hotel' ? 'Отель' : l.type === 'tour' ? 'Тур' : 'Экскурсия'}</td>
                  <td>{l.partnerName}</td>
                  <td>{l.rating > 0 ? <RatingStars value={l.rating} count={l.reviewCount} /> : <span style={{ color: 'var(--color-text-hint)' }}>—</span>}</td>
                  <td>{l.viewCount.toLocaleString('ru-RU')}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>
                    <button className="btn btn-sm btn-ghost" onClick={() => openModeration({ listingName: l.name, cover: l.cover, partner: l.partnerName }, 'view')} style={{ padding: '0 10px' }}>
                      <window.Ic.dots size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/partners ─── */
function AdminPartners() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Партнёры</h1>
          <div className="page-sub">348 партнёров на платформе</div>
        </div>
        <button className="btn btn-primary btn-sm"><window.Ic.plus size={14} /> Пригласить партнёра</button>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Всего" value={348} icon="store" />
        <MetricCard label="Верифицированы" value={302} accent="green" icon="usercheck" />
        <MetricCard label="Ожидают" value={4} accent="gold" icon="clock" pulse />
        <MetricCard label="Приостановлены" value={12} accent="red" icon="x" />
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Компания</th><th>Страна</th><th>Объекты</th><th>Подписка</th><th>Статус</th><th></th>
              </tr>
            </thead>
            <tbody>
              {window.PARTNERS.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div className="avatar av-4" style={{ borderRadius: 10 }}>{p.initials}</div>
                      <div>
                        <div className="cell-title">{p.name}</div>
                        <div className="cell-sub">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="flag">{window.FLAGS[p.country]}</span> {window.COUNTRY_NAME[p.country]}</td>
                  <td><b>{p.objects}</b> объектов</td>
                  <td>
                    <span className="badge badge-verified" style={{ background: p.plan === 'Premium' ? 'var(--pa-gold)' : p.plan === 'Pro' ? 'var(--pa-night)' : 'var(--sand-100)', color: p.plan === 'Basic' ? 'var(--sand-600)' : p.plan === 'Premium' ? 'var(--pa-night)' : 'var(--pa-gold)' }}>
                      {p.plan}
                    </span>
                  </td>
                  <td><StatusBadge status={p.status} withDot /></td>
                  <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/reviews ─── */
function AdminReviews() {
  const [selectedReview, setSel] = useStateAdm(window.REVIEWS[0]);
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Отзывы — модерация</h1>
          <div className="page-sub">7 отзывов на проверке</div>
        </div>
      </div>

      <div className="grid-12">
        <div className="card" style={{ gridColumn: 'span 7', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sec-title" style={{ fontSize: 16 }}>Очередь</div>
            <div className="filter-pills">
              <button className="active">Все <span className="ct">7</span></button>
              <button>AI-флаги <span className="ct">2</span></button>
            </div>
          </div>
          <div>
            {window.REVIEWS.map(r => (
              <div
                key={r.id}
                onClick={() => setSel(r)}
                className={`lead-row ${selectedReview.id === r.id ? 'active' : ''}`}
                style={{ alignItems: 'flex-start' }}
              >
                <div style={{ paddingTop: 2 }}>
                  <RatingStars value={r.rating} />
                </div>
                <div className="lead-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <b style={{ fontSize: 13.5 }}>{r.author}</b>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>· {r.listing}</span>
                    <span style={{ marginLeft: 'auto' }}><AiChip score={r.ai} /></span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.text}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad" style={{ gridColumn: 'span 5' }}>
          <div className="cap" style={{ marginBottom: 10 }}>Детали отзыва</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <RatingStars value={selectedReview.rating} />
              <div className="serif" style={{ fontSize: 18, marginTop: 6 }}>{selectedReview.listing}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span>от {selectedReview.author} · {selectedReview.date}</span>
                {selectedReview.verifiedTrip && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 999,
                    background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <window.Ic.check size={10} /> Поездка подтверждена
                  </span>
                )}
              </div>
            </div>
            <AiChip score={selectedReview.ai} />
          </div>

          {selectedReview.criteria && (
            <div style={{
              marginTop: 14,
              padding: 12,
              background: 'var(--color-surface-mute)',
              borderRadius: 10,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
            }}>
              {[
                { key: 'quality',  label: 'Качество' },
                { key: 'price',    label: 'Цена' },
                { key: 'service',  label: 'Сервис' },
                { key: 'location', label: 'Расположение' },
              ].map(c => (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <span style={{ flex: 1, color: 'var(--color-text-muted)' }}>{c.label}</span>
                  <span style={{ color: 'var(--pa-gold)', letterSpacing: 1 }}>
                    {'★'.repeat(selectedReview.criteria[c.key])}
                    <span style={{ color: 'var(--sand-300)' }}>{'★'.repeat(5 - selectedReview.criteria[c.key])}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: 'var(--color-surface-mute)', borderRadius: 10, padding: 14, marginTop: 14, fontSize: 13.5, lineHeight: 1.55, color: 'var(--color-text)' }}>
            {selectedReview.text}
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="cap" style={{ marginBottom: 6 }}>Ответ от модератора (опционально)</div>
            <textarea className="textarea" placeholder="Шаблон ответа..." />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="btn btn-sm" style={{ background: 'var(--pa-green)', color: 'white' }}><window.Ic.check size={14} /> Одобрить</button>
            <button className="btn btn-sm btn-danger"><window.Ic.x size={14} /> Отклонить</button>
            <button className="btn btn-sm btn-ghost">Спам</button>
            <button className="btn btn-sm btn-gold">Шаблон ответа</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/analytics ─── */
function AdminAnalytics() {
  return (
    <div className="analytics-compact">
      <div className="page-head">
        <div>
          <h1 className="page-title">Аналитика</h1>
          <div className="page-sub">Срез за последние 30 дней</div>
        </div>
        <div className="tabs">
          {['7д', '30д', '90д', 'произв.'].map(p => (
            <button key={p} className={p === '30д' ? 'active' : ''}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 14 }}>
        <MetricCard label="Просмотры" value={<CountUp to={184200} />} delta={{ value: '+24%', direction: 'up' }} accent="green" icon="eye" sparkline={[120, 140, 132, 158, 168, 175, 184]} />
        <MetricCard label="Уник. посетители" value={<CountUp to={42180} />} delta={{ value: '+18%', direction: 'up' }} icon="users" sparkline={[28, 32, 35, 38, 40, 41, 42]} />
        <MetricCard label="Лиды партнёрам" value={<CountUp to={1842} />} delta={{ value: '+12%', direction: 'up' }} accent="gold" icon="inbox" sparkline={[1200, 1320, 1480, 1620, 1720, 1780, 1842]} />
        <MetricCard label="Конверсия" value={<CountUp to={4.4} decimals={1} suffix="%" />} delta={{ value: '+0.6%', direction: 'up' }} accent="red" icon="sparkles" />
      </div>

      <div className="grid-12" style={{ marginBottom: 14 }}>
        <div className="card card-pad" style={{ gridColumn: 'span 8' }}>
          <div className="sec-head">
            <h2 className="sec-title">Трафик по дням</h2>
          </div>
          <AreaChart data={window.TRAFFIC_DATA} h={180} />
        </div>
        <div className="card card-pad" style={{ gridColumn: 'span 4' }}>
          <h2 className="sec-title" style={{ marginBottom: 10 }}>Источники</h2>
          <PieChart data={[
            { label: 'Поиск', value: 8420, color: 'var(--pa-green)' },
            { label: 'Прямые', value: 4180, color: 'var(--pa-gold-mid)' },
            { label: 'Реферал', value: 2640, color: 'var(--pa-red)' },
            { label: 'Соцсети', value: 1820, color: 'var(--pa-night)' },
          ]} size={120} hole={40} />
        </div>
      </div>

      <div className="grid-12">
        <div className="card card-pad" style={{ gridColumn: 'span 6' }}>
          <h2 className="sec-title" style={{ marginBottom: 10 }}>Топ-7 стран</h2>
          <BarChartHoriz data={window.TOP_COUNTRIES} />
        </div>
        <div className="card card-pad" style={{ gridColumn: 'span 6' }}>
          <h2 className="sec-title" style={{ marginBottom: 10 }}>Воронка конверсии</h2>
          <FunnelChart />
        </div>
      </div>
    </div>
  );
}

function FunnelChart() {
  const steps = [
    { label: 'Просмотры', value: 184200, color: 'var(--pa-green)' },
    { label: 'Открытия объекта', value: 42180, color: 'var(--pa-gold-mid)' },
    { label: 'Клики на партнёра', value: 8420, color: 'var(--pa-red)' },
    { label: 'Лиды', value: 1842, color: 'var(--pa-night)' },
  ];
  const max = steps[0].value;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {steps.map((s, i) => {
        const w = (s.value / max) * 100;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}>
              <b>{s.label}</b>
              <span style={{ color: 'var(--color-text-muted)' }}>{s.value.toLocaleString('ru-RU')} · <b style={{ color: 'var(--color-text)' }}>{((s.value / max) * 100).toFixed(1)}%</b></span>
            </div>
            <div style={{ height: 18, background: 'var(--color-border)', opacity: .4, borderRadius: 5, position: 'relative', overflow: 'hidden' }} />
            <div style={{ height: 18, width: `${w}%`, background: s.color, borderRadius: 5, marginTop: -18, animation: `counter-up .8s ease ${i * 0.1}s both` }} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── /admin/settings ─── */
function AdminSettings() {
  const [tab, setTab] = useStateAdm('main');
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Настройки портала</h1>
          <div className="page-sub">Системные параметры AfricaPortal</div>
        </div>
      </div>
      <div className="tabs" style={{ marginBottom: 22 }}>
        {[
          { id: 'main', label: 'Основное' },
          { id: 'seo', label: 'SEO' },
          { id: 'int', label: 'Интеграции' },
          { id: 'notif', label: 'Уведомления' },
          { id: 'danger', label: 'Опасная зона' },
        ].map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="card card-pad" style={{ maxWidth: 720 }}>
        {tab === 'main' && <FormFields fields={[
          { label: 'Название портала', val: 'AfricaPortal' },
          { label: 'Контактный email', val: 'admin@africaportal.travel' },
          { label: 'Язык по умолчанию', val: 'Русский', select: ['Русский', 'English', 'Français'] },
          { label: 'Часовой пояс', val: 'GMT+3 (Москва)' },
        ]} />}
        {tab === 'seo' && <FormFields fields={[
          { label: 'Шаблон meta-title', val: '%name% — %type% в %country% | AfricaPortal' },
          { label: 'Default OG image URL', val: 'https://africaportal.travel/og.jpg' },
        ]} />}
        {tab === 'int' && (
          <div>
            <IntRow name="Google Maps API" status="active" />
            <IntRow name="Meilisearch (поиск)" status="active" />
            <IntRow name="TripAdvisor sync" status="pending" />
            <IntRow name="Sendgrid (email)" status="active" />
            <IntRow name="Stripe (платежи)" status="active" />
          </div>
        )}
        {tab === 'notif' && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 13.5 }}>
            Email-шаблоны и вебхуки можно настроить здесь. (3 шаблона активно, 2 webhook'a настроено)
          </div>
        )}
        {tab === 'danger' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DangerRow title="Очистить кэш" sub="Сбросит весь сайтовый кэш — может занять до 5 минут" cta="Очистить" />
            <DangerRow title="Экспорт всех данных" sub="ZIP-архив всех таблиц БД в формате JSON" cta="Экспорт" />
            <DangerRow title="Режим обслуживания" sub="Покажет всем посетителям заглушку. Админы продолжат работу." cta="Включить" red />
          </div>
        )}
      </div>
    </>
  );
}

function FormFields({ fields }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {fields.map((f, i) => (
        <label key={i}>
          <div className="cap" style={{ marginBottom: 6 }}>{f.label}</div>
          {f.select ? (
            <select className="select" defaultValue={f.val}>
              {f.select.map(o => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input className="input" defaultValue={f.val} />
          )}
        </label>
      ))}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary">Сохранить</button>
        <button className="btn btn-ghost">Отмена</button>
      </div>
    </div>
  );
}

function IntRow({ name, status }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{status === 'active' ? 'Подключено' : 'Требуется настройка'}</div>
      </div>
      <StatusBadge status={status} withDot />
    </div>
  );
}

function DangerRow({ title, sub, cta, red }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 14, borderRadius: 10, border: `1px solid ${red ? 'var(--pa-red)' : 'var(--color-border)'}` }}>
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{sub}</div>
      </div>
      <button className={red ? 'btn btn-danger' : 'btn btn-ghost'}>{cta}</button>
    </div>
  );
}

/* ─── Generic stub page for less-detailed admin sections ─── */
function AdminStub({ title, sub, icon = 'sparkles' }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">{title}</h1>
          <div className="page-sub">{sub}</div>
        </div>
      </div>
      <div className="card">
        <EmptyState
          icon={icon}
          title="Раздел в разработке"
          sub="Этот экран — часть полной структуры портала. Основной фокус прототипа — дашборды и модерация."
          action={<button className="btn btn-secondary">Запросить доступ к фиче</button>}
        />
      </div>
    </>
  );
}

/* ─── /admin/map ─── ТЗ Лист 3, Модуль карты (GIS).
   Реализация на Leaflet 1.9 + markercluster.
   Тайлы — OpenStreetMap. Источник пинов — window.MAP_POIS. */
const LAYER_DEFS = [
  { id: 'lodging', label: 'Объекты размещения', color: '#D32F2F' },
  { id: 'parks',   label: 'Природные парки',    color: '#2E7D32' },
  { id: 'routes',  label: 'Маршруты',           color: '#F5C842' },
  { id: 'roads',   label: 'Основные дороги',    color: '#6B5B3F' },
  { id: 'poi',     label: 'POI (достопримеч.)', color: '#1A0A00' },
];

function AdminMap() {
  const [layers, setLayers] = useStateAdm({ lodging: true, parks: true, routes: true, roads: false, poi: true });
  const [radius, setRadius] = useStateAdm(100);
  const [centerLabel, setCenterLabel] = useStateAdm('Виндхук, Намибия');
  const [pointA, setPointA] = useStateAdm('Виндхук');
  const [pointB, setPointB] = useStateAdm('Этоша');
  const [stats, setStats] = useStateAdm({ visible: 0, inRadius: null });

  const mapRef = React.useRef(null);
  const mapEl  = React.useRef(null);
  const clustersRef = React.useRef({});   // { lodging: ClusterGroup, ... }
  const radiusRef   = React.useRef(null); // L.circle
  const routeRef    = React.useRef(null); // L.polyline
  const centerRef   = React.useRef([-22.560, 17.083]); // Виндхук

  const toggle = (k) => setLayers(prev => ({ ...prev, [k]: !prev[k] }));

  /* Инициализация карты — один раз */
  React.useEffect(() => {
    if (mapRef.current || !mapEl.current || typeof L === 'undefined') return;

    const map = L.map(mapEl.current, { zoomControl: true, scrollWheelZoom: true })
      .setView([-22.5, 17.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    /* Кластеры на слой */
    LAYER_DEFS.forEach(def => {
      const cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (c) => L.divIcon({
          html: `<div style="
            background:${def.color};color:white;
            width:36px;height:36px;border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-weight:700;border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,.25);">${c.getChildCount()}</div>`,
          className: 'pa-cluster',
          iconSize: [36, 36],
        }),
      });

      window.MAP_POIS.filter(p => p.layer === def.id).forEach(p => {
        const m = L.circleMarker([p.lat, p.lng], {
          radius: 7, color: def.color, fillColor: def.color,
          weight: 2, fillOpacity: 0.85,
        }).bindPopup(`
          <b>${p.name}</b><br/>
          <span style="color:#666;font-size:12px">${p.info}</span><br/>
          <span style="color:${def.color};font-size:11px;font-weight:600">${def.label}</span>
        `);
        cluster.addLayer(m);
      });

      clustersRef.current[def.id] = cluster;
      if (layers[def.id]) map.addLayer(cluster);
    });

    mapRef.current = map;
    updateStats();

    return () => {
      map.remove();
      mapRef.current = null;
      clustersRef.current = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Переключение видимости слоёв */
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    LAYER_DEFS.forEach(def => {
      const cluster = clustersRef.current[def.id];
      if (!cluster) return;
      if (layers[def.id]) {
        if (!map.hasLayer(cluster)) map.addLayer(cluster);
      } else {
        if (map.hasLayer(cluster)) map.removeLayer(cluster);
      }
    });
    updateStats();
  }, [layers]);

  function updateStats() {
    let visible = 0;
    LAYER_DEFS.forEach(def => {
      if (layers[def.id]) {
        visible += window.MAP_POIS.filter(p => p.layer === def.id).length;
      }
    });
    setStats(s => ({ ...s, visible }));
  }

  /* Поиск в радиусе — рисуем круг и считаем попавшие точки */
  function findInRadius() {
    const map = mapRef.current;
    if (!map) return;
    if (radiusRef.current) map.removeLayer(radiusRef.current);
    const c = centerRef.current;
    radiusRef.current = L.circle(c, {
      radius: radius * 1000, color: '#D32F2F', fillColor: '#D32F2F', fillOpacity: 0.08, weight: 2,
    }).addTo(map);
    map.fitBounds(radiusRef.current.getBounds(), { padding: [30, 30] });

    const inside = window.MAP_POIS.filter(p => layers[p.layer]
      && map.distance(c, [p.lat, p.lng]) <= radius * 1000).length;
    setStats(s => ({ ...s, inRadius: inside }));
  }

  /* Маршрут A → B (геокод через Nominatim) */
  async function buildRoute() {
    const map = mapRef.current;
    if (!map) return;
    try {
      const geocode = async (q) => {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Namibia')}&limit=1`);
        const j = await r.json();
        if (!j[0]) throw new Error('Не найдено: ' + q);
        return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
      };
      const [a, b] = await Promise.all([geocode(pointA), geocode(pointB)]);
      if (routeRef.current) map.removeLayer(routeRef.current);
      routeRef.current = L.polyline([a, b], {
        color: '#F5C842', weight: 5, dashArray: '8,8',
      }).addTo(map);
      L.marker(a).addTo(routeRef.current).bindPopup(`<b>A:</b> ${pointA}`).openPopup();
      L.marker(b).addTo(routeRef.current).bindPopup(`<b>B:</b> ${pointB}`);
      map.fitBounds(routeRef.current.getBounds(), { padding: [40, 40] });
    } catch (e) {
      alert('Не удалось построить маршрут: ' + e.message);
    }
  }

  /* «Мои координаты» — браузерный GPS */
  function locateMe() {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) {
      alert('GPS недоступен в этом браузере');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = [pos.coords.latitude, pos.coords.longitude];
        centerRef.current = c;
        setCenterLabel(`Моя позиция (${c[0].toFixed(3)}, ${c[1].toFixed(3)})`);
        map.setView(c, 9);
        L.marker(c).addTo(map).bindPopup('Вы здесь').openPopup();
      },
      () => alert('Не удалось получить координаты'),
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Карта Намибии (GIS)</h1>
          <div className="page-sub">Leaflet · кластеризация · слои · поиск в радиусе · маршрут A→B · GPS</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={locateMe}>
            <window.Ic.pin size={14} /> Моя GPS-точка
          </button>
          <button className="btn btn-secondary" onClick={() => {
            const geo = { type: 'FeatureCollection', features: window.MAP_POIS.filter(p => layers[p.layer]).map(p => ({
              type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
              properties: { name: p.name, layer: p.layer, info: p.info },
            })) };
            const blob = new Blob([JSON.stringify(geo, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'africa-portal-pois.geojson';
            a.click();
          }}>
            <window.Ic.download size={16} /> Экспорт GeoJSON
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, minHeight: 580 }}>
        {/* Левая панель */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <div className="cap" style={{ marginBottom: 10 }}>Слои карты</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LAYER_DEFS.map(l => {
                const count = window.MAP_POIS.filter(p => p.layer === l.id).length;
                return (
                  <label key={l.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: 8, borderRadius: 8,
                    background: layers[l.id] ? 'var(--color-surface-mute)' : 'transparent',
                    cursor: 'pointer',
                  }}>
                    <input type="checkbox" checked={layers[l.id]} onChange={() => toggle(l.id)} style={{ accentColor: l.color }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13 }}>{l.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{count}</span>
                  </label>
                );
              })}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--color-text-muted)' }}>
              Видно сейчас: <b style={{ color: 'var(--color-text)' }}>{stats.visible}</b>
            </div>
          </div>

          <div className="card card-pad">
            <div className="cap" style={{ marginBottom: 10 }}>Поиск в радиусе</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <label>
                <div style={{ marginBottom: 4, color: 'var(--color-text-muted)' }}>Центр</div>
                <input className="input" value={centerLabel} onChange={e => setCenterLabel(e.target.value)} />
              </label>
              <label>
                <div style={{ marginBottom: 4, color: 'var(--color-text-muted)' }}>
                  Радиус: <b>{radius} км</b>
                </div>
                <input type="range" min="10" max="500" value={radius} onChange={e => setRadius(+e.target.value)} style={{ width: '100%' }} />
              </label>
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 4 }} onClick={findInRadius}>
                Найти объекты
              </button>
              {stats.inRadius != null && (
                <div style={{ fontSize: 12, color: 'var(--pa-green-dark)', fontWeight: 600 }}>
                  Найдено в радиусе: {stats.inRadius}
                </div>
              )}
            </div>
          </div>

          <div className="card card-pad">
            <div className="cap" style={{ marginBottom: 10 }}>Маршрут A → B</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <input className="input" value={pointA} onChange={e => setPointA(e.target.value)} placeholder="A — например, Виндхук" />
              <input className="input" value={pointB} onChange={e => setPointB(e.target.value)} placeholder="B — например, Этоша" />
              <button className="btn btn-ghost btn-sm" onClick={buildRoute}>
                <window.Ic.arrowright size={14} /> Построить
              </button>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                Геокодинг через Nominatim (OSM). Прямая линия.
              </div>
            </div>
          </div>

          <div style={{
            padding: 12, borderRadius: 10,
            background: 'var(--pa-green-light)',
            fontSize: 12, lineHeight: 1.5, color: 'var(--pa-green-dark)',
          }}>
            <b>Готово:</b> кластеризация, слои, радиус, маршруты,
            браузерный GPS, экспорт GeoJSON. Тайлы — OpenStreetMap.
          </div>
        </div>

        {/* Карта Leaflet */}
        <div ref={mapEl} style={{
          minHeight: 580, height: '100%',
          borderRadius: 12, overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }} />
      </div>
    </>
  );
}

/* ─── /admin/blog ─── ТЗ #Blog */
function AdminBlog() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Блог и новости</h1>
          <div className="page-sub">Управление статьями, гидами и репортажами портала</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.plus size={16} /> Новая статья</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Опубликовано" value={142} accent="green" icon="check" />
        <MetricCard label="На модерации" value={3} accent="gold" icon="clock" pulse />
        <MetricCard label="Черновики" value={18} icon="document" />
        <MetricCard label="Просмотров / мес" value="48 ‹k" accent="red" icon="eye" />
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Категория</th>
                <th>Автор</th>
                <th>Дата</th>
                <th>Просмотры</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {window.BLOG_POSTS.map(p => (
                <tr key={p.id}>
                  <td><div className="cell-title">{p.title}</div></td>
                  <td><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--pa-red)' }}>{p.cat}</span></td>
                  <td>{p.author}</td>
                  <td>{p.date}</td>
                  <td>{p.views.toLocaleString('ru-RU')}</td>
                  <td><StatusBadge status={p.status === 'published' ? 'active' : p.status === 'review' ? 'pending' : 'draft'} label={p.status === 'published' ? 'Опубликовано' : p.status === 'review' ? 'На модерации' : 'Черновик'} /></td>
                  <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/ministries ─── ТЗ #Authorities */
function AdminMinistries() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Профильные министерства</h1>
          <div className="page-sub">Контакты министерств туризма в странах Африки</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.plus size={16} /> Добавить контакт</button>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Страна</th>
                <th>Министерство</th>
                <th>Отрасль</th>
                <th>Сайт</th>
                <th>Контакт</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {window.MINISTRIES.map(m => (
                <tr key={m.id}>
                  <td><span className="flag">{window.FLAGS[m.country]}</span> {window.COUNTRY_NAME[m.country]}</td>
                  <td><div className="cell-title">{m.name}</div></td>
                  <td>{m.industry}</td>
                  <td><a href="#" style={{ color: 'var(--pa-red)' }}>{m.site}</a></td>
                  <td>{m.contact}</td>
                  <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/embassies ─── ТЗ #Embassy */
function AdminEmbassies() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Посольства и дип.миссии</h1>
          <div className="page-sub">Представительства России в странах Африки</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.plus size={16} /> Добавить</button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {window.EMBASSIES.map(e => (
          <div key={e.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{window.FLAGS[e.country]}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{window.COUNTRY_NAME[e.country]}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{e.city}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, marginTop: 6 }}>
              <div><b>{e.type}</b></div>
              <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>📞 {e.contact}</div>
              <div style={{ color: 'var(--color-text-muted)' }}>✉️ {e.email}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── /admin/holidays ─── ТЗ #Calendar */
function AdminHolidays() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Календарь праздников</h1>
          <div className="page-sub">Национальные, религиозные и местные праздники по странам</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.plus size={16} /> Добавить</button>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Страна</th>
                <th>Праздник</th>
                <th>Тип</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {window.HOLIDAYS.map(h => (
                <tr key={h.id}>
                  <td><b>{h.date}</b></td>
                  <td><span className="flag">{window.FLAGS[h.country]}</span> {window.COUNTRY_NAME[h.country]}</td>
                  <td><div className="cell-title">{h.name}</div></td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '3px 10px', borderRadius: 999,
                      background: h.type === 'Религиозный' ? 'var(--pa-gold-light)' : 'var(--pa-green-light)',
                      color: h.type === 'Религиозный' ? 'var(--pa-gold-mid)' : 'var(--pa-green-dark)',
                    }}>{h.type}</span>
                  </td>
                  <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/profile ─── Профиль администратора.
   ТЗ Лист 3: личные данные + 2FA + журнал активности + права + API-ключи. */
function AdminProfile() {
  const [tab, setTab] = useStateAdm('personal');
  const [twoFa, setTwoFa] = useStateAdm(true);
  const [copied, setCopied] = useStateAdm(false);

  const copyKey = () => {
    navigator.clipboard && navigator.clipboard.writeText('AP_LIVE_sk_8e2a4f...c9b1');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const ACTIVITY = [
    { t: '25.05.2026, 09:14', a: 'Вход',                ip: '46.18.224.12 · Москва',     icon: 'check' },
    { t: '25.05.2026, 08:42', a: 'Изменён тариф объекта',ip: 'Объект #421 · Этоша Лодж',  icon: 'pencil' },
    { t: '24.05.2026, 22:48', a: 'Одобрена модерация',  ip: '4 объекта',                  icon: 'check' },
    { t: '24.05.2026, 18:15', a: 'Отклонён лид',         ip: 'Лид #L-1942',                icon: 'x' },
    { t: '24.05.2026, 14:20', a: 'Изменены права',       ip: 'Пользователь Hans Müller',  icon: 'shield' },
    { t: '23.05.2026, 11:00', a: 'Экспорт CSV',          ip: 'Подписчики (7 строк)',       icon: 'download' },
  ];

  const PERMS = [
    { id: 'mod_objects',  label: 'Модерация объектов',    granted: true },
    { id: 'mod_reviews',  label: 'Модерация отзывов',     granted: true },
    { id: 'verify_part',  label: 'Верификация партнёров', granted: true },
    { id: 'manage_users', label: 'Управление пользователями', granted: true },
    { id: 'manage_subs',  label: 'Управление подписками',  granted: true },
    { id: 'manage_ads',   label: 'Управление рекламой',    granted: true },
    { id: 'manage_intg',  label: 'Настройка интеграций',   granted: true },
    { id: 'super_admin',  label: 'Полный root-доступ',     granted: true, danger: true },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Мой профиль</h1>
          <div className="page-sub">Личные настройки администратора AfricaPortal</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost"><window.Ic.logout size={16} /> Выйти из всех сессий</button>
          <button className="btn btn-primary"><window.Ic.check size={16} /> Сохранить</button>
        </div>
      </div>

      {/* Шапка профиля */}
      <div className="card card-pad" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <Avatar name="Айкуй Мунги" size="lg" />
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            Айкуй Мунги
            <span style={{ background: 'var(--pa-red)', color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>SUPERADMIN</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            <window.Ic.mail size={12} /> admin@africaportal.com · <window.Ic.phone size={12} /> +264 (61) 240-555
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
            🇳🇦 Виндхук, Намибия · в системе с 12.08.2024 · {ACTIVITY.length}+ действий за неделю
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-green)' }}>1 284</div>
            <div className="cap" style={{ fontSize: 10 }}>Модерации</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--pa-gold-mid)' }}>92%</div>
            <div className="cap" style={{ fontSize: 10 }}>Aprrove rate</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>14ч</div>
            <div className="cap" style={{ fontSize: 10 }}>Среднее время</div>
          </div>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={tab === 'personal' ? 'active' : ''} onClick={() => setTab('personal')}>
          <window.Ic.user size={13} /> Личные данные
        </button>
        <button className={tab === 'security' ? 'active' : ''} onClick={() => setTab('security')}>
          <window.Ic.shield size={13} /> Безопасность и 2FA
        </button>
        <button className={tab === 'permissions' ? 'active' : ''} onClick={() => setTab('permissions')}>
          <window.Ic.key size={13} /> Права
        </button>
        <button className={tab === 'api' ? 'active' : ''} onClick={() => setTab('api')}>
          <window.Ic.plug size={13} /> API-ключи
        </button>
        <button className={tab === 'activity' ? 'active' : ''} onClick={() => setTab('activity')}>
          <window.Ic.clock size={13} /> Журнал активности
        </button>
      </div>

      {tab === 'personal' && (
        <div className="card card-pad">
          <h3 className="sec-title" style={{ marginBottom: 14 }}>Личные данные</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Фамилия и имя</div>
              <input className="input" defaultValue="Мунги, Айкуй" />
            </div>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Должность</div>
              <input className="input" defaultValue="Главный администратор" />
            </div>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Email (для входа)</div>
              <input className="input" defaultValue="admin@africaportal.com" />
            </div>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Телефон</div>
              <input className="input" defaultValue="+264 (61) 240-555" />
            </div>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Страна</div>
              <input className="input" defaultValue="Намибия" />
            </div>
            <div>
              <div className="cap" style={{ marginBottom: 4 }}>Город</div>
              <input className="input" defaultValue="Виндхук" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="cap" style={{ marginBottom: 4 }}>О себе</div>
              <textarea className="textarea" rows={3} defaultValue="Главный администратор AfricaPortal с 2024 года. Отвечаю за модерацию объектов, верификацию партнёров и стратегию развития платформы." />
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card card-pad">
          <h3 className="sec-title" style={{ marginBottom: 14 }}>Безопасность</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--color-surface-mute)', borderRadius: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Двухфакторная аутентификация (2FA)</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {twoFa ? 'Включена — Google Authenticator (последний код: ●●● ●●●)' : 'Отключена — настройте 2FA для безопасности'}
                </div>
              </div>
              <button
                className={twoFa ? 'btn btn-secondary' : 'btn btn-primary'}
                onClick={() => setTwoFa(!twoFa)}
              >
                {twoFa ? 'Отключить' : 'Включить'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--color-surface-mute)', borderRadius: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Сменить пароль</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Последняя смена: 03.04.2026 · через 23 дня будет напоминание
                </div>
              </div>
              <button className="btn btn-secondary"><window.Ic.lock size={14} /> Сменить</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'var(--color-surface-mute)', borderRadius: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Активные сессии</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  3 устройства: Chrome (Windows) · Safari (macOS) · Mobile (iOS)
                </div>
              </div>
              <button className="btn btn-ghost">Управлять</button>
            </div>

            <div style={{
              padding: 14, background: 'var(--pa-red-light)', borderRadius: 10,
              borderLeft: '3px solid var(--pa-red)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pa-red)' }}>Выйти из всех сессий</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Принудительно завершит все активные сеансы на других устройствах
                  </div>
                </div>
                <button className="btn btn-danger">Выйти везде</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'permissions' && (
        <div className="card card-pad">
          <h3 className="sec-title" style={{ marginBottom: 6 }}>Права доступа</h3>
          <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 14 }}>
            У роли SUPERADMIN полный доступ ко всем модулям. Управление правами других ролей — в разделе "Все юзеры".
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PERMS.map(p => (
              <div key={p.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 8,
                background: p.danger ? 'var(--pa-red-light)' : 'var(--color-surface-mute)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: p.granted ? 'var(--pa-green)' : 'var(--color-text-muted)' }}>
                    {p.granted ? '✓' : '○'}
                  </span>
                  <span style={{ fontWeight: p.danger ? 700 : 500, color: p.danger ? 'var(--pa-red)' : 'inherit' }}>
                    {p.label}
                  </span>
                </div>
                {p.granted && (
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: p.danger ? 'var(--pa-red)' : 'var(--pa-green)', color: 'white', fontWeight: 700 }}>
                    GRANTED
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'api' && (
        <div className="card card-pad">
          <h3 className="sec-title" style={{ marginBottom: 14 }}>API-ключи</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 14, background: 'var(--color-surface-mute)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Live API key (production)</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Создан 12.08.2024 · последний раз использован сегодня</div>
                </div>
                <span style={{ background: 'var(--pa-green)', color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>ACTIVE</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <code style={{
                  flex: 1, padding: '8px 12px', background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)', borderRadius: 6,
                  fontFamily: 'SFMono-Regular, Consolas, monospace', fontSize: 12,
                }}>AP_LIVE_sk_8e2a4f...c9b1</code>
                <button className="btn btn-secondary" onClick={copyKey}>
                  <window.Ic.copy size={14} /> {copied ? 'Скопировано!' : 'Копировать'}
                </button>
              </div>
            </div>
            <div style={{ padding: 14, background: 'var(--color-surface-mute)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Test API key (sandbox)</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Для интеграций без записи в продакшен</div>
                </div>
                <span style={{ background: 'var(--pa-gold-mid)', color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>TEST</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <code style={{
                  flex: 1, padding: '8px 12px', background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)', borderRadius: 6,
                  fontFamily: 'SFMono-Regular, Consolas, monospace', fontSize: 12,
                }}>AP_TEST_sk_a02f1c...e6d3</code>
                <button className="btn btn-secondary">
                  <window.Ic.copy size={14} /> Копировать
                </button>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <window.Ic.plus size={14} /> Создать новый ключ
            </button>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card card-pad">
          <h3 className="sec-title" style={{ marginBottom: 14 }}>Журнал активности</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ACTIVITY.map((e, i) => {
              const EIc = window.Ic[e.icon] || window.Ic.info;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 10, borderBottom: '1px dashed var(--color-border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--pa-green-light)', color: 'var(--pa-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <EIc size={15} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{e.a}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{e.ip}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>{e.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── /admin/integrations ─── Sync с Google Reviews / TripAdvisor / Booking / соцсети.
   ТЗ Лист 3: интеграции с внешними порталами. */
function AdminIntegrations() {
  const [syncingId, setSyncingId] = useStateAdm(null);
  const [progress, setProgress]   = useStateAdm(0);
  const [items, setItems]         = useStateAdm(window.INTEGRATIONS);

  useEffectAdm(() => {
    if (!syncingId) return;
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          const now = new Date();
          const stamp = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          setItems(prev => prev.map(it => it.id === syncingId ? {
            ...it,
            lastSync: stamp,
            stats: { ...it.stats, imported: it.stats.imported + Math.floor(Math.random() * 30 + 5) },
          } : it));
          setSyncingId(null);
          return 0;
        }
        return p + 8;
      });
    }, 120);
    return () => clearInterval(t);
  }, [syncingId]);

  const toggleConnect = (id) => {
    setItems(prev => prev.map(it => it.id === id ? {
      ...it,
      status: it.status === 'connected' ? 'disconnected' : 'connected',
    } : it));
  };

  const startSync = (id) => {
    setProgress(0);
    setSyncingId(id);
  };

  const STAT_CFG = {
    connected:    { label: 'Подключено',  color: 'var(--pa-green)',     bg: 'var(--pa-green-light)' },
    pending:      { label: 'Ожидает ключа', color: 'var(--pa-gold-mid)', bg: 'var(--pa-gold-light)' },
    disconnected: { label: 'Отключено',    color: 'var(--color-text-muted)', bg: 'var(--color-surface-mute)' },
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Интеграции</h1>
          <div className="page-sub">
            Синхронизация с внешними порталами: отзывы, объекты, соцсети
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <window.Ic.plus size={16} /> Подключить новую
          </button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Подключено" value={items.filter(i => i.status === 'connected').length}
          delta={null} accent="green" icon="plug" />
        <MetricCard label="Импортировано" value={<CountUp to={items.reduce((s, i) => s + i.stats.imported, 0)} />}
          delta={{ value: '+184', direction: 'up' }} accent="gold" icon="download" />
        <MetricCard label="Ошибки за сутки" value={items.reduce((s, i) => s + i.stats.errors, 0)}
          delta={null} accent="red" icon="info" />
        <MetricCard label="Среднее качество" value={<CountUp to={4.65} decimals={2} />}
          delta={{ value: '+0.08', direction: 'up' }} icon="star" />
      </div>

      <div className="grid-12">
        {items.map(it => {
          const cfg = STAT_CFG[it.status];
          const isSyncing = syncingId === it.id;
          return (
            <div key={it.id} className="card card-pad" style={{ gridColumn: 'span 6' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                  background: it.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 18, letterSpacing: -0.5,
                }}>{it.glyph}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{it.name}</div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                      background: cfg.bg, color: cfg.color,
                    }}>{cfg.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {it.category} · Последний синк: {it.lastSync}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                    {it.desc}
                  </div>
                </div>
              </div>

              {/* Прогресс синка */}
              {isSyncing && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      <window.Ic.refresh size={11} /> Синхронизация...
                    </span>
                    <b>{progress}%</b>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: it.color, transition: 'width .12s' }} />
                  </div>
                </div>
              )}

              {/* Статистика */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                padding: 10, background: 'var(--color-surface-mute)', borderRadius: 8,
                marginBottom: 12,
              }}>
                <div>
                  <div className="cap" style={{ fontSize: 10 }}>Импортировано</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{it.stats.imported.toLocaleString('ru-RU')}</div>
                </div>
                <div>
                  <div className="cap" style={{ fontSize: 10 }}>Ошибки</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: it.stats.errors > 0 ? 'var(--pa-red)' : 'inherit' }}>
                    {it.stats.errors}
                  </div>
                </div>
                <div>
                  <div className="cap" style={{ fontSize: 10 }}>Рейтинг</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--pa-gold-mid)' }}>
                    {it.stats.rate ? `${it.stats.rate} ★` : '—'}
                  </div>
                </div>
              </div>

              {/* Кнопки */}
              <div style={{ display: 'flex', gap: 8 }}>
                {it.status === 'connected' ? (
                  <>
                    <button
                      className="btn btn-secondary"
                      disabled={isSyncing}
                      onClick={() => startSync(it.id)}
                      style={{ flex: 1 }}
                    >
                      <window.Ic.refresh size={14} />
                      {isSyncing ? 'Синхронизация...' : 'Синхронизировать'}
                    </button>
                    <button className="btn btn-ghost" onClick={() => toggleConnect(it.id)}>
                      Отключить
                    </button>
                  </>
                ) : it.status === 'pending' ? (
                  <button className="btn" style={{ flex: 1, background: 'var(--pa-gold-mid)', color: 'white' }}>
                    <window.Ic.settings size={14} /> Завершить настройку
                  </button>
                ) : (
                  <button
                    className="btn"
                    style={{ flex: 1, background: it.color, color: 'white' }}
                    onClick={() => toggleConnect(it.id)}
                  >
                    <window.Ic.plug size={14} /> Подключить {it.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── /admin/users ─── ТЗ: пользователи и роли */
function AdminUsers() {
  const [tab, setTab] = useStateAdm('all');
  const filtered = tab === 'all'
    ? window.PORTAL_USERS
    : window.PORTAL_USERS.filter(u => u.role === tab);

  const ROLE_BADGE = {
    superadmin: { label: 'SUPERADMIN', color: 'var(--pa-red)' },
    admin:      { label: 'Админ',       color: 'var(--pa-gold-mid)' },
    editor:     { label: 'Редактор',    color: 'var(--pa-green)' },
    partner:    { label: 'Партнёр',     color: 'var(--pa-night)' },
    user:       { label: 'Турист',      color: '#6b7280' },
  };
  const STATUS_BADGE = {
    active:  { label: 'Активен',     color: 'var(--pa-green)',     bg: 'var(--pa-green-light)' },
    pending: { label: 'Ожидает',     color: 'var(--pa-gold-mid)',  bg: 'var(--pa-gold-light)' },
    blocked: { label: 'Заблокирован', color: 'var(--pa-red)',       bg: 'var(--pa-red-light)' },
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Пользователи и роли</h1>
          <div className="page-sub">{window.PORTAL_USERS.length} аккаунтов в системе</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.download size={16} /> Экспорт CSV</button>
          <button className="btn btn-primary"><window.Ic.plus size={16} /> Добавить</button>
        </div>
      </div>

      {/* Роли — сводка */}
      <div className="grid-12" style={{ marginBottom: 22 }}>
        {window.ROLE_DEFS.map(r => (
          <div key={r.id} className="card card-pad" style={{
            gridColumn: 'span 2', cursor: 'pointer',
            borderLeft: `3px solid ${r.color}`,
          }} onClick={() => setTab(r.id)}>
            <div className="cap" style={{ fontSize: 10, color: r.color }}>{r.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{r.count.toLocaleString('ru-RU')}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, lineHeight: 1.3 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>Все ({window.PORTAL_USERS.length})</button>
        {window.ROLE_DEFS.map(r => (
          <button key={r.id} className={tab === r.id ? 'active' : ''} onClick={() => setTab(r.id)}>
            {r.label} ({window.PORTAL_USERS.filter(u => u.role === r.id).length})
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Страна</th>
                <th>Регистрация</th>
                <th>Последний вход</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rb = ROLE_BADGE[u.role];
                const sb = STATUS_BADGE[u.status];
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={u.name} size="sm" />
                        <div className="cell-title">{u.name}</div>
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--color-text-muted)', fontSize: 12.5 }}>{u.email}</span></td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 999,
                        background: rb.color + '20', color: rb.color,
                      }}>{rb.label}</span>
                    </td>
                    <td><span className="flag">{window.FLAGS[u.country] || '🌍'}</span> {u.country}</td>
                    <td><span style={{ fontSize: 12.5 }}>{u.joined}</span></td>
                    <td><span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{u.lastLogin}</span></td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 999,
                        background: sb.bg, color: sb.color,
                      }}>{sb.label}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}>
                        <window.Ic.dots size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/subs ─── ТЗ: тарифы и платежи партнёров */
function AdminSubsPage() {
  const PLAN_BADGE = {
    Premium:  { color: 'var(--pa-gold-mid)', bg: 'var(--pa-gold-light)' },
    Pro:      { color: 'var(--pa-green)',     bg: 'var(--pa-green-light)' },
    Standard: { color: 'var(--pa-night)',     bg: 'var(--color-surface-mute)' },
    Free:     { color: 'var(--color-text-muted)', bg: 'var(--color-surface-mute)' },
  };
  const STATUS = {
    active:    { label: 'Активна',   color: 'var(--pa-green)' },
    overdue:   { label: 'Просрочка', color: 'var(--pa-red)' },
    cancelled: { label: 'Отменена',  color: 'var(--color-text-muted)' },
    free:      { label: 'Free-тариф', color: 'var(--color-text-muted)' },
  };
  const totalMRR  = window.SUBSCRIPTIONS_LIST.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
  const overdue    = window.SUBSCRIPTIONS_LIST.filter(s => s.status === 'overdue').length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Подписки партнёров</h1>
          <div className="page-sub">Тарифные планы, платежи и просрочки</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="MRR (месячная выручка)" value={<CountUp to={totalMRR} prefix="$" />} delta={{ value: '+12%', direction: 'up' }} accent="green" icon="card" />
        <MetricCard label="Активных подписок" value={window.SUBSCRIPTIONS_LIST.filter(s => s.status === 'active').length} delta={{ value: '+3', direction: 'up' }} icon="usercheck" />
        <MetricCard label="Просрочек" value={overdue} delta={{ value: '0', direction: 'neutral' }} accent="red" icon="info" />
        <MetricCard label="Конверсия Free→Pro" value={<CountUp to={18.4} decimals={1} suffix="%" />} delta={{ value: '+1.2%', direction: 'up' }} accent="gold" icon="sparkles" />
      </div>

      {/* Тарифы — сводка */}
      <div className="card card-pad" style={{ marginBottom: 22 }}>
        <div className="sec-head">
          <h2 className="sec-title">Тарифные планы</h2>
        </div>
        <div className="grid-4">
          {window.SUBSCRIPTION_PLANS && window.SUBSCRIPTION_PLANS.map((p, i) => (
            <div key={i} className="card card-pad" style={{ borderTop: `3px solid var(--pa-${i === 2 ? 'gold' : i === 1 ? 'green' : 'red'})` }}>
              <div className="cap">{p.name || `Тариф ${i + 1}`}</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>${p.price || (i * 100)}/мес</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{p.features || 'Базовые возможности'}</div>
            </div>
          ))}
          {!window.SUBSCRIPTION_PLANS && (
            <>
              <div className="card card-pad" style={{ borderTop: '3px solid var(--pa-night)' }}>
                <div className="cap">Free</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>$0</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>1 объект · базовые отзывы</div>
              </div>
              <div className="card card-pad" style={{ borderTop: '3px solid var(--pa-red)' }}>
                <div className="cap">Standard</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>$89</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>До 5 объектов · аналитика</div>
              </div>
              <div className="card card-pad" style={{ borderTop: '3px solid var(--pa-green)' }}>
                <div className="cap">Pro</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>$199</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>Безлимит объектов · приоритет</div>
              </div>
              <div className="card card-pad" style={{ borderTop: '3px solid var(--pa-gold)' }}>
                <div className="cap">Premium</div>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>$499</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>Featured + персональный менеджер</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Платежи */}
      <div className="card card-pad">
        <div className="sec-head">
          <h2 className="sec-title">Платежи и подписчики</h2>
          <button className="btn btn-sm btn-ghost"><window.Ic.download size={14} /> CSV</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Партнёр</th>
                <th>Страна</th>
                <th>Тариф</th>
                <th>Сумма / мес</th>
                <th>Следующий счёт</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {window.SUBSCRIPTIONS_LIST.map(s => {
                const pb = PLAN_BADGE[s.plan];
                const st = STATUS[s.status];
                return (
                  <tr key={s.id}>
                    <td><div className="cell-title">{s.partner}</div></td>
                    <td><span className="flag">{window.FLAGS[s.country]}</span></td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 999,
                        background: pb.bg, color: pb.color,
                      }}>{s.plan}</span>
                    </td>
                    <td><b>${s.amount}</b></td>
                    <td><span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{s.nextBill}</span></td>
                    <td><span style={{ color: st.color, fontWeight: 600, fontSize: 12 }}>● {st.label}</span></td>
                    <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /admin/ads ─── ТЗ: реклама и баннеры */
function AdminAdsPage() {
  const STATUS = {
    active:   { label: 'Идёт',          color: 'var(--pa-green)',     bg: 'var(--pa-green-light)' },
    pending:  { label: 'На модерации',  color: 'var(--pa-gold-mid)',  bg: 'var(--pa-gold-light)' },
    paused:   { label: 'Пауза',          color: 'var(--color-text-muted)', bg: 'var(--color-surface-mute)' },
    rejected: { label: 'Отклонена',      color: 'var(--pa-red)',       bg: 'var(--pa-red-light)' },
  };
  const totalBudget = window.ADS_LIST.reduce((s, a) => s + a.budget, 0);
  const totalClicks = window.ADS_LIST.reduce((s, a) => s + a.clicks, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Рекламные кампании</h1>
          <div className="page-sub">Баннеры партнёров, спонсорские размещения</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary"><window.Ic.filter size={16} /> Фильтр</button>
          <button className="btn btn-primary"><window.Ic.plus size={16} /> Новая кампания</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Активных кампаний" value={window.ADS_LIST.filter(a => a.status === 'active').length} accent="green" icon="megaphone" />
        <MetricCard label="Общий бюджет" value={<CountUp to={totalBudget} prefix="$" />} delta={{ value: '+8%', direction: 'up' }} accent="gold" icon="card" />
        <MetricCard label="Всего кликов" value={<CountUp to={totalClicks} />} delta={{ value: '+24%', direction: 'up' }} icon="eye" />
        <MetricCard label="Средний CTR" value={<CountUp to={4.9} decimals={1} suffix="%" />} delta={{ value: '+0.4%', direction: 'up' }} accent="red" icon="sparkles" />
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Кампания</th>
                <th>Партнёр</th>
                <th>Размещение</th>
                <th>Период</th>
                <th>Бюджет</th>
                <th>Клики</th>
                <th>CTR</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {window.ADS_LIST.map(a => {
                const st = STATUS[a.status];
                return (
                  <tr key={a.id}>
                    <td><div className="cell-title">{a.title}</div></td>
                    <td><span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{a.partner}</span></td>
                    <td><span style={{ fontSize: 12 }}>{a.placement}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{a.period}</span></td>
                    <td><b>${a.budget.toLocaleString('ru-RU')}</b></td>
                    <td>{a.clicks.toLocaleString('ru-RU')}</td>
                    <td><b style={{ color: 'var(--pa-green)' }}>{a.ctr != null ? `${a.ctr}%` : '—'}</b></td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 999,
                        background: st.bg, color: st.color,
                      }}>{st.label}</span>
                    </td>
                    <td><button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.dots size={16} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── AdminShell ─── */
function AdminShell({ page, onPage, theme, onTheme, openModeration, currentRole, onRoleChange, openSpec }) {
  const PAGE_CRUMBS = {
    dashboard:    ['AfricaPortal', 'Админ', 'Дашборд'],
    objects:      ['AfricaPortal', 'Админ', 'Объекты'],
    partners:     ['AfricaPortal', 'Админ', 'Партнёры'],
    reviews:      ['AfricaPortal', 'Админ', 'Отзывы'],
    analytics:    ['AfricaPortal', 'Админ', 'Аналитика'],
    ads:          ['AfricaPortal', 'Админ', 'Реклама'],
    users:        ['AfricaPortal', 'Админ', 'Пользователи'],
    verify:       ['AfricaPortal', 'Админ', 'Верификация'],
    subs:         ['AfricaPortal', 'Админ', 'Подписки'],
    integrations: ['AfricaPortal', 'Админ', 'Интеграции'],
    settings:     ['AfricaPortal', 'Админ', 'Настройки'],
    profile:      ['AfricaPortal', 'Админ', 'Мой профиль'],
    blog:         ['AfricaPortal', 'Админ', 'Блог'],
    map:          ['AfricaPortal', 'Карта', 'GIS Намибии'],
    ministries:   ['AfricaPortal', 'Справочники', 'Министерства'],
    embassies:    ['AfricaPortal', 'Справочники', 'Посольства'],
    holidays:     ['AfricaPortal', 'Справочники', 'Календарь праздников'],
  };

  return (
    <div className="shell">
      <Sidebar
        nav={ADMIN_NAV}
        active={page}
        onNav={onPage}
        theme={theme}
        onTheme={onTheme}
      />
      <div className="shell-main">
        <Topbar
          crumbs={PAGE_CRUMBS[page] || ['Админ']}
          user={{ name: 'Айкуй Мунги', role: 'SUPERADMIN' }}
          extras={<span className="role-chip">SUPERADMIN</span>}
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          openSpec={openSpec}
        />
        <main className="shell-content fade-in" key={page}>
          {page === 'dashboard' && <AdminDashboard openModeration={openModeration} />}
          {page === 'objects'   && <AdminObjects openModeration={openModeration} />}
          {page === 'partners'  && <AdminPartners />}
          {page === 'reviews'   && <AdminReviews />}
          {page === 'analytics' && <AdminAnalytics />}
          {page === 'settings'  && <AdminSettings />}
          {page === 'ads'          && <AdminAdsPage />}
          {page === 'users'        && <AdminUsers />}
          {page === 'verify'       && <AdminStub title="Верификация партнёров" sub="4 партнёра ожидают проверки документов" icon="usercheck" />}
          {page === 'subs'         && <AdminSubsPage />}
          {page === 'integrations' && <AdminIntegrations />}
          {page === 'profile'      && <AdminProfile />}
          {page === 'blog'        && <AdminBlog />}
          {page === 'map'         && <AdminMap />}
          {page === 'ministries'  && <AdminMinistries />}
          {page === 'embassies'   && <AdminEmbassies />}
          {page === 'holidays'    && <AdminHolidays />}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { AdminShell, Sidebar, Topbar, ThemeSwitcher });

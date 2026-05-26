/* eslint-disable */
/**
 * PartnerShell — sidebar + topbar + page router for /partner/*
 * Pages: dashboard, listings, listings/new (wizard), leads, reviews,
 *        analytics, subscription, profile, notifications.
 */
const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

const PARTNER_NAV = [
  { section: 'Мой кабинет' },
  { id: 'dashboard',  label: 'Обзор',         icon: 'dashboard' },
  { id: 'listings',   label: 'Мои объекты',   icon: 'pin' },
  { id: 'analytics',  label: 'Аналитика',     icon: 'chart' },
  { section: 'Управление' },
  { id: 'leads',      label: 'Лиды & CRM',    icon: 'messages', count: 2 },
  { id: 'reviews',    label: 'Отзывы',        icon: 'star' },
  { section: 'Аккаунт' },
  { id: 'subscription', label: 'Подписка',    icon: 'card',    chip: 'Pro' },
  { id: 'profile',    label: 'Профиль',       icon: 'store' },
  { id: 'notifications', label: 'Уведомления',icon: 'bell' },
];

/* ─── Verification banner ─── */
function VerificationBanner({ stage = 2 }) {
  const STEPS = [
    { i: 1, label: 'Документы' },
    { i: 2, label: 'Лицензия NTB' },
    { i: 3, label: 'Одобрение' },
  ];
  return (
    <div className="verify-banner" role="status">
      <div className="verify-icon"><window.Ic.shield size={22} stroke={2.5} /></div>
      <div className="verify-text">
        <div className="verify-title">
          Ваш аккаунт на проверке — этап {stage} из 3
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--sand-700)' }}>
          Пока публикация объектов недоступна. Среднее время верификации — 2–3 рабочих дня.
        </div>
        <div className="verify-stage">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.i}>
              <div className={`step ${s.i < stage ? 'done' : ''} ${s.i === stage ? 'active' : ''}`}>
                <span className="dot">{s.i < stage ? <window.Ic.check size={12} stroke={3} /> : s.i}</span>
                <span>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <span className={`step-line ${s.i < stage ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <button className="btn btn-ghost btn-sm">Связаться с поддержкой</button>
    </div>
  );
}

/* ─── Listing card (partner grid) ─── */
function ListingCard({ listing, onOpen }) {
  return (
    <div className="listing-card" onClick={onOpen}>
      <div className="listing-cover" style={{ backgroundImage: `url(${listing.cover})` }}>
        <div className="cover-tags">
          <span className="chip dark">
            {listing.type === 'hotel' ? '🛏 Отель' : listing.type === 'tour' ? '🧭 Тур' : '📍 Экскурсия'}
          </span>
          <span className="chip">{window.FLAGS[listing.country]} {window.COUNTRY_NAME[listing.country]}</span>
        </div>
        <button className="cover-fav" onClick={(e) => e.stopPropagation()} aria-label="В избранное">
          <window.Ic.star size={14} stroke={2} />
        </button>
      </div>
      <div className="listing-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div className="serif" style={{ fontSize: 17, lineHeight: 1.2, flex: 1 }}>{listing.name}</div>
          <StatusBadge status={listing.status} />
        </div>
        <div className="listing-stats">
          <span><window.Ic.eye size={13} /> <b>{listing.viewCount.toLocaleString('ru-RU')}</b></span>
          <span><window.Ic.inbox size={13} /> <b>{listing.leadCount}</b></span>
          {listing.rating > 0 && <span><window.Ic.star size={13} fill="var(--pa-gold-mid)" stroke={0} /> <b>{listing.rating}</b> · {listing.reviewCount}</span>}
        </div>
        <ProfileBar value={listing.profileScore} />
      </div>
      <div className="listing-foot">
        <PanAfricanStripe height={3} radius={99} style={{ width: 50 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}><window.Ic.pencil size={13} /> Редактировать</button>
          <button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }} aria-label="Открыть"><window.Ic.eye size={13} /></button>
        </div>
      </div>
    </div>
  );
}

/* ─── /partner/dashboard ─── */
function PartnerDashboard({ role, onPage }) {
  return (
    <>
      {role === 'partner_pending' && <VerificationBanner stage={2} />}

      <div className="welcome">
        <div className="welcome-text">
          <div className="welcome-hi serif">Добро пожаловать, <span className="accent">Safari Co.</span></div>
          <div className="welcome-sub">У вас 3 новых лида и 1 объект на модерации. Хорошего дня!</div>
          <div className="welcome-actions">
            <button className="btn btn-gold"><window.Ic.plus size={14} /> Добавить объект</button>
            <button className="btn btn-ghost" onClick={() => onPage('leads')}>
              <window.Ic.inbox size={14} /> Посмотреть лиды
            </button>
            <button className="btn btn-ghost" onClick={() => onPage('profile')}>
              <window.Ic.user size={14} /> Обновить профиль
            </button>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'right' }}>
          <div className="sub-chip" style={{ background: 'var(--pa-gold)', color: 'var(--pa-night)' }}>
            ⚡ PRO <span className="days" style={{ color: 'var(--pa-night-mid)' }}>· 18 дней</span>
          </div>
          <div style={{ color: 'var(--sand-300)', fontSize: 11, marginTop: 8 }}>
            Активна до 15 марта 2026
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <MetricCard
          label="Мои объекты"
          value={<CountUp to={4} />}
          sub="2 активных, 1 модерация, 1 черновик"
          icon="pin"
        />
        <MetricCard
          label="Просмотры"
          value={<CountUp to={2840} />}
          delta={{ value: '+18%', direction: 'up' }}
          sub="к пр. месяцу"
          accent="green"
          icon="eye"
          sparkline={[1800, 2020, 2150, 2240, 2480, 2680, 2840]}
        />
        <MetricCard
          label="Новые лиды"
          value={<CountUp to={3} />}
          delta={{ value: 'не обработаны', direction: 'neutral' }}
          accent="red"
          icon="inbox"
          pulse
        />
        <MetricCard
          label="Средний рейтинг"
          value={<CountUp to={4.8} decimals={1} />}
          delta={{ value: '128 отзывов', direction: 'neutral' }}
          accent="gold"
          icon="star"
        />
      </div>

      <div className="grid-12">
        {/* listings grid */}
        <div style={{ gridColumn: 'span 8' }}>
          <div className="sec-head">
            <h2 className="sec-title">Мои объекты</h2>
            <a className="sec-link" onClick={() => onPage('listings')}>Все 4 →</a>
          </div>
          <div className="grid-2">
            {window.LISTINGS.slice(0, 4).map((l) => (
              <ListingCard key={l.id} listing={l} onOpen={() => onPage('listings')} />
            ))}
          </div>
        </div>

        {/* recent leads */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="sec-title" style={{ fontSize: 16 }}>Последние лиды</h2>
              <a className="sec-link" onClick={() => onPage('leads')}>Все →</a>
            </div>
            {window.RECENT_LEADS.slice(0, 3).map(l => (
              <div key={l.id} className={`lead-row ${l.status === 'new' ? 'unread' : ''}`} onClick={() => onPage('leads')}>
                <Avatar name={l.name} avClass={l.avatar} size="sm" />
                <div className="lead-body">
                  <div className="lead-name">
                    {l.name} <span className="flag">{window.FLAGS[l.country]}</span>
                  </div>
                  <div className="lead-preview">{l.message}</div>
                  <div className="lead-meta">
                    <span>{l.listingName}</span>
                    <span>{l.time}</span>
                  </div>
                </div>
                <span className={`dot ${l.status}`} style={{ marginTop: 8 }} />
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>Моя активность</h2>
            <ActivityFeed items={window.ACTIVITY_PARTNER} max={5} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── /partner/listings ─── */
function PartnerListings({ onPage }) {
  const [filter, setFilter] = useStateP('all');
  const list = window.LISTINGS.filter(l => filter === 'all' || l.status === filter);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Мои объекты</h1>
          <div className="page-sub">4 объекта · 2 активных · 1 на модерации</div>
        </div>
        <button className="btn btn-secondary" onClick={() => onPage('listings-new')}>
          <window.Ic.plus size={16} /> Добавить объект
        </button>
      </div>

      <div className="filter-pills" style={{ marginBottom: 18 }}>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все <span className="ct">{window.LISTINGS.length}</span></button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Активные <span className="ct">{window.LISTINGS.filter(l => l.status === 'active').length}</span></button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>На модерации <span className="ct">{window.LISTINGS.filter(l => l.status === 'pending').length}</span></button>
        <button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>Отклонённые <span className="ct">{window.LISTINGS.filter(l => l.status === 'rejected').length}</span></button>
        <button className={filter === 'draft' ? 'active' : ''} onClick={() => setFilter('draft')}>Черновики <span className="ct">{window.LISTINGS.filter(l => l.status === 'draft').length}</span></button>
      </div>

      <div className="grid-3">
        {list.map(l => (
          <ListingCard key={l.id} listing={l} onOpen={() => {}} />
        ))}
      </div>
    </>
  );
}

/* ─── /partner/listings/new — wizard ─── */
function PartnerListingNew({ onPage }) {
  const [step, setStep] = useStateP(0);
  const [data, setData] = useStateP({
    type: 'hotel',
    nameRu: '',
    nameEn: '',
    country: 'NA',
    region: 'Кунене',
    descRu: '',
    descEn: '',
    rooms: '',
    price: '',
    photos: 0,
  });

  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));

  const completeness = useMemoP(() => {
    let score = 0;
    if (data.nameRu) score += 12;
    if (data.nameEn) score += 8;
    if (data.descRu.length >= 100) score += 18;
    if (data.descEn) score += 10;
    if (data.rooms || data.price) score += 12;
    if (data.photos >= 3) score += 30;
    else if (data.photos > 0) score += 10;
    if (data.country) score += 10;
    return Math.min(100, score);
  }, [data]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Новый объект</h1>
          <div className="page-sub">Заполните 4 шага — публикация после модерации (1–2 дня)</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => onPage('listings')}>
          <window.Ic.arrowleft size={14} /> К списку
        </button>
      </div>

      <Stepper steps={['Основное', 'Детали', 'Медиа', 'Публикация']} current={step} />

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        {step === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <Field label="Название RU *" >
              <input className="input" placeholder="Etosha Safari Lodge" value={data.nameRu} onChange={e => upd('nameRu', e.target.value)} />
            </Field>
            <Field label="Название EN *">
              <input className="input" placeholder="Etosha Safari Lodge" value={data.nameEn} onChange={e => upd('nameEn', e.target.value)} />
            </Field>
            <Field label="Тип объекта *">
              <select className="select" value={data.type} onChange={e => upd('type', e.target.value)}>
                <option value="hotel">Отель</option>
                <option value="tour">Тур</option>
                <option value="excursion">Экскурсия</option>
                <option value="guide">Гид</option>
                <option value="operator">Туроператор</option>
              </select>
            </Field>
            <Field label="Страна *">
              <select className="select" value={data.country} onChange={e => upd('country', e.target.value)}>
                <option value="NA">🇳🇦 Намибия</option>
                <option value="TZ">🇹🇿 Танзания</option>
                <option value="KE">🇰🇪 Кения</option>
                <option value="ZA">🇿🇦 ЮАР</option>
                <option value="MA">🇲🇦 Марокко</option>
                <option value="EG">🇪🇬 Египет</option>
              </select>
            </Field>
            <Field label="Регион *" style={{ gridColumn: 'span 2' }}>
              <input className="input" value={data.region} onChange={e => upd('region', e.target.value)} />
            </Field>
            <Field label="Описание RU *" hint={`${data.descRu.length} / мин. 100 символов`} style={{ gridColumn: 'span 2' }}>
              <textarea className="textarea" rows={4} value={data.descRu} onChange={e => upd('descRu', e.target.value)} placeholder="Расскажите туристам о вашем объекте — что делает его особенным..." />
            </Field>
            <Field label="Описание EN" style={{ gridColumn: 'span 2' }}>
              <textarea className="textarea" rows={3} value={data.descEn} onChange={e => upd('descEn', e.target.value)} placeholder="English description (recommended for international visitors)..." />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {data.type === 'hotel' && (
              <>
                <Field label="Категория (звёзды)">
                  <select className="select" defaultValue="4">
                    <option>★★★★★ — 5 звёзд</option>
                    <option>★★★★ — 4 звезды</option>
                    <option>★★★ — 3 звезды</option>
                  </select>
                </Field>
                <Field label="Количество номеров">
                  <input className="input" type="number" placeholder="24" value={data.rooms} onChange={e => upd('rooms', e.target.value)} />
                </Field>
                <Field label="Средняя цена за ночь (USD)">
                  <input className="input" type="number" placeholder="180" value={data.price} onChange={e => upd('price', e.target.value)} />
                </Field>
                <Field label="Контактный телефон">
                  <input className="input" placeholder="+264 ..." />
                </Field>
                <Field label="Удобства" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {['Wi-Fi', 'Бассейн', 'Ресторан', 'Спа', 'Парковка', 'Прачечная', 'Трансфер', 'Кондиционер'].map(a => (
                      <Checkbox key={a} checked={['Wi-Fi', 'Бассейн', 'Ресторан'].includes(a)} onChange={() => {}} label={a} />
                    ))}
                  </div>
                </Field>
              </>
            )}
            {data.type === 'tour' && (
              <>
                <Field label="Длительность (дней)">
                  <input className="input" type="number" placeholder="5" />
                </Field>
                <Field label="Сложность">
                  <select className="select"><option>Лёгкий</option><option>Средний</option><option>Сложный</option></select>
                </Field>
              </>
            )}
          </div>
        )}

        {step === 2 && <MediaUploader value={data.photos} onChange={(v) => upd('photos', v)} />}

        {step === 3 && (
          <div>
            <div className="cap" style={{ marginBottom: 8 }}>Проверка перед публикацией</div>
            <div className="serif" style={{ fontSize: 22, marginBottom: 14 }}>{data.nameRu || 'Без названия'}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13.5, color: 'var(--color-text-muted)', marginBottom: 22 }}>
              <div><b style={{ color: 'var(--color-text)' }}>Тип:</b> {data.type}</div>
              <div><b style={{ color: 'var(--color-text)' }}>Страна:</b> {window.FLAGS[data.country]} {window.COUNTRY_NAME[data.country]}</div>
              <div><b style={{ color: 'var(--color-text)' }}>Регион:</b> {data.region}</div>
              <div><b style={{ color: 'var(--color-text)' }}>Фото:</b> {data.photos} загружено</div>
            </div>

            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span className="cap">Полнота профиля</span>
              <b>{completeness}%</b>
            </div>
            <div className="profile-bar" style={{ height: 10 }}>
              <span
                className={completeness < 60 ? 'low' : completeness < 80 ? 'mid' : 'high'}
                style={{ width: `${completeness}%` }}
              />
            </div>

            {completeness < 100 && (
              <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="cap" style={{ width: '100%', marginBottom: 4 }}>Незаполненное:</span>
                {data.photos < 3 && <span className="badge badge-rejected">× Минимум 3 фото</span>}
                {!data.descEn && <span className="badge badge-rejected">× Описание EN</span>}
                {data.descRu.length < 100 && <span className="badge badge-rejected">× Описание RU (минимум 100 символов)</span>}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>
          <window.Ic.arrowleft size={14} /> Назад
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost">Сохранить черновик</button>
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => Math.min(3, s + 1))}>
              Далее <window.Ic.arrowright size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" disabled={completeness < 60} onClick={() => onPage('listings')}>
              Отправить на модерацию <window.Ic.send size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, hint, style, children }) {
  return (
    <label style={style}>
      <div className="cap" style={{ marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

function MediaUploader({ value, onChange }) {
  const photos = Array.from({ length: value });
  const samples = [window.PHOTOS.etosha, window.PHOTOS.serengeti, window.PHOTOS.zanzibar, window.PHOTOS.kruger, window.PHOTOS.safari, window.PHOTOS.giraffe];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
        {photos.map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', backgroundImage: `url(${samples[i % samples.length]})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 10, position: 'relative' }}>
            {i === 0 && (
              <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--pa-gold)', color: 'var(--pa-night)', padding: '2px 7px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>
                ★ Обложка
              </span>
            )}
            <button style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.6)', color: 'white', cursor: 'pointer' }} onClick={() => onChange(value - 1)}>
              <window.Ic.x size={12} stroke={3} />
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange(value + 1)}
          style={{
            aspectRatio: '1', borderRadius: 10,
            border: '2px dashed var(--color-border-strong)',
            background: 'var(--color-surface-mute)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            color: 'var(--color-text-muted)', cursor: 'pointer',
          }}
        >
          <window.Ic.upload size={22} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>Загрузить</span>
        </button>
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
        Загружено: <b>{value}</b> / 20 · Минимум для публикации — 3 фото · Перетащите для смены порядка
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Field label="URL видео (YouTube/Vimeo)">
          <input className="input" placeholder="https://youtube.com/watch?v=..." />
        </Field>
        <Field label="Виртуальный 3D-тур (опц.)">
          <input className="input" placeholder="https://..." />
        </Field>
      </div>
    </div>
  );
}

/* ─── /partner/leads ─── */
function PartnerLeads() {
  const [selected, setSelected] = useStateP(window.RECENT_LEADS[0]);
  const [reply, setReply] = useStateP('');

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Лиды & CRM</h1>
          <div className="page-sub">12 всего · 3 новых · 8 отвечено · конверсия 17%</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Всего" value={12} icon="inbox" />
        <MetricCard label="Новые" value={3} accent="red" icon="bell" pulse />
        <MetricCard label="Отвечено" value={8} accent="green" icon="reply" />
        <MetricCard label="Конверсия" value="17%" accent="gold" icon="sparkles" delta={{ value: '+4%', direction: 'up' }} />
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', minHeight: 540 }}>
          {/* List */}
          <div style={{ borderRight: '1px solid var(--color-border)', overflowY: 'auto', maxHeight: 700 }}>
            <div style={{ padding: 14, borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-muted)' }}>
                  <window.Ic.search size={16} />
                </span>
                <input className="input" placeholder="Поиск по лидам..." style={{ paddingLeft: 38, height: 36 }} />
              </div>
            </div>
            {window.RECENT_LEADS.map(l => (
              <div
                key={l.id}
                className={`lead-row ${selected.id === l.id ? 'active' : ''} ${l.status === 'new' ? 'unread' : ''}`}
                onClick={() => setSelected(l)}
              >
                <Avatar name={l.name} avClass={l.avatar} size="sm" />
                <div className="lead-body">
                  <div className="lead-name">{l.name} <span className="flag">{window.FLAGS[l.country]}</span></div>
                  <div className="lead-preview">{l.message}</div>
                  <div className="lead-meta">
                    <span>{l.listingName}</span>
                    <span>{l.time}</span>
                  </div>
                </div>
                <span className={`dot ${l.status}`} style={{ marginTop: 14 }} />
              </div>
            ))}
          </div>

          {/* Detail */}
          <div style={{ padding: 24, overflowY: 'auto', maxHeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
              <Avatar name={selected.name} avClass={selected.avatar} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2 className="sec-title" style={{ fontSize: 20 }}>{selected.name}</h2>
                  <span className="flag" style={{ fontSize: 20 }}>{window.FLAGS[selected.country]}</span>
                  <StatusBadge status={selected.status} withDot />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Лид #{selected.id} · {selected.time} · <a className="sec-link">{selected.listingName} →</a>
                </div>
              </div>
              <button className="btn btn-sm btn-ghost"><window.Ic.dots size={16} /></button>
            </div>

            <div style={{ background: 'var(--color-surface-mute)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                Сообщение туриста
              </div>
              <div style={{ fontSize: 14.5, lineHeight: 1.6 }}>{selected.message}</div>
            </div>

            <div className="cap" style={{ marginBottom: 8 }}>Быстрые шаблоны</div>
            <div className="filter-pills" style={{ marginBottom: 14 }}>
              <button onClick={() => setReply('Здравствуйте! Уточните, пожалуйста, точные даты и количество гостей. Сразу пришлю варианты.')}>📅 Уточнить даты</button>
              <button onClick={() => setReply('Спасибо за интерес! Полный прайс высылаю в приложении.')}>💰 Отправить прайс</button>
              <button onClick={() => setReply('Получили ваш запрос — менеджер свяжется в течение 24 часов.')}>📞 Свяжемся с вами</button>
            </div>

            <Field label="Ваш ответ" hint={`${reply.length} / 500 символов`}>
              <textarea
                className="textarea"
                rows={4}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Здравствуйте! Спасибо за интерес к нашему объекту..."
                maxLength={500}
              />
            </Field>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="btn" style={{ background: 'var(--pa-green)', color: 'white' }} disabled={!reply.trim()}>
                <window.Ic.send size={14} /> Отправить
              </button>
              <button className="btn btn-ghost">Сохранить черновик</button>
              <button className="btn btn-ghost" style={{ marginLeft: 'auto' }}>Заметка</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── /partner/reviews ─── */
function PartnerReviews() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Отзывы</h1>
          <div className="page-sub">128 отзывов · средний рейтинг 4.8★ · 12 ожидают ответа</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Средний рейтинг" value={<>4.8<span style={{ fontSize: 20 }}>★</span></>} accent="gold" icon="star" />
        <MetricCard label="Всего отзывов" value={128} icon="messages" sparkline={[88, 96, 104, 112, 118, 122, 128]} />
        <MetricCard label="Ожидают ответа" value={12} accent="red" icon="reply" pulse />
        <MetricCard label="С 5★" value="74%" accent="green" icon="flame" />
      </div>

      <div className="table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Рейтинг</th><th>Текст</th><th>Турист</th><th>Объект</th><th>Дата</th><th>Статус</th><th></th>
              </tr>
            </thead>
            <tbody>
              {window.REVIEWS.map(r => (
                <tr key={r.id}>
                  <td><RatingStars value={r.rating} /></td>
                  <td style={{ maxWidth: 360 }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-muted)' }}>
                      "{r.text}"
                    </div>
                  </td>
                  <td>{r.author} <span className="flag">{window.FLAGS[r.country]}</span></td>
                  <td>{r.listing}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.date}</td>
                  <td>{r.replied ? <StatusBadge status="active" label="Отвечено" /> : <StatusBadge status="pending" label="Ожидает" />}</td>
                  <td>
                    <button className="btn btn-sm btn-ghost" style={{ padding: '0 10px' }}>
                      <window.Ic.reply size={14} /> Ответить
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

/* ─── /partner/analytics ─── */
function PartnerAnalytics() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Аналитика партнёра</h1>
          <div className="page-sub">Срез за последние 30 дней · сравнение с предыдущим периодом</div>
        </div>
        <div className="tabs">
          {['7д', '30д', '90д'].map(p => <button key={p} className={p === '30д' ? 'active' : ''}>{p}</button>)}
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Конверсия" value="14.2%" delta={{ value: '+2.1%', direction: 'up' }} accent="green" icon="sparkles" sparkline={[8, 10, 11, 12, 13, 14, 14]} />
        <MetricCard label="Ср. время ответа" value="4ч 18м" delta={{ value: '–1ч', direction: 'up' }} accent="gold" icon="clock" />
        <MetricCard label="Оценка профиля" value="82/100" delta={{ value: '+6', direction: 'up' }} icon="shield" />
        <MetricCard label="Ср. рейтинг" value="4.8★" delta={{ value: '+0.2', direction: 'up' }} accent="red" icon="star" />
      </div>

      <div className="grid-12">
        <div className="card card-pad" style={{ gridColumn: 'span 8' }}>
          <div className="sec-head"><h2 className="sec-title">Просмотры моих объектов</h2></div>
          <AreaChart data={window.TRAFFIC_DATA.map(d => ({ ...d, org: Math.round(d.org * 0.4), ref: Math.round(d.ref * 0.3) }))} />
        </div>
        <div className="card card-pad" style={{ gridColumn: 'span 4' }}>
          <h2 className="sec-title" style={{ marginBottom: 14 }}>Источники</h2>
          <PieChart data={[
            { label: 'Поиск AfricaPortal', value: 1840, color: 'var(--pa-green)' },
            { label: 'Прямые ссылки', value: 920, color: 'var(--pa-gold-mid)' },
            { label: 'Соцсети', value: 380, color: 'var(--pa-red)' },
          ]} size={150} hole={50} />
        </div>

        <div className="card card-pad" style={{ gridColumn: 'span 7' }}>
          <h2 className="sec-title" style={{ marginBottom: 14 }}>Просмотры по объектам</h2>
          <BarChartHoriz data={window.LISTINGS.slice(0, 5).map(l => ({ name: l.name, value: l.viewCount }))} />
        </div>
        <div className="card card-pad" style={{ gridColumn: 'span 5' }}>
          <h2 className="sec-title" style={{ marginBottom: 14 }}>География посетителей</h2>
          <table style={{ width: '100%', fontSize: 13 }}>
            <tbody>
              {[
                { code: 'DE', value: 820, pct: '32%' },
                { code: 'RU', value: 480, pct: '18%' },
                { code: 'GB', value: 320, pct: '12%' },
                { code: 'FR', value: 240, pct: '9%' },
                { code: 'US', value: 180, pct: '7%' },
              ].map(c => (
                <tr key={c.code}>
                  <td style={{ padding: '8px 0' }}>{window.FLAGS[c.code]} {window.COUNTRY_NAME[c.code] || c.code}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--color-text-muted)' }}>{c.value}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>{c.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ─── /partner/subscription ─── */
function PartnerSubscription() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Подписка</h1>
          <div className="page-sub">Текущий план: <b style={{ color: 'var(--color-text)' }}>Pro</b> · продление 15 марта</div>
        </div>
      </div>

      <div className="grid-12" style={{ marginBottom: 24 }}>
        {/* Current plan card */}
        <div style={{ gridColumn: 'span 5' }}>
          <div className="card card-pad" style={{ position: 'relative', overflow: 'hidden', border: '2px solid var(--pa-red)' }}>
            <PanAfricanStripe height={4} style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div className="cap" style={{ color: 'var(--pa-red)' }}>Текущий план</div>
                <div className="serif" style={{ fontSize: 36, lineHeight: 1, marginTop: 2 }}>PRO</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>$49 / месяц</div>
              </div>
              <span className="sub-chip">⚡ АКТИВНА</span>
            </div>

            <div className="cap" style={{ marginBottom: 6 }}>До конца периода</div>
            <div className="profile-bar" style={{ height: 8 }}><span className="high" style={{ width: '60%' }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>
              <span>15 фев 2026</span>
              <b style={{ color: 'var(--color-text)' }}>18 дней осталось</b>
              <span>15 мар 2026</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['До 10 объектов', 'Аналитика за 30 дней', 'CRM лидов', 'Приоритетная поддержка'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5 }}>
                  <window.Ic.check size={16} stroke={2.5} style={{ color: 'var(--pa-green)' }} /> {f}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>Продлить</button>
              <button className="btn btn-gold" style={{ flex: 1 }}>Улучшить →</button>
            </div>
          </div>
        </div>

        {/* Plans comparison */}
        <div style={{ gridColumn: 'span 7' }}>
          <div className="grid-3">
            {window.SUBSCRIPTION_PLANS.map(p => (
              <div
                key={p.id}
                className="card card-pad"
                style={{
                  border: p.current ? '2px solid var(--pa-red)' : '1px solid var(--color-border)',
                  position: 'relative',
                  transform: p.current ? 'translateY(-4px)' : 'none',
                }}
              >
                {p.current && (
                  <span className="badge badge-rejected" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--pa-red)', color: 'white' }}>
                    Текущий
                  </span>
                )}
                <div className="serif" style={{ fontSize: 24 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, marginTop: 4 }}>
                  {p.price === 0 ? 'Бесплатно' : `$${p.price} / мес`}
                </div>
                <PanAfricanStripe height={2} radius={99} style={{ width: 40, margin: '12px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <window.Ic.check size={13} stroke={2.5} style={{ color: 'var(--pa-green)', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                {!p.current && (
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: 16 }}>
                    {p.price === 0 ? 'Понизить' : 'Перейти'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="sec-title" style={{ fontSize: 16 }}>История платежей</h2>
        </div>
        <table className="dtable">
          <thead><tr><th>Дата</th><th>Сумма</th><th>Тариф</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {window.BILLING_HISTORY.map((b, i) => (
              <tr key={i}>
                <td>{b.date}</td>
                <td><b>{b.amount === 0 ? '—' : `$${b.amount}`}</b></td>
                <td>{b.plan}</td>
                <td><StatusBadge status="active" label="Оплачено" withDot /></td>
                <td><button className="btn btn-sm btn-ghost"><window.Ic.download size={14} /> Счёт</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─── /partner/profile ─── */
function PartnerProfile() {
  const [name, setName] = useStateP('Safari Co. Namibia');
  const [desc, setDesc] = useStateP('Опытный оператор сафари в Намибии с 2008 года. 4 объекта в национальных парках. Лицензия NTB № 12-3456.');
  const [tab, setTab]   = useStateP('about');

  const TEAM = [
    { n: 'John Mbeki',      pos: 'CEO / основатель',  email: 'john@safari-co.na', phone: '+264 81 234 5678' },
    { n: 'Aïcha Mungi',     pos: 'Senior Guide',      email: 'aicha@safari-co.na', phone: '+264 81 991 7700' },
    { n: 'Pieter van Wyk',  pos: 'Бронирование',      email: 'booking@safari-co.na', phone: '+264 81 991 1432' },
    { n: 'Maria Schmidt',   pos: 'Маркетинг',          email: 'marketing@safari-co.na', phone: '+264 81 991 5510' },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Профиль компании</h1>
          <div className="page-sub">Юр.лицо, лицензии, банк, команда — всё, что видят админ и туристы</div>
        </div>
      </div>

      <div className="grid-12">
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="tabs">
            <button className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>
              <window.Ic.store size={13} /> О компании
            </button>
            <button className={tab === 'legal' ? 'active' : ''} onClick={() => setTab('legal')}>
              <window.Ic.briefcase size={13} /> Юр.лицо
            </button>
            <button className={tab === 'licenses' ? 'active' : ''} onClick={() => setTab('licenses')}>
              <window.Ic.shield size={13} /> Лицензии
            </button>
            <button className={tab === 'bank' ? 'active' : ''} onClick={() => setTab('bank')}>
              <window.Ic.card size={13} /> Банк
            </button>
            <button className={tab === 'team' ? 'active' : ''} onClick={() => setTab('team')}>
              <window.Ic.users size={13} /> Команда
            </button>
          </div>

          {tab === 'about' && (
            <>
              <div className="card card-pad">
                <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>О компании</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Название RU"><input className="input" value={name} onChange={e => setName(e.target.value)} /></Field>
                  <Field label="Название EN"><input className="input" defaultValue="Safari Co. Namibia" /></Field>
                  <Field label="Год основания"><input className="input" defaultValue="2008" /></Field>
                  <Field label="Сайт"><input className="input" defaultValue="https://safari-co.na" /></Field>
                  <Field label="Описание" style={{ gridColumn: 'span 2' }}>
                    <textarea className="textarea" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
                  </Field>
                </div>
              </div>

              <div className="card card-pad">
                <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>Контакты и адрес</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Телефон"><input className="input" defaultValue="+264 81 234 5678" /></Field>
                  <Field label="Email"><input className="input" defaultValue="info@safari-co.na" /></Field>
                  <Field label="WhatsApp"><input className="input" defaultValue="+264 81 234 5678" /></Field>
                  <Field label="Telegram"><input className="input" defaultValue="@safari_co_na" /></Field>
                  <Field label="Страна"><input className="input" defaultValue="Намибия" /></Field>
                  <Field label="Город"><input className="input" defaultValue="Виндхук" /></Field>
                </div>
              </div>
            </>
          )}

          {tab === 'legal' && (
            <div className="card card-pad">
              <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>Юридические реквизиты</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Юридическое название"><input className="input" defaultValue="Safari Co. (Pty) Ltd" /></Field>
                <Field label="Регистрационный №"><input className="input" defaultValue="NA-CC/2018/12345" /></Field>
                <Field label="Tax ID (VAT)"><input className="input" defaultValue="VAT-12345678" /></Field>
                <Field label="Налоговая юрисдикция"><input className="input" defaultValue="Namibia Revenue Agency" /></Field>
                <Field label="Юр.адрес" style={{ gridColumn: 'span 2' }}>
                  <input className="input" defaultValue="14 Independence Ave, Windhoek 10001, Namibia" />
                </Field>
                <Field label="Директор"><input className="input" defaultValue="John Mbeki" /></Field>
                <Field label="Дата регистрации"><input className="input" type="date" defaultValue="2008-04-12" /></Field>
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--pa-green-light)', borderRadius: 8, fontSize: 12.5 }}>
                <window.Ic.check size={14} /> Реквизиты подтверждены AfricaPortal · 22.04.2024
              </div>
            </div>
          )}

          {tab === 'licenses' && (
            <div className="card card-pad">
              <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>Лицензии и сертификаты</h2>
              <DocRow name="NTB Лицензия туроператора" status="active" file="ntb-license-2026.pdf" />
              <DocRow name="Регистрация компании (Pty Ltd)" status="active" file="company-cert.pdf" />
              <DocRow name="Tax Clearance" status="active" file="tax-clearance-2026.pdf" />
              <DocRow name="Страховка ответственности (до $1M)" status="pending" file="insurance-2026.pdf" />
              <DocRow name="ISO 9001 (опционально)" status="draft" file="—" />
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
                <window.Ic.upload size={13} /> Загрузить документ
              </button>
            </div>
          )}

          {tab === 'bank' && (
            <div className="card card-pad">
              <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 14 }}>Банковские реквизиты</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Bank Name"><input className="input" defaultValue="First National Bank Namibia" /></Field>
                <Field label="SWIFT"><input className="input" defaultValue="FIRNNANX" /></Field>
                <Field label="Branch Code"><input className="input" defaultValue="280172" /></Field>
                <Field label="Account Holder"><input className="input" defaultValue="Safari Co. (Pty) Ltd" /></Field>
                <Field label="Account №" style={{ gridColumn: 'span 2' }}>
                  <input className="input" defaultValue="•••• •••• 4421" />
                </Field>
                <Field label="Валюта счёта">
                  <select className="select" defaultValue="USD">
                    <option value="USD">USD ($)</option>
                    <option value="NAD">NAD (N$)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </Field>
                <Field label="Доступ к выводу">
                  <select className="select" defaultValue="auto">
                    <option value="auto">Авто (раз в неделю)</option>
                    <option value="manual">По запросу</option>
                  </select>
                </Field>
              </div>
              <div style={{ marginTop: 14, padding: 12, background: 'var(--pa-gold-light)', borderRadius: 8, fontSize: 12.5 }}>
                <window.Ic.info size={14} /> Изменение банковских реквизитов потребует повторной верификации AfricaPortal (3–5 рабочих дней).
              </div>
            </div>
          )}

          {tab === 'team' && (
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 className="sec-title" style={{ fontSize: 16 }}>Команда ({TEAM.length})</h2>
                <button className="btn btn-secondary btn-sm">
                  <window.Ic.plus size={13} /> Добавить сотрудника
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEAM.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, padding: 12,
                    background: 'var(--color-surface-mute)', borderRadius: 8,
                    alignItems: 'center',
                  }}>
                    <Avatar name={m.n} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>{m.n}</b>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{m.pos}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'right' }}>
                      {m.email}<br/>{m.phone}
                    </div>
                    <button className="btn btn-sm btn-ghost"><window.Ic.dots size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div style={{ gridColumn: 'span 5' }}>
          <div style={{ position: 'sticky', top: 80 }}>
            <div className="cap" style={{ marginBottom: 10 }}>Превью карточки на сайте</div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 130, background: 'linear-gradient(135deg, var(--pa-night), var(--pa-red-dark))', position: 'relative' }}>
                <PanAfricanStripe height={4} style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
              </div>
              <div style={{ padding: 18, position: 'relative' }}>
                <div className="avatar lg av-4" style={{ marginTop: -54, marginBottom: 12, width: 72, height: 72, fontSize: 22, border: '4px solid var(--color-surface)' }}>SC</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 className="serif" style={{ fontSize: 22 }}>{name}</h3>
                  <StatusBadge status="verified" label="Верифицирован" />
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--color-text-muted)', marginTop: 8, lineHeight: 1.55 }}>{desc}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 13 }}>
                  <span><b>4</b> объекта</span>
                  <span><window.Ic.star size={13} fill="var(--pa-gold-mid)" stroke={0} /> <b>4.8</b> · 128 отзывов</span>
                  <span>🇳🇦 Намибия</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  {['Сафари', 'Этно-туры', 'Luxury'].map(t => (
                    <span key={t} className="chip" style={{ background: 'var(--sand-100)', color: 'var(--color-text)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'sticky', bottom: 16, marginTop: 22,
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 12, padding: 12, boxShadow: 'var(--shadow-hover)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span className="badge badge-pending"><span className="badge-dot badge-dot-pending" /> Несохранённые изменения</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Отмена</button>
          <button className="btn btn-primary"><window.Ic.check size={14} /> Сохранить</button>
        </div>
      </div>
    </>
  );
}

function DocRow({ name, status, file }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--pa-red-light)', color: 'var(--pa-red)', display: 'grid', placeItems: 'center' }}>
        <window.Ic.document size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{file} · 1.2 МБ</div>
      </div>
      <StatusBadge status={status} withDot label={status === 'active' ? 'Проверен' : 'На проверке'} />
      <button className="btn btn-sm btn-ghost"><window.Ic.upload size={14} /> Перезагрузить</button>
    </div>
  );
}

/* ─── PartnerShell ─── */
function PartnerShell({ page, onPage, theme, onTheme, role, currentRole, onRoleChange, openSpec }) {
  const CRUMBS = {
    dashboard:    ['AfricaPortal', 'Партнёр', 'Обзор'],
    listings:     ['AfricaPortal', 'Партнёр', 'Мои объекты'],
    'listings-new': ['AfricaPortal', 'Партнёр', 'Мои объекты', 'Новый'],
    leads:        ['AfricaPortal', 'Партнёр', 'Лиды & CRM'],
    reviews:      ['AfricaPortal', 'Партнёр', 'Отзывы'],
    analytics:    ['AfricaPortal', 'Партнёр', 'Аналитика'],
    subscription: ['AfricaPortal', 'Партнёр', 'Подписка'],
    profile:      ['AfricaPortal', 'Партнёр', 'Профиль'],
    notifications: ['AfricaPortal', 'Партнёр', 'Уведомления'],
  };

  return (
    <div className="shell">
      <Sidebar
        nav={PARTNER_NAV}
        active={page === 'listings-new' ? 'listings' : page}
        onNav={onPage}
        theme={theme}
        onTheme={onTheme}
      />
      <div className="shell-main">
        <Topbar
          crumbs={CRUMBS[page] || ['Партнёр']}
          user={{ name: 'Safari Co.', role: role === 'partner_pending' ? 'PARTNER · PENDING' : 'PARTNER' }}
          extras={
            <span className="sub-chip">⚡ Pro <span className="days">· 18 дней</span></span>
          }
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          openSpec={openSpec}
        />
        <main className="shell-content fade-in" key={page}>
          {page === 'dashboard'      && <PartnerDashboard role={role} onPage={onPage} />}
          {page === 'listings'       && <PartnerListings onPage={onPage} />}
          {page === 'listings-new'   && <PartnerListingNew onPage={onPage} />}
          {page === 'leads'          && <PartnerLeads />}
          {page === 'reviews'        && <PartnerReviews />}
          {page === 'analytics'      && <PartnerAnalytics />}
          {page === 'subscription'   && <PartnerSubscription />}
          {page === 'profile'        && <PartnerProfile />}
          {page === 'notifications'  && (
            <>
              <div className="page-head"><h1 className="page-title">Уведомления</h1></div>
              <div className="card card-pad">
                <ActivityFeed items={[...window.ACTIVITY_PARTNER, ...window.ACTIVITY_PARTNER]} max={8} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { PartnerShell, ListingCard, VerificationBanner });

/* eslint-disable */
/**
 * UserShell — ЛК обычного путешественника.
 * Страницы: dashboard (главная), favorites, bookings, reviews, messages,
 *           notifications, profile, settings.
 */
const { useState: useStateU, useEffect: useEffectU, useMemo: useMemoU } = React;

const USER_NAV = [
  { section: 'Моя поездка' },
  { id: 'dashboard',     label: 'Главная',      icon: 'dashboard' },
  { id: 'favorites',     label: 'Избранное',    icon: 'star',    count: 4 },
  { id: 'bookings',      label: 'Мои поездки',  icon: 'pin',     count: 3 },
  { section: 'Общение' },
  { id: 'messages',      label: 'Сообщения',    icon: 'messages', count: 2 },
  { id: 'reviews',       label: 'Мои отзывы',   icon: 'star' },
  { id: 'notifications', label: 'Уведомления',  icon: 'bell',    count: 5 },
  { section: 'Аккаунт' },
  { id: 'profile',       label: 'Профиль',      icon: 'user' },
  { id: 'settings',      label: 'Настройки',    icon: 'settings' },
];

/* ─── /user/dashboard ─── */
function UserDashboard({ onPage }) {
  const upcoming = window.USER_BOOKINGS.filter(b => b.status === 'upcoming');
  const recent   = window.USER_BOOKINGS.filter(b => b.status === 'completed').slice(0, 2);

  return (
    <>
      <div className="welcome" style={{ background: 'linear-gradient(135deg, var(--pa-green-dark), var(--pa-green))' }}>
        <div className="welcome-text">
          <div className="welcome-hi serif">Привет, <span className="accent">Мария</span>!</div>
          <div className="welcome-sub">
            До следующей поездки — <b>14 дней</b>. У вас 2 непрочитанных сообщения и 4 объекта в избранном.
          </div>
          <div className="welcome-actions">
            <button className="btn btn-gold" onClick={() => onPage('bookings')}>
              <window.Ic.pin size={14} /> Мои поездки
            </button>
            <button className="btn btn-ghost" onClick={() => onPage('favorites')}>
              <window.Ic.star size={14} /> Избранное
            </button>
            <button className="btn btn-ghost" onClick={() => {
              if (window.__PORTAL_ROUTER) window.__PORTAL_ROUTER.goLanding();
            }}>
              <window.Ic.globe size={14} /> Искать туры
            </button>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <MetricCard label="Поездок"      value={<CountUp to={5} />}  sub="2 предстоящих, 3 завершено" icon="pin" />
        <MetricCard label="Избранное"    value={<CountUp to={4} />}  accent="gold" icon="star" />
        <MetricCard label="Сообщений"    value={<CountUp to={2} />}  accent="red"  icon="messages" pulse sub="не прочитано" />
        <MetricCard label="Бонусные ₽"   value={<CountUp to={2840} />} accent="green" icon="card" sub="кешбэк за поездки" />
      </div>

      <div className="grid-12">
        <div style={{ gridColumn: 'span 8' }}>
          <div className="sec-head">
            <h2 className="sec-title">Предстоящие поездки</h2>
            <a className="sec-link" onClick={() => onPage('bookings')}>Все →</a>
          </div>
          {upcoming.length === 0 && (
            <EmptyState
              icon="pin"
              title="Пока нет запланированных поездок"
              sub="Найдите свой первый сафари-маршрут — у нас 1284 проверенных объекта"
              action={<button className="btn btn-secondary" onClick={() => window.__PORTAL_ROUTER && window.__PORTAL_ROUTER.goLanding()}>Найти тур</button>}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {upcoming.map(b => <BookingRow key={b.id} b={b} onPage={onPage} />)}
          </div>

          {recent.length > 0 && (
            <>
              <div className="sec-head" style={{ marginTop: 24 }}>
                <h2 className="sec-title">Недавние поездки</h2>
                <a className="sec-link" onClick={() => onPage('bookings')}>История →</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recent.map(b => <BookingRow key={b.id} b={b} onPage={onPage} />)}
              </div>
            </>
          )}
        </div>

        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="sec-title" style={{ fontSize: 16 }}>Уведомления</h2>
              <a className="sec-link" onClick={() => onPage('notifications')}>Все →</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {window.USER_NOTIFS.slice(0, 4).map(n => (
                <div key={n.id} style={{
                  display: 'flex', gap: 10, padding: '10px 18px',
                  borderTop: '1px solid var(--color-border)',
                  background: n.unread ? 'var(--pa-green-light)' : 'transparent',
                }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--color-surface-mute)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{n.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500 }}>{n.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h2 className="sec-title" style={{ fontSize: 16, marginBottom: 12 }}>Избранное</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {window.LISTINGS.slice(0, 3).map(l => (
                <div key={l.id} style={{ display: 'flex', gap: 10, cursor: 'pointer' }} onClick={() => onPage('favorites')}>
                  <div className="thumb" style={{ width: 52, height: 52, backgroundImage: `url(${l.cover})`, borderRadius: 8 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      <span className="flag">{window.FLAGS[l.country]}</span> {window.COUNTRY_NAME[l.country]} · {l.region}
                    </div>
                  </div>
                  {l.rating > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--pa-gold)', whiteSpace: 'nowrap', marginTop: 4 }}>
                      ★ {l.rating}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={() => onPage('favorites')}>
              Все избранное (4) →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function BookingRow({ b, onPage }) {
  const statusColor = b.status === 'upcoming' ? 'var(--pa-green)'
                    : b.status === 'completed' ? 'var(--sand-500)'
                    : 'var(--pa-gold)';
  const statusLabel = b.status === 'upcoming' ? 'Предстоит'
                    : b.status === 'completed' ? 'Завершено'
                    : 'В обработке';
  return (
    <div className="card" style={{ display: 'flex', overflow: 'hidden' }}>
      <div style={{
        width: 140, minHeight: 140,
        backgroundImage: `url(${b.cover})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: 999,
            background: statusColor, color: 'white', letterSpacing: 0.5,
          }}>{statusLabel}</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>ID #{b.id}</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700 }} className="serif">{b.name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
          <span className="flag">{window.FLAGS[b.country]}</span> {window.COUNTRY_NAME[b.country]} · {b.region}
        </div>
        <div style={{ display: 'flex', gap: 18, fontSize: 12.5, marginTop: 4, flexWrap: 'wrap' }}>
          <span><b>📅 {b.dates}</b></span>
          <span><b>👥 {b.pax}</b> гостя</span>
          <span><b style={{ color: 'var(--pa-green)' }}>{b.price}</b></span>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-sm btn-secondary"><window.Ic.eye size={13} /> Детали</button>
          {b.status === 'upcoming' && (
            <button className="btn btn-sm btn-ghost" onClick={() => onPage('messages')}>
              <window.Ic.messages size={13} /> Партнёру
            </button>
          )}
          {b.status === 'completed' && !b.reviewed && (
            <button className="btn btn-sm btn-gold" onClick={() => onPage('reviews')}>
              <window.Ic.star size={13} /> Оставить отзыв
            </button>
          )}
          {b.status === 'completed' && b.reviewed && (
            <span style={{ fontSize: 12, color: 'var(--pa-green-dark)', padding: '6px 10px', fontWeight: 600 }}>
              ✓ Отзыв оставлен
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── /user/favorites ─── */
function UserFavorites({ onPage }) {
  const [filter, setFilter] = useStateU('all');
  const favs = window.LISTINGS.filter(l => l.status === 'active');
  const list = filter === 'all' ? favs : favs.filter(l => l.type === filter);
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Избранное</h1>
          <div className="page-sub">{favs.length} объектов в вашем wishlist</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => window.__PORTAL_ROUTER && window.__PORTAL_ROUTER.goLanding()}>
          <window.Ic.plus size={14} /> Добавить с витрины
        </button>
      </div>

      <div className="filter-pills" style={{ marginBottom: 18 }}>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все <span className="ct">{favs.length}</span></button>
        <button className={filter === 'hotel' ? 'active' : ''} onClick={() => setFilter('hotel')}>Отели</button>
        <button className={filter === 'tour' ? 'active' : ''} onClick={() => setFilter('tour')}>Туры</button>
        <button className={filter === 'excursion' ? 'active' : ''} onClick={() => setFilter('excursion')}>Экскурсии</button>
      </div>

      <div className="grid-3">
        {list.map(l => (
          <div key={l.id} className="listing-card">
            <div className="listing-cover" style={{ backgroundImage: `url(${l.cover})` }}>
              <div className="cover-tags">
                <span className="chip dark">
                  {l.type === 'hotel' ? '🛏 Отель' : l.type === 'tour' ? '🧭 Тур' : '📍 Экскурсия'}
                </span>
                <span className="chip">{window.FLAGS[l.country]} {window.COUNTRY_NAME[l.country]}</span>
              </div>
              <button className="cover-fav" style={{ background: 'var(--pa-red)' }} aria-label="Убрать из избранного">
                <window.Ic.star size={14} fill="white" stroke={0} />
              </button>
            </div>
            <div className="listing-body">
              <div className="serif" style={{ fontSize: 17, lineHeight: 1.2 }}>{l.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>{l.region}</div>
              {l.rating > 0 && (
                <div className="listing-stats" style={{ marginTop: 10 }}>
                  <span><window.Ic.star size={13} fill="var(--pa-gold-mid)" stroke={0} /> <b>{l.rating}</b> · {l.reviewCount} отзывов</span>
                </div>
              )}
            </div>
            <div className="listing-foot">
              <button className="btn btn-sm btn-secondary" style={{ flex: 1 }}>Подробнее</button>
              <button className="btn btn-sm btn-gold">Забронировать</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── /user/bookings ─── */
function UserBookings({ onPage }) {
  const [tab, setTab] = useStateU('upcoming');
  const list = window.USER_BOOKINGS.filter(b => b.status === tab);
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Мои поездки</h1>
          <div className="page-sub">История бронирований и предстоящие туры</div>
        </div>
        <button className="btn btn-secondary"><window.Ic.download size={14} /> Экспорт в PDF</button>
      </div>

      <div className="tabs" style={{ marginBottom: 22 }}>
        {[
          { id: 'upcoming',  label: 'Предстоящие',  ct: window.USER_BOOKINGS.filter(b => b.status === 'upcoming').length },
          { id: 'pending',   label: 'В обработке',  ct: window.USER_BOOKINGS.filter(b => b.status === 'pending').length },
          { id: 'completed', label: 'Завершённые',  ct: window.USER_BOOKINGS.filter(b => b.status === 'completed').length },
          { id: 'cancelled', label: 'Отменённые',   ct: window.USER_BOOKINGS.filter(b => b.status === 'cancelled').length },
        ].map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label} <span className="ct">{t.ct}</span>
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="card">
          <EmptyState icon="pin" title="Нет поездок в этой вкладке" sub="Выберите другой статус или забронируйте новое путешествие" />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.map(b => <BookingRow key={b.id} b={b} onPage={onPage} />)}
      </div>
    </>
  );
}

/* ─── /user/messages ─── */
function UserMessages() {
  const [selected, setSel] = useStateU(window.USER_THREADS[0]);
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Сообщения</h1>
          <div className="page-sub">Диалоги с партнёрами и поддержкой</div>
        </div>
      </div>

      <div className="grid-12" style={{ minHeight: 520 }}>
        <div className="card" style={{ gridColumn: 'span 4', overflow: 'hidden' }}>
          {window.USER_THREADS.map(t => (
            <div
              key={t.id}
              onClick={() => setSel(t)}
              className={`lead-row ${selected.id === t.id ? 'active' : ''} ${t.unread ? 'unread' : ''}`}
            >
              <Avatar name={t.partner} avClass={t.avatar} size="sm" />
              <div className="lead-body">
                <div className="lead-name">
                  {t.partner}
                  {t.unread > 0 && <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                    background: 'var(--pa-red)', color: 'white', marginLeft: 6,
                  }}>{t.unread}</span>}
                </div>
                <div className="lead-preview">{t.preview}</div>
                <div className="lead-meta">
                  <span>{t.listing}</span>
                  <span>{t.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={selected.partner} avClass={selected.avatar} />
            <div>
              <div style={{ fontWeight: 700 }}>{selected.partner}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                {selected.listing} · обычно отвечает в течение 2 часов
              </div>
            </div>
          </div>
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
            {selected.messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: 12,
                background: m.from === 'me' ? 'var(--pa-green)' : 'var(--color-surface-mute)',
                color: m.from === 'me' ? 'white' : 'var(--color-text)',
                fontSize: 13.5, lineHeight: 1.5,
              }}>
                {m.text}
                <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 4 }}>{m.time}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Написать сообщение..." style={{ flex: 1 }} />
            <button className="btn btn-secondary"><window.Ic.arrowright size={14} /></button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── /user/reviews ─── */
function UserReviews() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Мои отзывы</h1>
          <div className="page-sub">Отзывы, которые вы оставили о поездках</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 22 }}>
        <MetricCard label="Всего"        value={3} icon="star" />
        <MetricCard label="Опубликовано" value={2} accent="green" icon="check" />
        <MetricCard label="Ждут ответа"  value={1} accent="gold" icon="clock" />
        <MetricCard label="Можно оставить" value={1} accent="red" icon="plus" pulse />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {window.MY_REVIEWS.map(r => (
          <div key={r.id} className="card card-pad">
            <div style={{ display: 'flex', gap: 14 }}>
              <div className="thumb" style={{ width: 72, height: 72, backgroundImage: `url(${r.cover})`, borderRadius: 10 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div className="serif" style={{ fontSize: 17 }}>{r.listing}</div>
                  <RatingStars value={r.rating} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Поездка {r.tripDate} · опубликовано {r.publishedDate}
                </div>
                <div style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.5 }}>{r.text}</div>
                {r.partnerReply && (
                  <div style={{
                    marginTop: 12, padding: 12,
                    background: 'var(--color-surface-mute)',
                    borderLeft: '3px solid var(--pa-green)',
                    borderRadius: 6, fontSize: 13, lineHeight: 1.5,
                  }}>
                    <div className="cap" style={{ marginBottom: 4 }}>Ответ партнёра — {r.partnerName}</div>
                    {r.partnerReply}
                  </div>
                )}
              </div>
              <div>
                <button className="btn btn-sm btn-ghost"><window.Ic.pencil size={13} /> Изменить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── /user/notifications ─── */
function UserNotifications() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Уведомления</h1>
          <div className="page-sub">5 новых · всего {window.USER_NOTIFS.length}</div>
        </div>
        <button className="btn btn-ghost btn-sm">Отметить всё как прочитанное</button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {window.USER_NOTIFS.map(n => (
          <div key={n.id} style={{
            display: 'flex', gap: 14, padding: '14px 18px',
            borderBottom: '1px solid var(--color-border)',
            background: n.unread ? 'var(--pa-green-light)' : 'transparent',
          }}>
            <span style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--color-surface-mute)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 18,
            }}>{n.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: n.unread ? 600 : 500 }}>{n.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 3 }}>{n.body}</div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 6 }}>{n.time}</div>
            </div>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pa-red)', flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── /user/profile ─── */
function UserProfile() {
  const [tab, setTab] = useState('personal');
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Мой профиль</h1>
          <div className="page-sub">Личные данные, документы, способы оплаты и предпочтения</div>
        </div>
        <button className="btn btn-primary"><window.Ic.check size={14} /> Сохранить</button>
      </div>

      <div className="grid-12">
        {/* Левая колонка — личная карточка */}
        <div className="card card-pad" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Avatar name="Мария Иванова" avClass="av-1" size="lg" />
          <div style={{ textAlign: 'center' }}>
            <div className="serif" style={{ fontSize: 20 }}>Мария Иванова</div>
            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
              <span className="flag">🇷🇺</span> Россия · С нами с июня 2025
            </div>
          </div>
          <button className="btn btn-ghost btn-sm"><window.Ic.camera size={13} /> Сменить аватар</button>
          <div style={{
            width: '100%', padding: 14, marginTop: 8,
            background: 'var(--pa-gold-light)', borderRadius: 10,
            fontSize: 12.5, textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}><window.Ic.award size={28} /></div>
            <b>Опытный путешественник</b>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>5 поездок · 3 отзыва · 4 страны</div>
          </div>

          <div style={{
            width: '100%', padding: 14,
            background: 'linear-gradient(135deg, var(--pa-gold), var(--pa-gold-mid))',
            color: 'var(--pa-night)', borderRadius: 10,
          }}>
            <div className="cap" style={{ color: 'var(--pa-night)', fontSize: 10, opacity: .8 }}>Бонусный счёт</div>
            <div style={{ fontWeight: 800, fontSize: 24, marginTop: 4 }}>2 840 ₽</div>
            <button className="btn btn-sm" style={{ background: 'var(--pa-night)', color: 'var(--pa-gold)', width: '100%', marginTop: 8 }}>
              Применить к поездке
            </button>
          </div>

          {/* Экстренные контакты */}
          <div style={{ width: '100%', padding: 14, background: 'var(--pa-red-light)', borderRadius: 10, borderLeft: '3px solid var(--pa-red)' }}>
            <div className="cap" style={{ marginBottom: 6 }}>⚠ Экстренные контакты</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
              <div><b>Иван Иванов</b> (муж)</div>
              <div style={{ color: 'var(--color-text-muted)' }}>+7 999 765-43-21</div>
            </div>
          </div>
        </div>

        {/* Правая колонка — табы */}
        <div className="card card-pad" style={{ gridColumn: 'span 8' }}>
          <div className="tabs" style={{ marginBottom: 16 }}>
            <button className={tab === 'personal' ? 'active' : ''} onClick={() => setTab('personal')}>
              <window.Ic.user size={13} /> Личные данные
            </button>
            <button className={tab === 'docs' ? 'active' : ''} onClick={() => setTab('docs')}>
              <window.Ic.document size={13} /> Документы и визы
            </button>
            <button className={tab === 'payment' ? 'active' : ''} onClick={() => setTab('payment')}>
              <window.Ic.card size={13} /> Оплата
            </button>
            <button className={tab === 'prefs' ? 'active' : ''} onClick={() => setTab('prefs')}>
              <window.Ic.heart size={13} /> Предпочтения
            </button>
            <button className={tab === 'insurance' ? 'active' : ''} onClick={() => setTab('insurance')}>
              <window.Ic.shield size={13} /> Страховка
            </button>
          </div>

          {tab === 'personal' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Имя"><input className="input" defaultValue="Мария" /></Field>
                <Field label="Фамилия"><input className="input" defaultValue="Иванова" /></Field>
                <Field label="Email"><input className="input" type="email" defaultValue="maria@example.com" /></Field>
                <Field label="Телефон"><input className="input" defaultValue="+7 999 123-45-67" /></Field>
                <Field label="Дата рождения"><input className="input" type="date" defaultValue="1990-06-15" /></Field>
                <Field label="Гражданство">
                  <select className="select" defaultValue="RU">
                    <option value="RU">🇷🇺 Россия</option>
                    <option value="KZ">🇰🇿 Казахстан</option>
                    <option value="BY">🇧🇾 Беларусь</option>
                  </select>
                </Field>
                <Field label="Город проживания" style={{ gridColumn: 'span 2' }}>
                  <input className="input" defaultValue="Москва" />
                </Field>
                <Field label="О себе" style={{ gridColumn: 'span 2' }}>
                  <textarea className="textarea" rows={3} defaultValue="Люблю сафари и природу, в 2025 году была в Намибии и Танзании. Готовлюсь к восхождению на Килиманджаро в 2027." />
                </Field>
              </div>
            </>
          )}

          {tab === 'docs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Паспорт */}
              <div style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <window.Ic.document size={18} />
                    <b>Загранпаспорт</b>
                  </div>
                  <span style={{ background: 'var(--pa-green)', color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>АКТУАЛЕН</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>
                  Серия и номер: 75 №*** *** *** · Действует до: 03.2030
                </div>
                <button className="btn btn-sm btn-ghost" style={{ marginTop: 8 }}>
                  <window.Ic.eye size={12} /> Показать PDF
                </button>
              </div>

              {/* Активные визы */}
              <div className="cap" style={{ marginTop: 4 }}>Активные визы</div>
              {[
                { country: 'Намибия 🇳🇦',   type: 'Туристическая',     expires: '15.10.2026', status: 'active' },
                { country: 'Танзания 🇹🇿', type: 'Multiple entry',      expires: '02.08.2026', status: 'active' },
                { country: 'Кения 🇰🇪',     type: 'Туристическая',     expires: '18.04.2026', status: 'expired' },
              ].map((v, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 12, background: 'var(--color-surface-mute)', borderRadius: 8,
                }}>
                  <div>
                    <b>{v.country}</b> · <span style={{ color: 'var(--color-text-muted)' }}>{v.type}</span>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Действует до: {v.expires}
                    </div>
                  </div>
                  <span style={{
                    background: v.status === 'active' ? 'var(--pa-green)' : 'var(--pa-red)',
                    color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                  }}>
                    {v.status === 'active' ? 'АКТИВНА' : 'ИСТЕКЛА'}
                  </span>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                <window.Ic.upload size={13} /> Загрузить визу
              </button>
            </div>
          )}

          {tab === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="cap">Способы оплаты</div>
              {[
                { type: 'Visa',       num: '•••• 4242', exp: '08/28', primary: true },
                { type: 'Mastercard', num: '•••• 9120', exp: '02/27', primary: false },
                { type: 'SWIFT-перевод', num: 'Альфа-Банк', exp: 'верифицирован', primary: false },
              ].map((c, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 14, border: c.primary ? '2px solid var(--pa-green)' : '1px solid var(--color-border)', borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <window.Ic.card size={22} />
                    <div>
                      <b>{c.type}</b> · {c.num}
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.exp}</div>
                    </div>
                  </div>
                  {c.primary ? (
                    <span style={{ background: 'var(--pa-green)', color: 'white', padding: '2px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                      ОСНОВНОЙ
                    </span>
                  ) : (
                    <button className="btn btn-ghost btn-sm">Сделать основным</button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                <window.Ic.plus size={13} /> Добавить карту
              </button>
            </div>
          )}

          {tab === 'prefs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div className="cap" style={{ marginBottom: 10 }}>Туристические предпочтения</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Сафари', 'Пляж', 'Эко-туризм', 'Фототуризм', 'Гастрономия', 'Активный отдых', 'Культура', 'Шопинг'].map((t, i) => (
                    <button key={i} className={i < 4 ? 'btn btn-sm' : 'btn btn-sm btn-ghost'} style={i < 4 ? {
                      background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)', borderColor: 'var(--pa-green)',
                    } : {}}>
                      {i < 4 && '✓ '}{t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="cap" style={{ marginBottom: 10 }}>Питание</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Без ограничений', 'Вегетарианство', 'Веганство', 'Halal', 'Безглютеновая', 'Безлактозная'].map((t, i) => (
                    <button key={i} className={i === 1 ? 'btn btn-sm' : 'btn btn-sm btn-ghost'} style={i === 1 ? {
                      background: 'var(--pa-gold-light)', color: 'var(--pa-gold-mid)', borderColor: 'var(--pa-gold-mid)',
                    } : {}}>
                      {i === 1 && '✓ '}{t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="cap" style={{ marginBottom: 10 }}>Аллергии / медицинские особенности</div>
                <input className="input" defaultValue="Аллергия на арахис, лёгкая морская болезнь" />
              </div>

              <div>
                <div className="cap" style={{ marginBottom: 10 }}>Уровень комфорта</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Бэкпекер', 'Эконом', 'Стандарт', 'Премиум', 'Люкс'].map((t, i) => (
                    <button key={i} className={i === 3 ? 'btn btn-sm' : 'btn btn-sm btn-ghost'} style={i === 3 ? {
                      background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)', borderColor: 'var(--pa-green)',
                    } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'insurance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{
                padding: 16, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--pa-green-light), white)',
                border: '1px solid var(--pa-green)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pa-green)', letterSpacing: 0.5 }}>АКТИВНЫЙ ПОЛИС</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>AlfaStrah Travel · World</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Покрытие до $50 000 · мед.помощь · ковид · экстремальные виды
                    </div>
                  </div>
                  <button className="btn btn-sm btn-ghost">
                    <window.Ic.download size={12} /> PDF
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Полис №</div>
                    <b>AS-2026-***-9182</b>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Действует до</div>
                    <b>15.10.2026</b>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>SOS линия</div>
                    <b style={{ color: 'var(--pa-red)' }}>+7 (495) 788-09-99</b>
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
                <window.Ic.plus size={14} /> Добавить полис на поездку
              </button>

              {/* SOS-кнопка */}
              <div style={{
                padding: 16, background: 'var(--pa-red-light)', borderRadius: 12,
                borderLeft: '3px solid var(--pa-red)',
              }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>🆘 Экстренная помощь</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                  Свяжитесь с круглосуточной линией поддержки AfricaPortal или вашей страховой
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-danger" style={{ flex: 1 }}>
                    <window.Ic.phone size={14} /> AfricaPortal SOS
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1 }}>
                    <window.Ic.phone size={14} /> Страховая
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── /user/settings ─── */
function UserSettings() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Настройки</h1>
          <div className="page-sub">Уведомления, приватность, безопасность</div>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 720 }}>
        <div className="cap" style={{ marginBottom: 12 }}>Уведомления</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Email о новых турах в избранных направлениях', on: true },
            { label: 'Push о статусе бронирования',                 on: true },
            { label: 'SMS о подтверждении поездки',                 on: true },
            { label: 'Маркетинговая рассылка раз в неделю',         on: false },
          ].map((s, i) => (
            <label key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <span style={{ fontSize: 14 }}>{s.label}</span>
              <input type="checkbox" defaultChecked={s.on} style={{ accentColor: 'var(--pa-green)', width: 18, height: 18 }} />
            </label>
          ))}
        </div>

        <div className="cap" style={{ marginTop: 22, marginBottom: 12 }}>Безопасность</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <window.Ic.shield size={14} /> Изменить пароль
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <window.Ic.usercheck size={14} /> Двухфакторная аутентификация (выкл)
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <window.Ic.download size={14} /> Скачать мои данные (GDPR)
          </button>
        </div>

        <div className="cap" style={{ marginTop: 22, marginBottom: 12, color: 'var(--pa-red)' }}>Опасная зона</div>
        <button className="btn btn-danger btn-sm">Удалить аккаунт</button>
      </div>
    </>
  );
}

/* ─── UserShell ─── */
function UserShell({ page, onPage, theme, onTheme, currentRole, onRoleChange, openSpec }) {
  const PAGE_CRUMBS = {
    dashboard:     ['AfricaPortal', 'Личный кабинет', 'Главная'],
    favorites:     ['AfricaPortal', 'Личный кабинет', 'Избранное'],
    bookings:      ['AfricaPortal', 'Личный кабинет', 'Мои поездки'],
    messages:      ['AfricaPortal', 'Личный кабинет', 'Сообщения'],
    reviews:       ['AfricaPortal', 'Личный кабинет', 'Мои отзывы'],
    notifications: ['AfricaPortal', 'Личный кабинет', 'Уведомления'],
    profile:       ['AfricaPortal', 'Личный кабинет', 'Профиль'],
    settings:      ['AfricaPortal', 'Личный кабинет', 'Настройки'],
  };

  return (
    <div className="shell">
      <Sidebar
        nav={USER_NAV}
        active={page}
        onNav={onPage}
        theme={theme}
        onTheme={onTheme}
      />
      <div className="shell-main">
        <Topbar
          crumbs={PAGE_CRUMBS[page] || ['Личный кабинет']}
          user={{ name: 'Мария Иванова', role: 'ПУТЕШЕСТВЕННИК' }}
          extras={<span className="role-chip" style={{ background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)' }}>TRAVELER</span>}
          currentRole={currentRole}
          onRoleChange={onRoleChange}
          openSpec={openSpec}
        />
        <main className="shell-content fade-in" key={page}>
          {page === 'dashboard'     && <UserDashboard onPage={onPage} />}
          {page === 'favorites'     && <UserFavorites onPage={onPage} />}
          {page === 'bookings'      && <UserBookings  onPage={onPage} />}
          {page === 'messages'      && <UserMessages />}
          {page === 'reviews'       && <UserReviews />}
          {page === 'notifications' && <UserNotifications />}
          {page === 'profile'       && <UserProfile />}
          {page === 'settings'      && <UserSettings />}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { UserShell });

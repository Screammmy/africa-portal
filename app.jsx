/* eslint-disable */
/**
 * AfricaPortal — App root.
 * Wires role, theme, page, moderation modal, and Tweaks panel.
 */
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "white",
  "role": "admin",
  "lang": "ru"
}/*EDITMODE-END*/;

function ModerationModal({ item, action, onClose }) {
  const [note, setNote] = useState('');
  if (!item) return null;

  const title = action === 'approve'
    ? 'Одобрить объект?'
    : action === 'reject'
      ? 'Отклонить объект?'
      : 'Детали объекта';

  const isView = action === 'view';

  return (
    <window.Modal
      open
      onClose={onClose}
      title={title}
      foot={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Отмена</button>
          {action === 'approve' && (
            <button className="btn" style={{ background: 'var(--pa-green)', color: 'white' }} onClick={onClose}>
              <window.Ic.check size={14} /> Одобрить и опубликовать
            </button>
          )}
          {action === 'reject' && (
            <button className="btn btn-danger" onClick={onClose}>
              <window.Ic.x size={14} /> Отклонить
            </button>
          )}
          {isView && (
            <>
              <button className="btn btn-secondary" onClick={onClose}>Запросить изменения</button>
              <button className="btn" style={{ background: 'var(--pa-green)', color: 'white' }} onClick={onClose}>
                Одобрить
              </button>
            </>
          )}
        </>
      }
    >
      <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 12,
          backgroundImage: `url(${item.cover})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          flexShrink: 0,
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {item.listingName}
            {item.stars && (
              <span style={{ color: 'var(--pa-gold)', fontSize: 14 }}>
                {'★'.repeat(item.stars)}
              </span>
            )}
            {item.classLabel && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999,
                background: 'var(--pa-gold-light)', color: 'var(--pa-gold-mid)',
              }}>
                {item.classLabel}
              </span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Партнёр: <b style={{ color: 'var(--color-text)' }}>{item.partner}</b>
          </div>
          {item.location && (
            <div style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
              📍 {item.location}
            </div>
          )}
          {item.ai && <div style={{ marginTop: 6 }}><window.AiChip score={item.ai} /></div>}
        </div>
      </div>

      {(item.avgPrice || item.rooms || item.duration) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 8,
          padding: 12,
          background: 'var(--color-surface-mute)',
          borderRadius: 10,
          marginBottom: 14,
        }}>
          {item.avgPrice && (
            <div>
              <div className="cap" style={{ fontSize: 10 }}>Средний чек</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--pa-green)' }}>{item.avgPrice}</div>
            </div>
          )}
          {item.rooms && (
            <div>
              <div className="cap" style={{ fontSize: 10 }}>Номеров</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{item.rooms}</div>
            </div>
          )}
          {item.duration && (
            <div>
              <div className="cap" style={{ fontSize: 10 }}>Длительность</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{item.duration}</div>
            </div>
          )}
        </div>
      )}

      {isView && item.infrastructure && (
        <div style={{ marginBottom: 14 }}>
          <div className="cap" style={{ marginBottom: 6 }}>Инфраструктура / Включено</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.infrastructure.map((inf, i) => (
              <span key={i} style={{
                fontSize: 12, padding: '4px 10px', borderRadius: 999,
                background: 'var(--pa-green-light)', color: 'var(--pa-green-dark)',
              }}>
                {inf}
              </span>
            ))}
          </div>
        </div>
      )}

      {isView && item.contacts && (
        <div style={{ marginBottom: 14 }}>
          <div className="cap" style={{ marginBottom: 6 }}>Контакты</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
            {item.contacts.phone && <div>📞 <b>{item.contacts.phone}</b></div>}
            {item.contacts.email && <div>✉️ {item.contacts.email}</div>}
            {item.contacts.site && <div>🌐 {item.contacts.site}</div>}
          </div>
        </div>
      )}

      {isView && item.booking && (
        <div style={{
          marginBottom: 14,
          padding: 12,
          background: 'var(--pa-gold-light)',
          borderLeft: '3px solid var(--pa-gold)',
          borderRadius: 6,
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          <div className="cap" style={{ marginBottom: 4 }}>Условия бронирования</div>
          {item.booking}
        </div>
      )}

      {action === 'reject' && (
        <>
          <div className="cap" style={{ marginBottom: 6 }}>Причина отклонения</div>
          <div className="filter-pills" style={{ marginBottom: 10 }}>
            <button onClick={() => setNote('Недостаточно фотографий — минимум 3 шт.')}>Мало фото</button>
            <button onClick={() => setNote('Описание не соответствует объекту')}>Описание</button>
            <button onClick={() => setNote('Отсутствует лицензия NTB')}>Документы</button>
            <button onClick={() => setNote('Контент содержит ошибки/несоответствия')}>Контент</button>
          </div>
        </>
      )}

      {!isView && (
        <>
          <div className="cap" style={{ marginBottom: 6 }}>
            {action === 'approve' ? 'Комментарий для партнёра (опционально)' : 'Комментарий модератора *'}
          </div>
          <textarea
            className="textarea"
            rows={3}
            placeholder={action === 'approve' ? 'Объект отлично подходит для платформы!' : 'Поясните партнёру, что нужно исправить...'}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </>
      )}

      {isView && (
        <div style={{ marginTop: 14 }}>
          <div className="cap" style={{ marginBottom: 8 }}>История изменений</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <TimelineRow time="20 мая, 14:32" text="Объект отправлен на модерацию" />
            <TimelineRow time="20 мая, 14:36" text="AI-проверка: безопасно" />
            <TimelineRow time="20 мая, 15:02" text="Назначен модератор: Айкуй Мунги" />
          </div>
        </div>
      )}
    </window.Modal>
  );
}

function TimelineRow({ time, text }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pa-green)', marginTop: 6, flexShrink: 0 }} />
      <div>
        <div>{text}</div>
        <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>{time}</div>
      </div>
    </div>
  );
}

/* ─── Спецификация каркаса портала ─── ТЗ Лист 1+3.
   Карта функционала: что реализовано / частично / не реализовано.
   Каждый пункт имеет:
     name   — название
     status — done | partial | planned
     desc   — что делает фича / бизнес-логика
     where  — где посмотреть в прототипе (раздел/URL/действие)
     tech   — как устроено (файлы, ключевые компоненты, источники данных). */
const SPEC_GROUPS = [
  {
    title: 'Публичный портал',
    icon: 'globe',
    items: [
      { name: 'Главный лендинг + Hero + поиск', status: 'done',
        desc: 'Первый экран портала с фоновым фото региона (Серенгети/Этоша/Занзибар/Сахара), слоганом и центральной строкой поиска.',
        where: 'Лендинг / Hero → переключатель фото через Tweaks-панель (правый-нижний угол).',
        tech: 'landing.jsx → <Hero/>; фон выбирается параметром heroPhoto из TWEAK_DEFAULTS.' },
      { name: 'Иерархия направлений (Континент→Регион→Страна→Область)', status: 'done',
        desc: '4-уровневый каскадный каталог направлений — выбираешь континент, видишь регионы, страны, конкретные области.',
        where: 'Лендинг → секция "Каталог направлений". Меняй select-боксы — обновляется флаг и список областей.',
        tech: 'DEST_TREE в landing.jsx; <DestinationsTree/> рендерит 4 колонки с зависимыми селектами.' },
      { name: 'Категории туров (6 видов)', status: 'done',
        desc: 'Сафари / Пляжи / Культура / Пустыня / Восхождения / Гастрономия — карточки с количеством туров.',
        where: 'Лендинг → секция "Какой будет ваша Африка?".',
        tech: 'CATEGORIES в landing.jsx; раскраска через linear-gradient (--cat-bg).' },
      { name: 'Готовые маршруты (Routes)', status: 'done',
        desc: '4 готовых маршрута на 7–10 дней с точками, бюджетом и тегами. Клик открывает детализацию по дням.',
        where: 'Лендинг → секция "Маршруты".',
        tech: 'ROUTES в landing.jsx; <Routes/> + <RouteDetailsModal/>.' },
      { name: 'Каталог объектов (Featured)', status: 'done',
        desc: 'Featured-объекты с фото, рейтингом, ценой и тегами (Featured/Honeymoon/Популярное).',
        where: 'Лендинг → секция "Избранные объекты".',
        tech: 'FEATURED в landing.jsx; <Featured/>.' },
      { name: 'Каталог еды #FOOD', status: 'done',
        desc: 'Локальные рестораны, уличная еда, fine dining. Карточка содержит кухню, средний чек, фирменное блюдо, часы работы.',
        where: 'Лендинг → секция "#FOOD · Гастрономия". Клик по карточке — модал с меню.',
        tech: 'FOOD_PLACES в data.jsx; <FoodCatalog/> в landing.jsx; модал <PlaceDetailsModal type="food"/>.' },
      { name: 'Активности #ACTIVITIES', status: 'done',
        desc: 'Сафари, восхождения, дайвинг, верблюды в дюнах. Сложность (Лёгкая/Средняя/Сложная), длительность, сезон, цена.',
        where: 'Лендинг → секция "#ACTIVITIES · Активности".',
        tech: 'ACTIVITY_LIST в data.jsx; <ActivitiesCatalog/>.' },
      { name: 'Шопинг #SHOPING', status: 'done',
        desc: 'Базары, ремесла, дизайн-студии. Цена ($/$$/$$$), что брать, часы работы.',
        where: 'Лендинг → секция "#SHOPING · Шопинг".',
        tech: 'SHOPING_LIST в data.jsx; <ShopingCatalog/>.' },
      { name: 'Сезонный календарь #Season', status: 'done',
        desc: 'Помесячная карта-светофор по 6 странам: зелёный — отлично, жёлтый — допустимо, красный — лучше отложить.',
        where: 'Лендинг → секция "Сезонный календарь".',
        tech: 'SEASON_DATA в data.jsx; <SeasonCalendar/>.' },
      { name: 'Конструктор маршрута', status: 'done',
        desc: 'Пошаговая форма: страна → дни (3–14) → бюджет → активности → собирает индивидуальный маршрут с оценкой стоимости.',
        where: 'Лендинг → секция "Построй свой маршрут".',
        tech: '<RouteBuilder/> в landing.jsx; алгоритм собирает точки из ROUTES + случайные POI.' },
      { name: 'Практическая информация (визы/перелёты)', status: 'done',
        desc: 'Карточки по 5 темам: визы, перелёты, климат, безопасность, деньги.',
        where: 'Лендинг → секция "Перед поездкой".',
        tech: 'PRACTICAL в landing.jsx; <PracticalInfo/>.' },
      { name: 'Фотогалерея', status: 'done',
        desc: 'Сетка фото по локациям с подписями.',
        where: 'Лендинг → секция "Африка в кадре".',
        tech: 'GALLERY в landing.jsx; <Gallery/>.' },
      { name: 'Блог + Гид редакции', status: 'done',
        desc: 'Статьи редакции с обложками и тегами.',
        where: 'Лендинг → секция "Блог". В админке /admin/blog — управление.',
        tech: 'BLOG_POSTS в data.jsx; <Blog/> + <AdminBlog/>.' },
      { name: 'Отзывы туристов (Testimonials)', status: 'done',
        desc: 'Отзывы реальных путешественников: имя, город, текст. Один — feature-карточка.',
        where: 'Лендинг → секция "Отзывы наших путешественников".',
        tech: 'TESTIMONIALS в landing.jsx.' },
      { name: 'PWA / offline-режим', status: 'planned',
        desc: 'Будет: установка на главный экран смартфона, кеш карточек на офлайн.',
        where: '—',
        tech: 'Запланировано: service worker + manifest.json + workbox.' },
      { name: 'Видео-секция #Shorts', status: 'partial',
        desc: 'YouTube-импорт уже работает в Интеграциях; отдельная видео-лента на лендинге — не сделана.',
        where: 'Админка → Интеграции → YouTube (карточка с импортом).',
        tech: 'INTEGRATIONS.youtube в data.jsx. Лента <ShortsReel/> — TODO.' },
    ],
  },
  {
    title: 'GIS — модуль карты',
    icon: 'map',
    items: [
      { name: 'Leaflet + OpenStreetMap', status: 'done',
        desc: 'Живая карта на основе open-source библиотеки Leaflet с тайлами OSM.',
        where: 'Админка → Карта (GIS).',
        tech: 'admin.jsx → <AdminMap/>; CDN: leaflet@1.9.4 + markercluster@1.5.3.' },
      { name: 'Кластеризация POI', status: 'done',
        desc: 'Близкие точки автоматически группируются в кластеры с цифрой; разжимаются при zoom.',
        where: 'Карта (GIS) → попробуй увеличить/уменьшить карту.',
        tech: 'L.markerClusterGroup с цветным divIcon на слой.' },
      { name: 'Слои (lodging/parks/routes/roads/POI)', status: 'done',
        desc: '5 цветных слоёв включаются чек-боксами; своя палитра у каждого (красный/зелёный/золото/коричневый/чёрный).',
        where: 'Карта (GIS) → левая панель управления.',
        tech: 'LAYER_DEFS + window.MAP_POIS; clustersRef хранит кластер на каждый слой.' },
      { name: 'Поиск в радиусе (км)', status: 'done',
        desc: 'Указывается центр и радиус — на карте рисуется круг, считается сколько POI внутри.',
        where: 'Карта (GIS) → блок "Радиус поиска".',
        tech: 'map.distance() — расстояние в метрах между центром и каждой точкой.' },
      { name: 'Маршрут A→B (Nominatim)', status: 'done',
        desc: 'Вводишь два названия места — геокодер OSM Nominatim определяет координаты, рисуется ломаная.',
        where: 'Карта (GIS) → блок "Маршрут".',
        tech: 'fetch к nominatim.openstreetmap.org + L.polyline золотым пунктиром.' },
      { name: 'Геолокация «Я здесь»', status: 'done',
        desc: 'Браузер запрашивает разрешение на геолокацию, центр карты переезжает к пользователю.',
        where: 'Карта (GIS) → кнопка "Я здесь".',
        tech: 'navigator.geolocation.getCurrentPosition + map.setView.' },
      { name: 'Экспорт GeoJSON', status: 'done',
        desc: 'Все видимые POI на карте экспортируются в стандартный формат GeoJSON для CAD/ГИС.',
        where: 'Карта (GIS) → кнопка "Экспорт GeoJSON" → скачается .geojson.',
        tech: 'FeatureCollection builder + blob URL для скачивания.' },
      { name: 'Загрузка слоёв в формате SHP', status: 'planned',
        desc: 'Импорт ESRI Shapefile (геоданные в индустриальном формате).',
        where: '—',
        tech: 'Планируется: shpjs library или backend-конвертер.' },
    ],
  },
  {
    title: 'Карточки и атрибуты (ТЗ Лист 1)',
    icon: 'briefcase',
    items: [
      { name: 'Объекты размещения (отель/лодж/гестхаус)', status: 'done',
        desc: 'Карточка содержит звёздность, класс (Лодж/Вилла/Гестхаус), AI-скор, цену, рейтинг, контакты, условия бронирования.',
        where: 'Админка → Объекты или модал в Дашборде.',
        tech: 'LISTINGS в data.jsx; <AdminObjects/> + <ModerationModal/>.' },
      { name: 'Гиды — лицензии, языки, специализация', status: 'done',
        desc: 'Фото, имя, лицензия (KWS/NTB/ONMT/TANAPA), языки, регионы работы, ставка, опыт, рейтинг.',
        where: 'Лендинг → секция "Локальные гиды". Клик по карточке — полный профиль.',
        tech: 'GUIDES в data.jsx; <GuidesCatalog/> + <GuideProfileModal/>.' },
      { name: 'Туркомпании — лицензия NTB, тарифы', status: 'done',
        desc: 'Логотип, год основания, лицензия, услуги, 3 тарифа (Economy/Standard/Premium), страхование, способы оплаты, рейтинг.',
        where: 'Лендинг → секция "Локальные операторы". Клик — модал-профиль компании.',
        tech: 'TOURCOMPANIES в data.jsx; <TourCompaniesCatalog/> + <CompanyProfileModal/>.' },
      { name: 'Природные парки', status: 'done',
        desc: 'Слой на GIS-карте; включены 5 парков Намибии: Этоша, Соссусфлей, Скелетный берег, Каприви, Дамараленд.',
        where: 'Карта (GIS) → включи слой "Природные парки".',
        tech: 'MAP_POIS[layer="parks"] в data.jsx.' },
      { name: 'Достопримечательности (POI)', status: 'done',
        desc: 'Точки интереса (POI) — общий слой для нелодж/нероутов: водопады, музеи, обзорные площадки.',
        where: 'Карта (GIS) → слой "POI".',
        tech: 'MAP_POIS[layer="poi"].' },
      { name: 'Маршруты — точки/дни/бюджет', status: 'done',
        desc: 'У готового маршрута фиксированный набор точек, число дней и стартовый бюджет.',
        where: 'Лендинг → секция "Маршруты" → клик "Подробнее".',
        tech: 'ROUTES в landing.jsx + <RouteDetailsModal/>.' },
    ],
  },
  {
    title: 'Личный кабинет туриста',
    icon: 'user',
    items: [
      { name: 'Дашборд + статистика поездок', status: 'done',
        desc: 'Сводка: количество поездок, страны, отзывы, статус ближайшей брони.',
        where: 'Переключи роль на "Путешественник" в Topbar → раздел "Главная".',
        tech: 'user.jsx → <UserDashboard/>.' },
      { name: 'Избранное', status: 'done',
        desc: 'Карточки объектов, добавленные в "сердечко". Клик — переход к объекту.',
        where: 'Кабинет туриста → "Избранное".',
        tech: '<UserFavorites/>.' },
      { name: 'Брони (история+активные)', status: 'done',
        desc: '7 тестовых броней с разными статусами: оплачено, ожидает, отменено.',
        where: 'Кабинет туриста → "Мои поездки".',
        tech: 'USER_BOOKINGS в data.jsx; <UserBookings/> с <BookingRow/>.' },
      { name: 'Сообщения с партнёрами', status: 'done',
        desc: 'Двухпанельный чат: список переписок слева, сообщения справа.',
        where: 'Кабинет туриста → "Сообщения".',
        tech: 'USER_THREADS в data.jsx; <UserMessages/>.' },
      { name: 'Мои отзывы + ответ партнёра', status: 'done',
        desc: 'Отзывы, которые турист оставил, и публичный ответ партнёра.',
        where: 'Кабинет туриста → "Мои отзывы".',
        tech: 'MY_REVIEWS.partnerReply в data.jsx; <UserReviews/>.' },
      { name: 'Уведомления', status: 'done',
        desc: '7 уведомлений: статусы броней, новые отзывы, акции, маркетинг.',
        where: 'Кабинет туриста → "Уведомления".',
        tech: 'USER_NOTIFS в data.jsx; <UserNotifications/>.' },
      { name: 'Профиль и настройки', status: 'done',
        desc: 'Личные данные, документы/визы, способы оплаты, привычки питания, экстренные контакты, страховка.',
        where: 'Кабинет туриста → "Профиль".',
        tech: '<UserProfile/> + <UserSettings/>.' },
      { name: 'Документы / визы', status: 'done',
        desc: 'Раздел внутри профиля: паспорт, текущие визы, страховой полис, дата истечения.',
        where: 'Кабинет туриста → "Профиль" → вкладка "Документы".',
        tech: '<UserProfile/> tab=docs.' },
    ],
  },
  {
    title: 'Кабинет партнёра',
    icon: 'store',
    items: [
      { name: 'Дашборд (выручка/лиды)', status: 'done',
        desc: 'KPI партнёра: выручка за месяц, новые лиды, средний чек, конверсия.',
        where: 'Роль "Партнёр" → "Обзор".',
        tech: 'partner.jsx → <PartnerDashboard/>.' },
      { name: 'Объекты партнёра', status: 'done',
        desc: 'Список объектов партнёра, кнопка "Новый объект" — пошаговая форма.',
        where: 'Кабинет партнёра → "Мои объекты".',
        tech: '<PartnerListings/> + <PartnerListingNew/>.' },
      { name: 'Лиды и сделки', status: 'done',
        desc: 'CRM: лиды по статусам — новый/в работе/закрыт/конвертирован.',
        where: 'Кабинет партнёра → "Лиды & CRM".',
        tech: 'RECENT_LEADS в data.jsx; <PartnerLeads/>.' },
      { name: 'Финансы', status: 'done',
        desc: 'История платежей по подписке + графики выручки.',
        where: 'Кабинет партнёра → "Аналитика" / "Подписка".',
        tech: 'BILLING_HISTORY в data.jsx; <PartnerSubscription/>.' },
      { name: 'Профиль и верификация', status: 'done',
        desc: 'Юр.лицо, лицензии, банк. реквизиты, команда, история платежей.',
        where: 'Кабинет партнёра → "Профиль".',
        tech: '<PartnerProfile/> с 5 вкладками.' },
      { name: 'Ответ на отзывы клиентов', status: 'done',
        desc: 'Модерация отзывов на стороне партнёра + публичный ответ.',
        where: 'Кабинет партнёра → "Отзывы".',
        tech: '<PartnerReviews/>.' },
    ],
  },
  {
    title: 'Админ-панель',
    icon: 'shield',
    items: [
      { name: 'Дашборд + Аналитика', status: 'done',
        desc: 'Главный экран супер-админа: метрики, очередь модерации, активность партнёров, графики трафика.',
        where: 'Админка → "Дашборд" / "Аналитика".',
        tech: '<AdminDashboard/> + <AdminAnalytics/>.' },
      { name: 'Объекты + модерация', status: 'done',
        desc: 'Таблица всех объектов, фильтры, batch-actions, AI-чип скоринга, модал модерации (одобрить/отклонить/попросить правки).',
        where: 'Админка → "Объекты".',
        tech: '<AdminObjects/> + <ModerationModal/>.' },
      { name: 'Партнёры', status: 'done',
        desc: 'Список партнёров: верификация, подписка, кол-во объектов, выручка.',
        where: 'Админка → "Партнёры".',
        tech: 'PARTNERS в data.jsx; <AdminPartners/>.' },
      { name: 'Отзывы (модерация + критерии)', status: 'done',
        desc: 'Отзывы с детальными критериями (чистота/сервис/еда/локация/цена-качество), модерация.',
        where: 'Админка → "Отзывы".',
        tech: 'REVIEWS в data.jsx; <AdminReviews/>.' },
      { name: 'Реклама / баннеры', status: 'done',
        desc: 'Управление рекламными кампаниями партнёров с CTR, кликами и бюджетом.',
        where: 'Админка → "Реклама".',
        tech: 'ADS_LIST в data.jsx; <AdminAdsPage/>.' },
      { name: 'Подписки партнёров (тарифы)', status: 'done',
        desc: 'MRR, активные/просроченные подписки, тарифы Free/Standard/Pro/Premium.',
        where: 'Админка → "Подписки".',
        tech: 'SUBSCRIPTIONS_LIST + SUBSCRIPTION_PLANS; <AdminSubsPage/>.' },
      { name: 'Пользователи и роли', status: 'done',
        desc: '8 ролей с разным уровнем доступа, таблица 8 тестовых пользователей с фильтрацией.',
        where: 'Админка → "Все юзеры".',
        tech: 'PORTAL_USERS + ROLE_DEFS; <AdminUsers/>.' },
      { name: 'Верификация партнёров', status: 'done',
        desc: 'Очередь партнёров на проверку документов и лицензий.',
        where: 'Админка → "Верификация".',
        tech: '<AdminStub/> с очередью (TODO: расширить до полного модуля).' },
      { name: 'Карта (GIS)', status: 'done',
        desc: 'Полноценная карта на Leaflet — см. секцию "GIS".',
        where: 'Админка → "Карта (GIS)".',
        tech: 'См. секцию GIS выше.' },
      { name: 'Министерства / Посольства / Праздники', status: 'done',
        desc: '3 справочника: мин. туризма, посольства РФ, нац. праздники по странам.',
        where: 'Админка → "Министерства" / "Посольства" / "Календарь".',
        tech: 'MINISTRIES/EMBASSIES/HOLIDAYS в data.jsx.' },
      { name: 'Блог-редакция', status: 'done',
        desc: 'CMS для блога: статусы черновик/опубликовано, обложка, теги.',
        where: 'Админка → "Блог".',
        tech: '<AdminBlog/>.' },
      { name: 'Настройки портала', status: 'done',
        desc: 'Системные параметры: бренд, валюты, языки, SEO, integrations-keys.',
        where: 'Админка → "Настройки".',
        tech: '<AdminSettings/>.' },
      { name: 'Интеграции с порталами (Sync)', status: 'done',
        desc: '8 интеграций: Google Reviews, TripAdvisor, Booking.com, IG, FB, YouTube, Telegram, WhatsApp. Имитация синка с прогресс-баром.',
        where: 'Админка → "Интеграции". Кнопка "Синхронизировать" на любой подключённой.',
        tech: 'INTEGRATIONS в data.jsx; <AdminIntegrations/>. setInterval имитирует прогресс.' },
      { name: 'Профиль администратора', status: 'done',
        desc: 'Личные данные, 2FA, журнал активности, права, API-ключи.',
        where: 'Админка → "Мой профиль".',
        tech: '<AdminProfile/>.' },
    ],
  },
  {
    title: 'Интеграции и синхронизация',
    icon: 'plug',
    items: [
      { name: 'Google Reviews — импорт', status: 'partial',
        desc: 'UI и mock-синхронизация работают (счётчики растут, прогресс-бар).',
        where: 'Админка → "Интеграции" → карточка Google.',
        tech: 'Реальный API Google Places потребует ключа и серверной части — в прототипе имитация.' },
      { name: 'TripAdvisor — импорт', status: 'partial',
        desc: 'Аналогично Google: имитация синка отзывов и фото.',
        where: 'Админка → "Интеграции" → карточка TA.',
        tech: 'TripAdvisor Content API — требуется ключ и серверная часть.' },
      { name: 'Booking.com — импорт объектов', status: 'partial',
        desc: 'Mock-импорт каталога и цен.',
        where: 'Админка → "Интеграции" → Booking.',
        tech: 'Booking Connectivity Partner API.' },
      { name: 'Соцсети (Instagram/Facebook)', status: 'partial',
        desc: 'Импорт фотогалерей по hashtag, статус "Ожидает ключа".',
        where: 'Админка → "Интеграции" → IG/FB.',
        tech: 'Meta Graph API; OAuth2.' },
      { name: 'YouTube — видео-контент', status: 'partial',
        desc: 'Импорт видео-туров по каналам партнёров.',
        where: 'Админка → "Интеграции" → YouTube.',
        tech: 'YouTube Data API v3.' },
      { name: 'Telegram Bot — уведомления', status: 'planned',
        desc: 'Push-уведомления туристам через бота: статусы броней, акции.',
        where: '—',
        tech: 'Telegram Bot API + webhook на сервере.' },
    ],
  },
  {
    title: 'Платформа и инфраструктура',
    icon: 'settings',
    items: [
      { name: 'Темы: белая / зелёная / золотая / ночная', status: 'done',
        desc: '4 палитры, переключаются в Tweaks-панели и в Sidebar.',
        where: 'Tweaks (правый-нижний угол) → "Тема".',
        tech: 'styles.css → data-theme; CSS variables меняются.' },
      { name: 'Мультиязык (RU/EN/FR)', status: 'partial',
        desc: 'В Tweaks доступен переключатель языка, document.lang меняется. Реальная локализация строк — TODO.',
        where: 'Tweaks → "Язык интерфейса".',
        tech: 'Tweak setTweak("lang"). Локализационные словари — TODO.' },
      { name: 'Ролевая модель (admin / partner / user)', status: 'done',
        desc: 'Переключение между 4 ролями (admin / partner / partner_pending / user) одним кликом в Topbar.',
        where: 'Topbar → переключатель ролей.',
        tech: 'app.jsx → state t.role; разные Shell на каждую роль.' },
      { name: 'Tweaks-панель Claude Design', status: 'done',
        desc: 'Правая нижняя панель — настройки прототипа: тема, роль, язык, фото Hero.',
        where: 'Правый-нижний угол любого экрана.',
        tech: 'tweaks-panel.jsx → <TweaksPanel/>.' },
      { name: 'Адаптивный sidebar', status: 'done',
        desc: 'Скрывается на узких экранах, остаётся иконками.',
        where: 'Уменьши окно браузера.',
        tech: 'styles.css → media-query на .sidebar.' },
      { name: 'Pan-African визуальный стиль', status: 'done',
        desc: 'Полоса 4-цветов (красный/чёрный/зелёный/золотой) как фирменная стилистика портала.',
        where: 'На каждой странице — тонкая 4-цветная полоса под топ-баром.',
        tech: '<PaStripe/> + .pa-stripe в styles.css.' },
      { name: 'Иконки Lucide', status: 'done',
        desc: 'Используется библиотека Lucide (форк Feather, применяется в shadcn/ui, Linear, Vercel).',
        where: 'Все иконки в админке/UI.',
        tech: 'data.jsx → LUCIDE_MAP + <LucideSvg/>; CDN unpkg/jsdelivr.' },
    ],
  },
];

function SpecificationModal({ open, onClose }) {
  const [openItem, setOpenItem] = useState(null); // "groupIdx:itemIdx" или null
  const [filter, setFilter]     = useState('all'); // all | done | partial | planned

  if (!open) return null;

  const allItems = SPEC_GROUPS.flatMap(g => g.items);
  const done    = allItems.filter(i => i.status === 'done').length;
  const partial = allItems.filter(i => i.status === 'partial').length;
  const planned = allItems.filter(i => i.status === 'planned').length;
  const total   = allItems.length;
  const pctDone = Math.round((done / total) * 100);

  const STATUS_CFG = {
    done:    { label: 'Готово',     color: 'var(--pa-green)',     bg: 'rgba(46,125,50,.10)',  icon: '✓' },
    partial: { label: 'Частично',   color: 'var(--pa-gold-mid)',  bg: 'rgba(245,200,66,.18)', icon: '◐' },
    planned: { label: 'В планах',   color: 'var(--pa-red)',        bg: 'rgba(211,47,47,.10)',  icon: '○' },
  };

  return (
    <window.Modal
      open
      onClose={onClose}
      title="Спецификация каркаса AfricaPortal"
      size="lg"
      foot={
        <>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--color-text-muted)' }}>
            Карта функционала по ТЗ · обновлено 25.05.2026
          </span>
          <button className="btn btn-secondary" onClick={onClose}>Закрыть</button>
        </>
      }
    >
      {/* Сводный прогресс */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16,
      }}>
        <div style={{ padding: 12, background: 'var(--color-surface-mute)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--pa-green)' }}>{pctDone}%</div>
          <div className="cap" style={{ marginTop: 2 }}>Готовность</div>
        </div>
        <div style={{ padding: 12, background: STATUS_CFG.done.bg, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: STATUS_CFG.done.color }}>{done}</div>
          <div className="cap" style={{ marginTop: 2 }}>Готово</div>
        </div>
        <div style={{ padding: 12, background: STATUS_CFG.partial.bg, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: STATUS_CFG.partial.color }}>{partial}</div>
          <div className="cap" style={{ marginTop: 2 }}>Частично</div>
        </div>
        <div style={{ padding: 12, background: STATUS_CFG.planned.bg, borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: STATUS_CFG.planned.color }}>{planned}</div>
          <div className="cap" style={{ marginTop: 2 }}>В планах</div>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div style={{
        height: 8, borderRadius: 4, overflow: 'hidden',
        background: 'var(--color-border)', marginBottom: 14, display: 'flex',
      }}>
        <div style={{ width: `${(done / total) * 100}%`,    background: 'var(--pa-green)' }} />
        <div style={{ width: `${(partial / total) * 100}%`, background: 'var(--pa-gold-mid)' }} />
        <div style={{ width: `${(planned / total) * 100}%`, background: 'var(--pa-red)' }} />
      </div>

      {/* Фильтры по статусу */}
      <div className="tabs" style={{ marginBottom: 14 }}>
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Все ({total})</button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
          ✓ Готово ({done})
        </button>
        <button className={filter === 'partial' ? 'active' : ''} onClick={() => setFilter('partial')}>
          ◐ Частично ({partial})
        </button>
        <button className={filter === 'planned' ? 'active' : ''} onClick={() => setFilter('planned')}>
          ○ В планах ({planned})
        </button>
      </div>

      <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginBottom: 10 }}>
        Клик по пункту раскрывает блок с описанием логики, где посмотреть в прототипе и как устроено.
      </div>

      {/* Группы функционала */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SPEC_GROUPS.map((g, gi) => {
          const filteredItems = filter === 'all' ? g.items : g.items.filter(i => i.status === filter);
          if (filteredItems.length === 0) return null;
          const GIc = window.Ic[g.icon] || window.Ic.dashboard;
          return (
            <div key={gi} style={{
              border: '1px solid var(--color-border)', borderRadius: 10, overflow: 'hidden',
            }}>
              <div style={{
                padding: '10px 14px',
                background: 'var(--color-surface-mute)',
                fontSize: 13, fontWeight: 700,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GIc size={16} />
                  {g.title}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: 12 }}>
                  {g.items.filter(i => i.status === 'done').length} / {g.items.length}
                </span>
              </div>
              <div style={{ padding: 6 }}>
                {filteredItems.map((it, ii) => {
                  const cfg = STATUS_CFG[it.status];
                  const key = `${gi}:${g.items.indexOf(it)}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={ii} style={{
                      borderRadius: 6,
                      background: isOpen ? 'var(--color-surface-mute)' : 'transparent',
                      transition: 'background .15s',
                    }}>
                      <div
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 10px', cursor: 'pointer',
                          fontSize: 12.5,
                        }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 5,
                          background: cfg.bg, color: cfg.color,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                        }}>{cfg.icon}</span>
                        <span style={{ flex: 1, minWidth: 0, fontWeight: isOpen ? 600 : 400 }}>{it.name}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 999,
                          background: cfg.bg, color: cfg.color, fontWeight: 700,
                        }}>{cfg.label}</span>
                        <span style={{
                          fontSize: 10, color: 'var(--color-text-muted)',
                          transition: 'transform .15s',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        }}>▾</span>
                      </div>
                      {isOpen && (
                        <div style={{
                          padding: '8px 12px 14px 38px',
                          borderTop: '1px dashed var(--color-border)',
                          fontSize: 12.5, lineHeight: 1.55,
                          display: 'flex', flexDirection: 'column', gap: 8,
                        }}>
                          {it.desc && (
                            <div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>Что делает</span>
                              <div style={{ marginTop: 2 }}>{it.desc}</div>
                            </div>
                          )}
                          {it.where && (
                            <div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--pa-green-dark)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Где посмотреть</span>
                              <div style={{ marginTop: 2 }}>{it.where}</div>
                            </div>
                          )}
                          {it.tech && (
                            <div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Как устроено</span>
                              <div style={{
                                marginTop: 2,
                                fontFamily: 'SFMono-Regular, Consolas, Monaco, monospace',
                                fontSize: 11.5,
                                background: 'var(--color-surface)',
                                padding: '4px 8px', borderRadius: 4,
                                border: '1px solid var(--color-border)',
                                display: 'inline-block',
                              }}>{it.tech}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </window.Modal>
  );
}

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = t.theme === 'white' ? '' : t.theme;
  }, [t.theme]);

  // Page state per role
  const [adminPage, setAdminPage] = useState('dashboard');
  const [partnerPage, setPartnerPage] = useState('dashboard');
  const [userPage, setUserPage] = useState('dashboard');

  // Reset to dashboard when role switches
  useEffect(() => {
    if (t.role === 'admin') setAdminPage('dashboard');
    else if (t.role === 'user') setUserPage('dashboard');
    else setPartnerPage('dashboard');
  }, [t.role]);

  // Применяем язык на <html lang="">
  useEffect(() => {
    document.documentElement.lang = t.lang || 'ru';
  }, [t.lang]);

  // Moderation modal state
  const [modalState, setModalState] = useState(null);
  const openModeration = (item, action) => setModalState({ item, action });
  const closeModeration = () => setModalState(null);

  // Спецификация каркаса
  const [specOpen, setSpecOpen] = useState(false);

  return (
    <div className="app-root">
      {t.role === 'admin' && (
        <window.AdminShell
          page={adminPage}
          onPage={setAdminPage}
          theme={t.theme}
          onTheme={(v) => setTweak('theme', v)}
          openModeration={openModeration}
          currentRole={t.role}
          onRoleChange={(v) => setTweak('role', v)}
          openSpec={() => setSpecOpen(true)}
        />
      )}
      {t.role === 'user' && (
        <window.UserShell
          page={userPage}
          onPage={setUserPage}
          theme={t.theme}
          onTheme={(v) => setTweak('theme', v)}
          currentRole={t.role}
          onRoleChange={(v) => setTweak('role', v)}
          openSpec={() => setSpecOpen(true)}
        />
      )}
      {(t.role === 'partner' || t.role === 'partner_pending') && (
        <window.PartnerShell
          page={partnerPage}
          onPage={setPartnerPage}
          theme={t.theme}
          onTheme={(v) => setTweak('theme', v)}
          role={t.role}
          currentRole={t.role}
          onRoleChange={(v) => setTweak('role', v)}
          openSpec={() => setSpecOpen(true)}
        />
      )}

      {modalState && (
        <ModerationModal
          item={modalState.item}
          action={modalState.action}
          onClose={closeModeration}
        />
      )}

      <SpecificationModal open={specOpen} onClose={() => setSpecOpen(false)} />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Роль пользователя">
          <window.TweakRadio
            label="Роль"
            value={t.role}
            onChange={(v) => setTweak('role', v)}
            options={[
              { label: 'Админ', value: 'admin' },
              { label: 'Партнёр', value: 'partner' },
              { label: 'Pending', value: 'partner_pending' },
              { label: 'Путешественник', value: 'user' },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="Язык интерфейса">
          <window.TweakRadio
            label="Язык"
            value={t.lang}
            onChange={(v) => setTweak('lang', v)}
            options={[
              { label: 'Русский',  value: 'ru' },
              { label: 'English',  value: 'en' },
              { label: 'Français', value: 'fr' },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="Тема">
          <window.TweakRadio
            label="Палитра"
            value={t.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[
              { label: 'Белый', value: 'white' },
              { label: 'Зелёный', value: 'green' },
              { label: 'Ночной', value: 'dark' },
              { label: 'Золотой', value: 'gold' },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>
  );
}

window.DashboardApp = App;
if (!window.__SKIP_AUTO_MOUNT) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}

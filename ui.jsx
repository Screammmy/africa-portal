/* eslint-disable */
/**
 * AfricaPortal — Design system primitives.
 * PanAfricanStripe, StatusBadge, MetricCard, Sparkline,
 * ActivityFeed, Checkbox, Avatar, ProfileBar, RatingStars,
 * AreaChart, BarChart, PieChart, Stepper, EmptyState, Modal.
 */

const { useState, useEffect, useRef, useMemo } = React;

/* ─── PanAfricanStripe ─── */
function PanAfricanStripe({ height = 3, radius = 0, style }) {
  return (
    <div className="pa-stripe" style={{ height, borderRadius: radius, overflow: 'hidden', ...style }}>
      <span className="s1" /><span className="s2" /><span className="s3" /><span className="s4" />
    </div>
  );
}

/* ─── StatusBadge ─── */
function StatusBadge({ status, label, withDot = false }) {
  const map = {
    active:   { cls: 'badge-active',   txt: label || 'Активен' },
    pending:  { cls: 'badge-pending',  txt: label || 'На модерации' },
    rejected: { cls: 'badge-rejected', txt: label || 'Отклонён' },
    verified: { cls: 'badge-verified', txt: label || 'Верифицирован' },
    draft:    { cls: 'badge-draft',    txt: label || 'Черновик' },
    featured: { cls: 'badge-featured', txt: label || 'Featured' },
    new:      { cls: 'badge-new',      txt: label || 'Новый' },
    in_progress: { cls: 'badge-pending', txt: label || 'В работе' },
    closed:   { cls: 'badge-active',   txt: label || 'Закрыт' },
    converted:{ cls: 'badge-active',   txt: label || 'Конвертирован' },
  };
  const cfg = map[status] || { cls: 'badge-draft', txt: label || status };
  const dotMap = { active: 'badge-dot-active', pending: 'badge-dot-pending', rejected: 'badge-dot-rejected', draft: 'badge-dot-draft', in_progress: 'badge-dot-pending', new: 'badge-dot-rejected', closed: 'badge-dot-active' };
  return (
    <span className={`badge ${cfg.cls}`}>
      {withDot && <span className={`badge-dot ${dotMap[status] || ''}`} />}
      {cfg.txt}
    </span>
  );
}

/* ─── Sparkline ─── */
function Sparkline({ data = [], color = 'var(--pa-green)', width = 90, height = 28, area = true }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });
  const path = points.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ');
  const areaPath = `${path} L${width},${height} L0,${height} Z`;
  return (
    <svg className="metric-spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {area && <path d={areaPath} fill={color} className="spark-fill" />}
      <path d={path} className="spark-path" stroke={color} />
    </svg>
  );
}

/* ─── MetricCard ─── */
function MetricCard({ label, value, delta, accent = 'default', sparkline, icon, sub, pulse }) {
  const sparkColor = {
    red: 'var(--pa-red)', green: 'var(--pa-green)',
    gold: 'var(--pa-gold-mid)', default: 'var(--pa-night)',
  }[accent];

  return (
    <div className={`metric ${pulse ? 'pulse' : ''}`}>
      <div className="metric-head">
        <span className="metric-label">{label}</span>
        {icon && (
          <span className={`metric-icon ${accent !== 'default' ? accent : ''}`}>
            {React.createElement(window.Ic[icon] || window.Ic.dashboard, { size: 16, stroke: 2 })}
          </span>
        )}
      </div>
      <div className={`metric-value ${accent !== 'default' ? accent : ''}`}>{value}</div>
      <div className="metric-foot">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {delta && (
            <span className={`metric-delta ${delta.direction}`}>
              {delta.direction === 'up' && <window.Ic.arrowup size={12} stroke={2.5} />}
              {delta.direction === 'down' && <window.Ic.arrowdown size={12} stroke={2.5} />}
              {delta.value}
            </span>
          )}
          {sub && <span className="metric-sub">{sub}</span>}
        </div>
        {sparkline && <Sparkline data={sparkline} color={sparkColor} />}
      </div>
    </div>
  );
}

/* ─── Avatar ─── */
function Avatar({ name, size = 'md', avClass }) {
  const initials = name
    ? name.split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : '?';
  // pick deterministic gradient from name
  const hash = name ? name.charCodeAt(0) % 6 + 1 : 1;
  return (
    <div className={`avatar ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''} ${avClass || 'av-' + hash}`}>
      {initials}
    </div>
  );
}

/* ─── Checkbox ─── */
function Checkbox({ checked, onChange, label, id }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        className={`checkbox ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); } }}
      />
      {label && <span style={{ fontSize: 13 }}>{label}</span>}
    </label>
  );
}

/* ─── Activity feed ─── */
function ActivityFeed({ items, max = 8 }) {
  return (
    <div className="feed" role="list">
      {items.slice(0, max).map((it) => {
        const IconComp = window.Ic[it.icon] || window.Ic.info;
        return (
          <div className="feed-item" key={it.id} role="listitem">
            <div className={`feed-dot ${it.dot}`}>
              <IconComp size={14} stroke={2} />
            </div>
            <div className="feed-body">
              <div>{it.text}</div>
              <div className="feed-time">{it.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Rating stars ─── */
function RatingStars({ value = 0, count }) {
  const full = Math.round(value);
  return (
    <span className="rating" title={count ? `${value} · ${count} отзывов` : value}>
      <window.Ic.star size={14} fill="currentColor" stroke={0} />
      <span>{value.toFixed(1)}</span>
      {count != null && <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: 12 }}>· {count}</span>}
    </span>
  );
}

/* ─── ProfileBar ─── */
function ProfileBar({ value }) {
  const cls = value < 60 ? 'low' : value < 80 ? 'mid' : 'high';
  return (
    <>
      <div className="profile-bar"><span className={cls} style={{ width: `${value}%` }} /></div>
      <div className="profile-meta">
        <span>Заполненность профиля</span>
        <b style={{ color: 'var(--color-text)' }}>{value}%</b>
      </div>
    </>
  );
}

/* ─── AreaChart (simple, two series) ─── */
function AreaChart({ data, w = 600, h = 240, padding = { l: 36, r: 12, t: 18, b: 26 } }) {
  const innerW = w - padding.l - padding.r;
  const innerH = h - padding.t - padding.b;
  const max = Math.max(...data.flatMap(d => [d.org + d.ref]));
  const ticks = 4;
  const stepX = innerW / (data.length - 1);

  const [hover, setHover] = useState(null);

  const buildPath = (key, stacked = false) => {
    return data.map((d, i) => {
      const x = padding.l + i * stepX;
      const v = stacked ? d.org + d[key] : d[key];
      const y = padding.t + innerH - (v / max) * innerH;
      return (i === 0 ? 'M' : 'L') + `${x},${y}`;
    }).join(' ');
  };

  const orgPath = buildPath('org');
  const refPath = buildPath('ref', true);
  const orgArea = `${orgPath} L${padding.l + innerW},${padding.t + innerH} L${padding.l},${padding.t + innerH} Z`;
  const refArea = `${refPath} ${data.slice().reverse().map((d, i) => {
    const x = padding.l + (data.length - 1 - i) * stepX;
    const y = padding.t + innerH - (d.org / max) * innerH;
    return `L${x},${y}`;
  }).join(' ')} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }} aria-label="Трафик">
      {/* grid */}
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const y = padding.t + (innerH / ticks) * i;
        const v = Math.round(max - (max / ticks) * i);
        return (
          <g key={i}>
            <line x1={padding.l} x2={w - padding.r} y1={y} y2={y} className="grid-line" />
            <text x={padding.l - 8} y={y + 3} textAnchor="end" style={{ fontSize: 10, fill: 'var(--color-text-muted)' }}>
              {v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}
            </text>
          </g>
        );
      })}

      {/* x labels */}
      {data.map((d, i) => (
        <text key={i} x={padding.l + i * stepX} y={h - padding.b + 16}
          textAnchor="middle" style={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }}>
          {d.d}
        </text>
      ))}

      {/* org (green) — stacked under */}
      <path d={orgArea} fill="var(--pa-green)" opacity={0.18} />
      {/* ref (gold) — stacked above */}
      <path d={refArea} fill="var(--pa-gold)" opacity={0.32} />

      <path d={orgPath} fill="none" stroke="var(--pa-green)" strokeWidth={2.5} strokeLinejoin="round" />
      <path d={refPath} fill="none" stroke="var(--pa-gold-mid)" strokeWidth={2.5} strokeLinejoin="round" />

      {/* hover circle */}
      {data.map((d, i) => {
        const x = padding.l + i * stepX;
        const y1 = padding.t + innerH - (d.org / max) * innerH;
        const y2 = padding.t + innerH - ((d.org + d.ref) / max) * innerH;
        const active = hover === i;
        return (
          <g key={i}>
            <rect
              x={x - stepX / 2} y={padding.t} width={stepX} height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            {active && (
              <>
                <line x1={x} x2={x} y1={padding.t} y2={padding.t + innerH} stroke="var(--color-border-strong)" strokeDasharray="3 3" />
                <circle cx={x} cy={y1} r={4.5} fill="var(--pa-green)" stroke="white" strokeWidth={2} />
                <circle cx={x} cy={y2} r={4.5} fill="var(--pa-gold-mid)" stroke="white" strokeWidth={2} />
                <g transform={`translate(${Math.min(x + 8, w - 130)}, ${Math.max(y2 - 50, padding.t)})`}>
                  <rect width={118} height={48} rx={8} fill="var(--pa-night)" />
                  <text x={10} y={16} fill="white" fontSize={11} fontWeight={700}>{d.d}</text>
                  <circle cx={10} cy={28} r={3} fill="var(--pa-green)" />
                  <text x={18} y={31} fill="white" fontSize={11}>Органика: {d.org}</text>
                  <circle cx={10} cy={42} r={3} fill="var(--pa-gold)" />
                  <text x={18} y={45} fill="white" fontSize={11}>Реферал: {d.ref}</text>
                </g>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── BarChart (horizontal) ─── */
function BarChartHoriz({ data, w = 360, barH = 22, gap = 10, valueFmt }) {
  const max = Math.max(...data.map(d => d.value));
  const h = data.length * (barH + gap);
  const labelW = 110;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      {data.map((d, i) => {
        const y = i * (barH + gap);
        const barW = ((w - labelW - 60) * d.value) / max;
        return (
          <g key={d.code || d.name} className="fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <text x={0} y={y + barH / 2 + 4} fontSize={12} fill="var(--color-text)" fontWeight={500}>
              {window.FLAGS[d.code] && <tspan style={{ fontSize: 14 }}>{window.FLAGS[d.code]} </tspan>}
              {d.name}
            </text>
            <rect x={labelW} y={y} width={w - labelW - 60} height={barH} rx={6} fill="var(--color-border)" opacity={0.4} />
            <rect x={labelW} y={y} width={barW} height={barH} rx={6} fill="var(--pa-green)" opacity={0.85}>
              <animate attributeName="width" from={0} to={barW} dur="0.6s" fill="freeze" />
            </rect>
            <text x={w - 4} y={y + barH / 2 + 4} fontSize={11} fontWeight={700}
              textAnchor="end" fill="var(--color-text-muted)">
              {valueFmt ? valueFmt(d.value) : d.value.toLocaleString('ru-RU')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── PieChart (simple) ─── */
function PieChart({ data, size = 180, hole = 60 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const r = size / 2;
  const ir = hole;
  const arc = (start, end) => {
    const sa = (start - 90) * Math.PI / 180;
    const ea = (end - 90) * Math.PI / 180;
    const sx = r + r * Math.cos(sa);
    const sy = r + r * Math.sin(sa);
    const ex = r + r * Math.cos(ea);
    const ey = r + r * Math.sin(ea);
    const sxi = r + ir * Math.cos(ea);
    const syi = r + ir * Math.sin(ea);
    const exi = r + ir * Math.cos(sa);
    const eyi = r + ir * Math.sin(sa);
    const large = end - start > 180 ? 1 : 0;
    return `M${sx},${sy} A${r},${r} 0 ${large} 1 ${ex},${ey} L${sxi},${syi} A${ir},${ir} 0 ${large} 0 ${exi},${eyi} Z`;
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const start = (acc / total) * 360;
          acc += d.value;
          const end = (acc / total) * 360;
          return <path key={i} d={arc(start, end)} fill={d.color} />;
        })}
        <text x={r} y={r - 4} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--color-text)">
          {total.toLocaleString('ru-RU')}
        </text>
        <text x={r} y={r + 14} textAnchor="middle" fontSize={10} fill="var(--color-text-muted)" fontWeight={600} letterSpacing=".06em">
          ВИЗИТОВ
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
            <span style={{ flex: 1, color: 'var(--color-text)' }}>{d.label}</span>
            <b style={{ color: 'var(--color-text)' }}>{Math.round((d.value / total) * 100)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stepper ─── */
function Stepper({ steps, current }) {
  return (
    <div className="stepper" role="navigation" aria-label="Шаги мастера">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
            <span className="num">{i < current ? <window.Ic.check size={13} stroke={3} /> : i + 1}</span>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <span className={`line ${i < current ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── EmptyState ─── */
function EmptyState({ icon = 'inbox', title, sub, action }) {
  const IconComp = window.Ic[icon] || window.Ic.inbox;
  return (
    <div className="empty">
      <div className="empty-illo"><IconComp size={36} stroke={1.5} /></div>
      <div style={{ fontSize: 16, color: 'var(--color-text)', fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13.5 }}>{sub}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

/* ─── Modal ─── */
function Modal({ open, onClose, title, children, foot, size }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal${size ? ' modal-' + size : ''}`} onClick={(e) => e.stopPropagation()}>
        <PanAfricanStripe height={4} />
        <div className="modal-head">
          <div className="modal-title serif">{title}</div>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">{foot}</div>
      </div>
    </div>
  );
}

/* ─── Drawer ─── */
function Drawer({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true">{children}</div>
    </>
  );
}

/* ─── Count-up animation ─── */
function CountUp({ to, duration = 900, prefix = '', suffix = '', sep = ' ', decimals = 0 }) {
  const [val, setVal] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    let raf;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  const fmt = (n) => {
    if (decimals > 0) return n.toFixed(decimals);
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  };
  return <span>{prefix}{fmt(val)}{suffix}</span>;
}

/* ─── AI Chip ─── */
function AiChip({ score }) {
  if (!score) return null;
  const map = {
    safe: { cls: 'safe', label: 'AI: безопасно' },
    review: { cls: 'review', label: 'AI: проверить' },
    flag: { cls: 'flag', label: 'AI: жалоба' },
  };
  const c = map[score];
  return <span className={`ai-chip ${c.cls}`}>{c.label}</span>;
}

/* expose globally */
Object.assign(window, {
  PanAfricanStripe, StatusBadge, MetricCard, Sparkline,
  ActivityFeed, RatingStars, ProfileBar, Avatar, Checkbox,
  AreaChart, BarChartHoriz, PieChart, Stepper, EmptyState,
  Modal, Drawer, CountUp, AiChip,
});

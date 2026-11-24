import { useState, useMemo } from 'react';
import { BarChart3, Flame, Clock, Layers, Calendar, CheckCircle2 } from 'lucide-react';
import {
  getRoutineCategorySeries,
  getRoutineLogForDate
} from '../../services/dailyRoutineStore';

function formatMins(mins) {
  const m = Math.max(0, Math.round(Number(mins || 0)));
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h > 0 && rem > 0) return `${h}h ${rem}m`;
  if (h > 0) return `${h}h`;
  return `${rem}m`;
}

function formatShortDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeekdayLetter(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
}

/**
 * Interactive Daily Routine History & Category Allocation Charts.
 * Renders a stacked daily bar chart (minutes or 100% normalized),
 * category mix breakdown, 30-day consistency heatmap, and selected-day inspector.
 */
export default function RoutineHistoryCharts({ categories = [], habits = [], todayDate }) {
  const [rangeDays, setRangeDays] = useState(14);
  const [chartMode, setChartMode] = useState('minutes'); // 'minutes' | 'percent'
  const [focusedCategoryId, setFocusedCategoryId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [hoveredDate, setHoveredDate] = useState(null);

  const series = useMemo(() => getRoutineCategorySeries(rangeDays), [rangeDays, categories, habits, todayDate]);
  const heatmapSeries = useMemo(() => getRoutineCategorySeries(30), [categories, habits, todayDate]);

  const activeInspectDate = hoveredDate || selectedDate || todayDate;
  const inspectedRow = useMemo(
    () => series.find(r => r.date === activeInspectDate) || series[series.length - 1] || null,
    [series, activeInspectDate]
  );

  const selectedDayLog = useMemo(
    () => getRoutineLogForDate(selectedDate || todayDate),
    [selectedDate, todayDate, habits]
  );

  // Aggregate KPIs & per-category totals for the selected range
  const stats = useMemo(() => {
    const catTotals = new Map(categories.map(c => [c.id, 0]));
    let totalMinutes = 0;
    let activeDays = 0;
    let maxDayMinutes = 0;

    for (const row of series) {
      totalMinutes += row.totalMinutes;
      if (row.totalMinutes > 0) activeDays += 1;
      if (row.totalMinutes > maxDayMinutes) maxDayMinutes = row.totalMinutes;
      for (const c of categories) {
        catTotals.set(c.id, (catTotals.get(c.id) || 0) + (row[c.id] || 0));
      }
    }

    // Current streak ending today or yesterday
    let streak = 0;
    for (let i = heatmapSeries.length - 1; i >= 0; i--) {
      if (heatmapSeries[i].totalMinutes > 0) {
        streak += 1;
      } else if (i === heatmapSeries.length - 1) {
        // Allow today to be 0 if yesterday had activity
        continue;
      } else {
        break;
      }
    }

    const categoryBreakdown = categories
      .map(c => ({
        ...c,
        minutes: catTotals.get(c.id) || 0,
        pct: totalMinutes > 0 ? Math.round(((catTotals.get(c.id) || 0) / totalMinutes) * 100) : 0
      }))
      .sort((a, b) => b.minutes - a.minutes);

    const topCategory = categoryBreakdown[0]?.minutes > 0 ? categoryBreakdown[0] : null;
    const avgDailyMinutes = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

    return {
      totalMinutes,
      activeDays,
      maxDayMinutes,
      streak,
      avgDailyMinutes,
      topCategory,
      categoryBreakdown
    };
  }, [series, heatmapSeries, categories]);

  const yMax = Math.max(60, Math.ceil(stats.maxDayMinutes / 30) * 30);
  const inspectedCategories = useMemo(() => {
    if (!inspectedRow) return [];
    return categories
      .map(c => ({
        ...c,
        minutes: inspectedRow[c.id] || 0,
        pct: inspectedRow.totalMinutes > 0 ? Math.round(((inspectedRow[c.id] || 0) / inspectedRow.totalMinutes) * 100) : 0
      }))
      .filter(c => c.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  }, [inspectedRow, categories]);

  const selectedDayCompletedHabits = useMemo(() => {
    const checked = new Set(selectedDayLog.checkedIds || []);
    return habits.filter(h => checked.has(h.id));
  }, [selectedDayLog, habits]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 1. KPI SUMMARY STRIP */}
      <div className="km-po-kpi-strip">
        <div className="km-po-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>
            <span>TOTAL LOGGED ({rangeDays}D)</span>
            <Clock size={13} color="var(--po-blue, #173aff)" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
            {formatMins(stats.totalMinutes)}
          </div>
          <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)' }}>
            Across {stats.activeDays} active {stats.activeDays === 1 ? 'day' : 'days'}
          </div>
        </div>

        <div className="km-po-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>
            <span>DAILY AVERAGE</span>
            <BarChart3 size={13} color="var(--po-blue, #173aff)" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
            {formatMins(stats.avgDailyMinutes)}
          </div>
          <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)' }}>
            Peak day: {formatMins(stats.maxDayMinutes)}
          </div>
        </div>

        <div className="km-po-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>
            <span>CURRENT STREAK</span>
            <Flame size={13} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
            {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
          </div>
          <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)' }}>
            Consecutive logged days
          </div>
        </div>

        <div className="km-po-card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: 'var(--lab-text-muted)' }}>
            <span>TOP CATEGORY</span>
            <Layers size={13} color={stats.topCategory?.color || 'var(--po-blue, #173aff)'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '1.08rem', fontWeight: '800', letterSpacing: '-0.02em', minWidth: 0 }}>
            {stats.topCategory ? (
              <>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: stats.topCategory.color, flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stats.topCategory.label}</span>
              </>
            ) : (
              <span style={{ color: 'var(--lab-text-muted)' }}>No data yet</span>
            )}
          </div>
          <div style={{ fontSize: '0.69rem', color: 'var(--lab-text-muted)' }}>
            {stats.topCategory ? `${formatMins(stats.topCategory.minutes)} · ${stats.topCategory.pct}% share` : 'Complete tasks to track'}
          </div>
        </div>
      </div>

      {/* 2. PRIMARY STACKED BAR GRAPH: DAILY CATEGORY ALLOCATION */}
      <article className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Daily Category Allocation
            </h3>
            <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--lab-text-muted)' }}>
              Each bar shows how your day is divided across categories. Hover or click any day to inspect.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Mode Toggle: Minutes vs 100% Mix */}
            <div style={{ display: 'inline-flex', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', borderRadius: '999px', padding: '2px', gap: '2px' }}>
              {[
                { id: 'minutes', label: 'Duration' },
                { id: 'percent', label: '100% Mix' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setChartMode(m.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: 'none',
                    background: chartMode === m.id ? 'var(--po-blue, #173aff)' : 'transparent',
                    color: chartMode === m.id ? '#ffffff' : 'var(--lab-text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Range Toggle: 7D / 14D / 30D */}
            <div style={{ display: 'inline-flex', background: 'var(--po-card-subtle)', border: '1px solid var(--po-card-border)', borderRadius: '999px', padding: '2px', gap: '2px' }}>
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setRangeDays(days)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    border: 'none',
                    background: rangeDays === days ? '#c6ff24' : 'transparent',
                    color: rangeDays === days ? '#101010' : 'var(--lab-text-muted)',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Category Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const isFocused = focusedCategoryId === cat.id;
            const isDimmed = focusedCategoryId && !isFocused;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFocusedCategoryId(isFocused ? null : cat.id)}
                title={isFocused ? 'Click to show all categories' : `Highlight ${cat.label}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: `1px solid ${isFocused ? cat.color : 'var(--po-card-border)'}`,
                  background: isFocused ? 'var(--po-card-subtle)' : 'transparent',
                  color: 'var(--lab-text)',
                  fontSize: '0.71rem',
                  fontWeight: isFocused ? '800' : '600',
                  opacity: isDimmed ? 0.42 : 1,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
          {focusedCategoryId && (
            <button
              type="button"
              onClick={() => setFocusedCategoryId(null)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--po-blue, #173aff)',
                fontSize: '0.7rem',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '2px 6px'
              }}
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Stacked Bar Graph Canvas */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
          {/* Y-Axis Labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: '24px',
            fontSize: '0.66rem',
            fontWeight: '700',
            color: 'var(--lab-text-muted)',
            fontVariantNumeric: 'tabular-nums',
            textAlign: 'right',
            minWidth: '38px'
          }}>
            <span>{chartMode === 'percent' ? '100%' : formatMins(yMax)}</span>
            <span>{chartMode === 'percent' ? '50%' : formatMins(Math.round(yMax / 2))}</span>
            <span>0</span>
          </div>

          {/* Bars Area */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
            {/* Horizontal Gridlines */}
            <div style={{
              position: 'absolute',
              inset: '0 0 24px 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none'
            }}>
              {[0, 1, 2].map(idx => (
                <div key={idx} style={{ borderTop: '1px dashed var(--po-card-border)', width: '100%' }} />
              ))}
            </div>

            {/* Day Columns */}
            <div style={{
              position: 'relative',
              height: '200px',
              display: 'grid',
              gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))`,
              gap: rangeDays === 30 ? '4px' : rangeDays === 14 ? '8px' : '12px',
              alignItems: 'end',
              paddingBottom: '24px'
            }}>
              {series.map((row, idx) => {
                const isToday = row.date === todayDate;
                const isSelected = row.date === selectedDate;
                const isHovered = row.date === hoveredDate;
                const totalForBar = row.totalMinutes;
                const barHeightPct = totalForBar <= 0
                  ? 0
                  : chartMode === 'percent'
                    ? 100
                    : Math.max(4, Math.min(100, (totalForBar / yMax) * 100));

                const segments = categories
                  .map(c => ({
                    ...c,
                    mins: row[c.id] || 0
                  }))
                  .filter(s => s.mins > 0);

                // Show fewer date labels on 30D to keep x-axis clean
                const showLabel = rangeDays <= 14 || idx % 5 === 0 || idx === series.length - 1;

                return (
                  <button
                    key={row.date}
                    type="button"
                    onMouseEnter={() => setHoveredDate(row.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                    onClick={() => setSelectedDate(row.date)}
                    title={`${formatShortDate(row.date)}: ${formatMins(totalForBar)}`}
                    style={{
                      position: 'relative',
                      height: '100%',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Hover/Selected column highlight */}
                    {(isHovered || isSelected) && (
                      <div style={{
                        position: 'absolute',
                        inset: '-4px -2px 0 -2px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(11, 59, 250, 0.08)' : 'var(--po-card-subtle)',
                        pointerEvents: 'none'
                      }} />
                    )}

                    {/* Stacked Bar */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: rangeDays === 7 ? '44px' : rangeDays === 14 ? '28px' : '18px',
                      height: `${barHeightPct}%`,
                      minHeight: totalForBar > 0 ? '6px' : '3px',
                      borderRadius: totalForBar > 0 ? '7px 7px 4px 4px' : '3px',
                      background: totalForBar > 0 ? 'transparent' : 'var(--po-track)',
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      gap: segments.length > 1 ? '1.5px' : '0',
                      overflow: 'hidden',
                      outline: isSelected ? '2px solid var(--po-blue, #173aff)' : 'none',
                      outlineOffset: '1px',
                      transition: 'height 0.25s ease'
                    }}>
                      {segments.map(seg => {
                        const segPct = totalForBar > 0 ? (seg.mins / totalForBar) * 100 : 0;
                        const dimmed = focusedCategoryId && focusedCategoryId !== seg.id;
                        return (
                          <div
                            key={seg.id}
                            style={{
                              width: '100%',
                              height: `${segPct}%`,
                              minHeight: '3px',
                              background: seg.color,
                              opacity: dimmed ? 0.18 : 1,
                              transition: 'opacity 0.15s ease'
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* X-Axis Date Label */}
                    <span style={{
                      position: 'absolute',
                      bottom: '-22px',
                      fontSize: rangeDays === 30 ? '0.6rem' : '0.66rem',
                      fontWeight: isToday || isSelected ? '800' : '600',
                      color: isToday ? 'var(--po-blue, #173aff)' : isSelected ? 'var(--lab-text)' : 'var(--lab-text-muted)',
                      whiteSpace: 'nowrap',
                      opacity: showLabel ? 1 : 0
                    }}>
                      {rangeDays === 7
                        ? `${formatWeekdayLetter(row.date)} ${row.date.slice(8)}`
                        : row.date.slice(5)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Hover / Selected Day Breakdown Strip */}
        {inspectedRow && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'var(--po-card-subtle)',
            border: '1px solid var(--po-card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} color="var(--po-blue, #173aff)" />
              <strong style={{ fontSize: '0.82rem' }}>
                {formatShortDate(inspectedRow.date)}{inspectedRow.date === todayDate ? ' (Today)' : ''}
              </strong>
              <span style={{ fontSize: '0.74rem', color: 'var(--lab-text-muted)', fontWeight: '700' }}>
                · Total: <strong style={{ color: 'var(--lab-text)' }}>{formatMins(inspectedRow.totalMinutes)}</strong>
              </span>
              {inspectedRow.wakeTime && (
                <span style={{ fontSize: '0.7rem', color: 'var(--lab-text-muted)' }}>
                  · Wake {inspectedRow.wakeTime}{inspectedRow.sleepTime ? ` / Sleep ${inspectedRow.sleepTime}` : ''}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {inspectedCategories.length === 0 ? (
                <span style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>No completed or logged categories on this day.</span>
              ) : (
                inspectedCategories.map(c => (
                  <span
                    key={c.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: 'var(--po-card-bg)',
                      border: '1px solid var(--po-card-border)',
                      fontSize: '0.71rem',
                      fontWeight: '700'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.color }} />
                    <span>{c.label}:</span>
                    <span style={{ color: 'var(--po-blue, #173aff)' }}>{formatMins(c.minutes)}</span>
                    <span style={{ color: 'var(--lab-text-muted)', fontWeight: '600' }}>({c.pct}%)</span>
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </article>

      {/* 3. SUGGESTED COMPANION CHARTS: CATEGORY SHARE + 30-DAY HEATMAP & INSPECTOR */}
      <div className="km-po-top-grid">
        {/* Left: Category Mix Horizontal Bars */}
        <article className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '0.96rem', fontWeight: '800' }}>
                Category Balance ({rangeDays}D)
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                Where your intentional hours went
              </p>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--po-blue, #173aff)' }}>
              {formatMins(stats.totalMinutes)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats.categoryBreakdown.map(cat => (
              <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: cat.color }} />
                    <span>{cat.label}</span>
                  </span>
                  <span style={{ fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: 'var(--lab-text-muted)' }}>
                    <strong style={{ color: 'var(--lab-text)' }}>{formatMins(cat.minutes)}</strong> · {cat.pct}%
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--po-track)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(cat.minutes > 0 ? 3 : 0, cat.pct)}%`,
                    background: cat.color,
                    borderRadius: '999px',
                    transition: 'width 0.25s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Right: 30-Day Consistency Heatmap + Selected Day Tasks */}
        <article className="km-po-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 2px 0', fontSize: '0.96rem', fontWeight: '800' }}>
                30-Day Consistency
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                Click any square to view that day&apos;s completed tasks
              </p>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--lab-text-muted)' }}>
              {heatmapSeries.filter(d => d.totalMinutes > 0).length}/30d
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, minmax(0, 1fr))', gap: '5px' }}>
            {heatmapSeries.map(d => {
              const intensity = d.totalMinutes === 0
                ? 0
                : d.totalMinutes < 30
                  ? 1
                  : d.totalMinutes < 90
                    ? 2
                    : 3;
              const bg = intensity === 0
                ? 'var(--po-track)'
                : intensity === 1
                  ? 'rgba(198, 255, 36, 0.38)'
                  : intensity === 2
                    ? 'rgba(11, 59, 250, 0.55)'
                    : 'var(--po-blue, #173aff)';
              const isSel = d.date === selectedDate;
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
                  title={`${formatShortDate(d.date)}: ${formatMins(d.totalMinutes)}`}
                  style={{
                    aspectRatio: '1 / 1',
                    width: '100%',
                    borderRadius: '6px',
                    border: isSel ? '2px solid #c6ff24' : '1px solid transparent',
                    background: bg,
                    cursor: 'pointer',
                    padding: 0
                  }}
                />
              );
            })}
          </div>

          <div style={{
            paddingTop: '10px',
            borderTop: '1px solid var(--po-card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', fontWeight: '700' }}>
              <span>Completed on {formatShortDate(selectedDate || todayDate)}</span>
              <span style={{ color: 'var(--po-blue, #173aff)' }}>{selectedDayCompletedHabits.length} tasks</span>
            </div>
            {selectedDayCompletedHabits.length === 0 ? (
              <div style={{ fontSize: '0.72rem', color: 'var(--lab-text-muted)' }}>
                No completed tasks recorded for this date.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {selectedDayCompletedHabits.slice(0, 8).map(h => {
                  const cat = categories.find(c => c.id === h.category) || categories[0];
                  return (
                    <span
                      key={h.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: 'var(--po-card-subtle)',
                        border: '1px solid var(--po-card-border)',
                        fontSize: '0.69rem',
                        fontWeight: '600'
                      }}
                    >
                      <CheckCircle2 size={11} color={cat?.color || '#10b981'} />
                      <span>{h.title}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Search, CalendarDays, X } from 'lucide-react';

interface Props {
  locale?: string;
  base?: string;
}

const MONTH_NAMES_NL = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                         'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
const MONTH_SHORT_NL  = ['JAN','FEB','MRT','APR','MEI','JUN','JUL','AUG','SEP','OKT','NOV','DEC'];
const MONTH_NAMES_EN  = ['January','February','March','April','May','June',
                          'July','August','September','October','November','December'];
const MONTH_SHORT_EN  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAY_SHORT_NL    = ['Ma','Di','Wo','Do','Vr','Za','Zo'];
const DAY_SHORT_EN    = ['Mo','Tu','We','Th','Fr','Sa','Su'];

type ViewMode = 'month' | 'week';

function getWeeksOfMonth(year: number, month: number) {
  // Returns array of weeks; each week is 7 days (Mon-Sun), padded with null
  const weeks: (Date | null)[][] = [];
  const first = new Date(year, month, 1);
  // 0=Sun→6, we want Mon=0
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let week: (Date | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export function HomeDateFinder({ locale = 'nl', base = '/nl' }: Props) {
  const router = useRouter();
  const today = new Date();
  const currentYear = today.getFullYear();

  const MONTH_NAMES = locale === 'nl' ? MONTH_NAMES_NL : MONTH_NAMES_EN;
  const MONTH_SHORT = locale === 'nl' ? MONTH_SHORT_NL : MONTH_SHORT_EN;
  const DAY_SHORT   = locale === 'nl' ? DAY_SHORT_NL : DAY_SHORT_EN;

  const [view, setView]                   = useState<ViewMode>('month');
  const [activeMonth, setActiveMonth]     = useState<number | null>(null);   // 0-11
  const [activeYear, setActiveYear]       = useState<number>(currentYear);
  const [selectedDate, setSelectedDate]   = useState<Date | null>(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);

  const weeks = useMemo(() => {
    if (activeMonth === null) return [];
    return getWeeksOfMonth(activeYear, activeMonth);
  }, [activeYear, activeMonth]);

  const handleMonthClick = (mi: number) => {
    setActiveMonth(mi);
    setSelectedDate(null);
    setSelectedWeekStart(null);
    setView('week');
  };

  const handleDayClick = (d: Date) => {
    setSelectedDate(d);
    setSelectedWeekStart(null);
  };

  const handleWeekClick = (weekDays: (Date | null)[]) => {
    const first = weekDays.find(Boolean) as Date;
    setSelectedWeekStart(first);
    setSelectedDate(null);
  };

  const handleSearch = () => {
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      router.push(`${base}/calendar?date=${y}-${m}-${d}`);
    } else if (selectedWeekStart) {
      const y = selectedWeekStart.getFullYear();
      const m = String(selectedWeekStart.getMonth() + 1).padStart(2, '0');
      const d = String(selectedWeekStart.getDate()).padStart(2, '0');
      router.push(`${base}/calendar?week=${y}-${m}-${d}`);
    } else if (activeMonth !== null) {
      const m = String(activeMonth + 1).padStart(2, '0');
      router.push(`${base}/calendar?month=${activeYear}-${m}`);
    } else {
      router.push(`${base}/calendar`);
    }
  };

  const backToMonths = () => {
    setView('month');
    setSelectedDate(null);
    setSelectedWeekStart(null);
  };

  const prevMonth = () => {
    if (activeMonth === 0) { setActiveMonth(11); setActiveYear(y => y - 1); }
    else setActiveMonth(m => m! - 1);
    setSelectedDate(null); setSelectedWeekStart(null);
  };
  const nextMonth = () => {
    if (activeMonth === 11) { setActiveMonth(0); setActiveYear(y => y + 1); }
    else setActiveMonth(m => m! + 1);
    setSelectedDate(null); setSelectedWeekStart(null);
  };

  const selectionLabel = () => {
    if (selectedDate) {
      return selectedDate.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (selectedWeekStart) {
      const end = new Date(selectedWeekStart); end.setDate(end.getDate() + 6);
      const fmt = (d: Date) => d.toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { day: 'numeric', month: 'short' });
      return `Week ${fmt(selectedWeekStart)} – ${fmt(end)}`;
    }
    if (activeMonth !== null) return `${MONTH_NAMES[activeMonth]} ${activeYear}`;
    return locale === 'nl' ? 'Wanneer ben je op Ibiza?' : 'When are you in Ibiza?';
  };

  const hasSelection = selectedDate !== null || selectedWeekStart !== null || activeMonth !== null;
  const isToday = (d: Date) => d.toDateString() === today.toDateString();
  const isPast  = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="hdf-root">
      {/* ── Top bar: label + search ── */}
      <div className="hdf-topbar">
        <div className="hdf-label-row">
          <CalendarDays size={16} className="hdf-icon" />
          <span className="hdf-label">{selectionLabel()}</span>
          {hasSelection && (
            <button
              className="hdf-clear"
              onClick={() => { setView('month'); setActiveMonth(null); setSelectedDate(null); setSelectedWeekStart(null); }}
              aria-label="Wis selectie"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <button className="hdf-search-btn" onClick={handleSearch}>
          <Search size={14} />
          {locale === 'nl' ? 'Zoek Feesten' : 'Find Events'}
        </button>
      </div>

      {/* ── MONTH GRID ── */}
      {view === 'month' && (
        <div className="hdf-panel">
          {/* Year navigation */}
          <div className="hdf-year-row">
            <button className="hdf-nav-btn" onClick={() => setActiveYear(y => y - 1)}><ChevronLeft size={15} /></button>
            <span className="hdf-year">{activeYear}</span>
            <button className="hdf-nav-btn" onClick={() => setActiveYear(y => y + 1)}><ChevronRight size={15} /></button>
          </div>

          <div className="hdf-month-grid">
            {MONTH_SHORT.map((abbr, mi) => {
              const isPastMonth = new Date(activeYear, mi + 1, 0) < today;
              return (
                <button
                  key={abbr}
                  className={`hdf-month-cell${mi === today.getMonth() && activeYear === currentYear ? ' hdf-month-today' : ''}${isPastMonth ? ' hdf-month-past' : ''}`}
                  onClick={() => !isPastMonth && handleMonthClick(mi)}
                  disabled={isPastMonth}
                >
                  <span className="hdf-month-abbr">{abbr}</span>
                  {mi === today.getMonth() && activeYear === currentYear && (
                    <span className="hdf-month-dot" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── WEEK / DAY VIEW ── */}
      {view === 'week' && activeMonth !== null && (
        <div className="hdf-panel">
          {/* Month nav header */}
          <div className="hdf-cal-header">
            <button className="hdf-nav-btn" onClick={backToMonths}>
              <ChevronLeft size={15} /> <span style={{ fontSize: '11px', fontWeight: 700 }}>Maanden</span>
            </button>
            <div className="hdf-cal-title">
              <button className="hdf-nav-btn" onClick={prevMonth}><ChevronLeft size={15} /></button>
              <span className="hdf-month-title">{MONTH_NAMES[activeMonth]} {activeYear}</span>
              <button className="hdf-nav-btn" onClick={nextMonth}><ChevronRight size={15} /></button>
            </div>
          </div>

          {/* Day-of-week headers */}
          <div className="hdf-dow-row">
            {DAY_SHORT.map(d => <span key={d} className="hdf-dow">{d}</span>)}
          </div>

          {/* Calendar weeks */}
          <div className="hdf-weeks">
            {weeks.map((week, wi) => {
              const realDays = week.filter(Boolean) as Date[];
              const weekSelected = selectedWeekStart && realDays.some(d => d.toDateString() === selectedWeekStart.toDateString());
              return (
                <div
                  key={wi}
                  className={`hdf-week-row${weekSelected ? ' hdf-week-active' : ''}`}
                  onClick={() => handleWeekClick(week)}
                  title={locale === 'nl' ? 'Selecteer week' : 'Select week'}
                >
                  {week.map((d, di) => {
                    if (!d) return <span key={di} className="hdf-day hdf-day-empty" />;
                    const sel = selectedDate?.toDateString() === d.toDateString();
                    const past = isPast(d);
                    const tod  = isToday(d);
                    return (
                      <button
                        key={di}
                        className={`hdf-day${sel ? ' hdf-day-sel' : ''}${tod ? ' hdf-day-today' : ''}${past ? ' hdf-day-past' : ''}`}
                        onClick={e => { e.stopPropagation(); if (!past) handleDayClick(d); }}
                        disabled={past}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <p className="hdf-hint">
            {locale === 'nl'
              ? 'Klik op een week of dag — zoek dan alle events'
              : 'Click a week or day — then search all events'}
          </p>
        </div>
      )}
    </div>
  );
}

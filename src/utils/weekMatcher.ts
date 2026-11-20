import { TorahPortion } from '../types/torah';

/**
 * Computes the Sunday-start week of month (1..5/6) for a given Date
 * and returns a cycle score comparable to Notion week labels (10월 1주 -> 9월 4주).
 */
export function getWeekInfoFromDate(date: Date = new Date()): {
  month: number;
  weekOfMonth: number;
  label: string;
  formattedDate: string;
} {
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 0 = Sun
  const weekOfMonth = Math.ceil((dayOfMonth + firstDayOfMonth) / 7);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const formattedDate = `${date.getFullYear()}년 ${month}월 ${dayOfMonth}일 (${weekdays[date.getDay()]})`;

  return {
    month,
    weekOfMonth,
    label: `${month}월 ${weekOfMonth}주`,
    formattedDate,
  };
}

/**
 * Returns local midnight on the Sunday of the week containing `date`.
 */
function getWeekStartSunday(date: Date): number {
  const localMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const sundayDate = localMidnight.getDate() - localMidnight.getDay();
  return new Date(
    localMidnight.getFullYear(),
    localMidnight.getMonth(),
    sundayDate
  ).getTime();
}

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Finds the index in `portions` that corresponds to "This Week" (이번 주).
 * Anchored to the Sunday–Saturday week of 2026-11-15 ~ 2026-11-21 as "봐예쩨" (Vayetzei),
 * advancing week-by-week across the 51-week cycle.
 */
export function findThisWeekIndex(
  portions: TorahPortion[],
  date: Date = new Date()
): number {
  if (!portions.length) return 0;

  const vayetzeiIdx = portions.findIndex((p) => p.koreanName === '봐예쩨');
  const anchorIndex = vayetzeiIdx !== -1 ? vayetzeiIdx : 6;
  const anchorSunday = new Date(2026, 10, 15).getTime(); // 2026-11-15 (Sunday)
  const currentSunday = getWeekStartSunday(date);

  const weeksDiff = Math.round((currentSunday - anchorSunday) / MS_PER_WEEK);
  const total = portions.length;
  return ((anchorIndex + weeksDiff) % total + total) % total;
}

/**
 * Extracts YouTube video ID from standard watch or share URLs.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace(/^\//, '').split('/')[0] || null;
    }
    if (u.searchParams.has('v')) {
      return u.searchParams.get('v');
    }
    if (u.pathname.includes('/embed/')) {
      return u.pathname.split('/embed/')[1]?.split('/')[0] || null;
    }
  } catch {
    return null;
  }
  return null;
}

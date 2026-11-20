import React, { useMemo, useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { BookFilter, TorahPortion } from '../types/torah';

interface PortionIndexRailProps {
  portions: TorahPortion[];
  selectedIndex: number;
  thisWeekIndex: number;
  completedIds: Set<string>;
  onSelect: (index: number) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const BOOK_FILTERS: BookFilter[] = [
  '전체',
  '창세기',
  '출애굽기',
  '레위기',
  '민수기',
  '신명기',
  '특별절기',
];

export const PortionIndexRail: React.FC<PortionIndexRailProps> = ({
  portions,
  selectedIndex,
  thisWeekIndex,
  completedIds,
  onSelect,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [bookFilter, setBookFilter] = useState<BookFilter>('전체');
  const [query, setQuery] = useState('');

  const filteredPortions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return portions.filter((p) => {
      if (bookFilter !== '전체' && p.book !== bookFilter) return false;
      if (!q) return true;
      return (
        p.koreanName.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q) ||
        p.parashahReading.toLowerCase().includes(q) ||
        p.book.toLowerCase().includes(q)
      );
    });
  }, [portions, bookFilter, query]);

  const railContent = (
    <div className="flex flex-col h-full bg-white border border-stone-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-stone-200 bg-[#F7F4EE]/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-stone-900">
            연간 51주 토라포션 목록
          </h2>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="목록 닫기"
              className="lg:hidden p-1.5 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="포션명, 의미, 성경 검색"
            aria-label="토라포션 검색"
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-md text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A]"
          />
        </div>

        {/* Book Filter Tabs */}
        <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="성경 권별 필터">
          {BOOK_FILTERS.map((book) => (
            <button
              key={book}
              type="button"
              onClick={() => setBookFilter(book)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                bookFilter === book
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              {book}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Portion List */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] divide-y divide-stone-100">
        {filteredPortions.length > 0 ? (
          filteredPortions.map((item) => {
            const isSelected = item.index === selectedIndex;
            const isThisWeek = item.index === thisWeekIndex;
            const isRead = completedIds.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.index);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left px-4 py-3 transition-colors cursor-pointer flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1E3A8A] ${
                  isSelected
                    ? 'bg-[#1E3A8A]/8'
                    : 'hover:bg-[#F7F4EE]/70'
                }`}
              >
                <span
                  className={`text-xs font-mono tabular-nums pt-0.5 shrink-0 ${
                    isSelected ? 'text-[#1E3A8A] font-bold' : 'text-stone-400'
                  }`}
                >
                  {String(item.index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span className="font-medium">{item.book}</span>
                    {isThisWeek && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#1E3A8A]">이번 주</span>
                      </>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between gap-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-[#1E3A8A]' : 'text-stone-900'
                      }`}
                    >
                      {item.koreanName}
                    </span>
                    {item.hebrewName && (
                      <span
                        dir="rtl"
                        lang="he"
                        className="font-hebrew text-xs text-stone-500 shrink-0"
                      >
                        {item.hebrewName}
                      </span>
                    )}
                  </div>
                </div>

                {isRead && (
                  <Check
                    className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-1"
                    aria-label="묵상 완료"
                  />
                )}
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-stone-500">
            검색 조건에 맞는 토라포션이 없습니다.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar Rail */}
      <aside className="hidden lg:block lg:sticky lg:top-24" aria-label="전체 토라포션 목차">
        {railContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-stone-950/40 backdrop-blur-[1px] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="전체 토라포션 목차"
        >
          <div className="w-full max-w-sm h-full bg-[#FBF9F5] p-3">
            {railContent}
          </div>
        </div>
      )}
    </>
  );
};

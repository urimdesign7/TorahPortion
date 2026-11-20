import React from 'react';
import { CalendarCheck, BookOpen } from 'lucide-react';

interface HeaderProps {
  isCurrentWeek: boolean;
  onJumpToThisWeek: () => void;
  onOpenThisWeekVideo: () => void;
  onOpenMobileIndex: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isCurrentWeek,
  onJumpToThisWeek,
  onOpenThisWeekVideo,
  onOpenMobileIndex,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className="font-serif-kr text-lg sm:text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          <BookOpen className="w-5 h-5 text-[#1E3A8A] shrink-0" aria-hidden="true" />
          <span>주간 토라포션</span>
        </a>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="주요 섹션 이동"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          <a
            href="#readings"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            주간 말씀
          </a>
          <a
            href="#memory-verse"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            암송 구절
          </a>
          <a
            href="#scripture"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            성경 본문
          </a>
          <button
            type="button"
            onClick={onOpenThisWeekVideo}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            강의 영상
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileIndex}
            className="lg:hidden px-3 py-2 text-xs font-medium text-stone-700 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
          >
            목록
          </button>
          <button
            type="button"
            onClick={onJumpToThisWeek}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
              isCurrentWeek
                ? 'bg-stone-900 text-[#FBF9F5] hover:bg-stone-800'
                : 'bg-[#1E3A8A] text-white hover:bg-[#172E6E]'
            }`}
          >
            <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>이번 주</span>
          </button>
        </div>
      </div>
    </header>
  );
};

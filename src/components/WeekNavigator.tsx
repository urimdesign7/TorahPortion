import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { TorahPortion } from '../types/torah';

interface WeekNavigatorProps {
  currentPortion: TorahPortion;
  prevPortion: TorahPortion | null;
  nextPortion: TorahPortion | null;
  isCurrentWeek: boolean;
  onPrev: () => void;
  onNext: () => void;
  onThisWeek: () => void;
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentPortion,
  prevPortion,
  nextPortion,
  isCurrentWeek,
  onPrev,
  onNext,
  onThisWeek,
}) => {
  return (
    <section
      aria-label="주간 포션 이동 컨트롤"
      className="bg-[#F7F4EE] border border-stone-200 rounded-lg p-3 sm:p-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-stretch gap-2.5 sm:gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!prevPortion}
          aria-label={prevPortion ? `이전 주: ${prevPortion.koreanName}` : '이전 주 없음'}
          className="group flex items-center justify-start gap-3 px-4 py-2.5 rounded-md border border-stone-200 bg-white text-left transition-colors hover:border-stone-400 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          <ChevronLeft
            className="w-5 h-5 text-stone-500 group-hover:text-stone-900 shrink-0 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
              <span>이전</span>
              {prevPortion && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{prevPortion.book}</span>
                </>
              )}
              <span className="hidden md:inline text-stone-400 ml-auto font-mono text-[10px]">
                ←
              </span>
            </div>
            <div className="text-sm font-semibold text-stone-900 truncate mt-0.5">
              {prevPortion ? prevPortion.koreanName : '첫 번째 포션'}
            </div>
          </div>
        </button>

        {/* Center: This Week Key */}
        <button
          type="button"
          onClick={onThisWeek}
          className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-md border transition-colors cursor-pointer min-h-[48px] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
            isCurrentWeek
              ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
              : 'bg-white border-[#1E3A8A]/40 text-[#1E3A8A] hover:bg-[#1E3A8A]/5'
          }`}
        >
          <div className="flex items-center gap-1.5 text-sm font-bold tracking-tight">
            {!isCurrentWeek && <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            <span>{isCurrentWeek ? '이번 주 포션' : '이번 주로 이동'}</span>
          </div>
          <div
            className={`text-[11px] mt-0.5 ${
              isCurrentWeek ? 'text-blue-100' : 'text-stone-500'
            }`}
          >
            {currentPortion.koreanName}
          </div>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!nextPortion}
          aria-label={nextPortion ? `다음 주: ${nextPortion.koreanName}` : '다음 주 없음'}
          className="group flex items-center justify-end gap-3 px-4 py-2.5 rounded-md border border-stone-200 bg-white text-right transition-colors hover:border-stone-400 hover:bg-stone-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-stone-500">
              <span className="hidden md:inline text-stone-400 mr-auto font-mono text-[10px]">
                →
              </span>
              {nextPortion && (
                <>
                  <span>{nextPortion.book}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>다음</span>
            </div>
            <div className="text-sm font-semibold text-stone-900 truncate mt-0.5">
              {nextPortion ? nextPortion.koreanName : '마지막 포션'}
            </div>
          </div>
          <ChevronRight
            className="w-5 h-5 text-stone-500 group-hover:text-stone-900 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
};

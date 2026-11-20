/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import torahData from './data/torahPortions.json';
import { FontScale, TorahPortion } from './types/torah';
import { findThisWeekIndex } from './utils/weekMatcher';
import { Header } from './components/Header';
import { WeekNavigator } from './components/WeekNavigator';
import { PortionReader } from './components/PortionReader';
import { PortionIndexRail } from './components/PortionIndexRail';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const COMPLETED_STORAGE_KEY = 'torah_completed_ids_v1';
const FONT_SCALE_STORAGE_KEY = 'torah_font_scale_v1';

const portions: TorahPortion[] = torahData as TorahPortion[];

export default function App() {
  const today = useMemo(() => new Date(), []);
  const thisWeekIndex = useMemo(
    () => findThisWeekIndex(portions, today),
    [today]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(thisWeekIndex);
  const [isMobileIndexOpen, setIsMobileIndexOpen] = useState<boolean>(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false);

  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_STORAGE_KEY);
      if (saved) {
        return new Set(JSON.parse(saved) as string[]);
      }
    } catch {
      // ignore storage errors
    }
    return new Set();
  });

  const [fontScale, setFontScale] = useState<FontScale>(() => {
    try {
      const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
      if (saved === 'sm' || saved === 'md' || saved === 'lg') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'md';
  });

  const currentPortion = portions[selectedIndex] || portions[0];
  const prevPortion = selectedIndex > 0 ? portions[selectedIndex - 1] : null;
  const nextPortion =
    selectedIndex < portions.length - 1 ? portions[selectedIndex + 1] : null;
  const isCurrentWeek = selectedIndex === thisWeekIndex;

  const handlePrev = useCallback(() => {
    setShowVideoPlayer(false);
    setSelectedIndex((idx) => (idx > 0 ? idx - 1 : idx));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNext = useCallback(() => {
    setShowVideoPlayer(false);
    setSelectedIndex((idx) => (idx < portions.length - 1 ? idx + 1 : idx));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleThisWeek = useCallback(() => {
    setShowVideoPlayer(false);
    setSelectedIndex(thisWeekIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [thisWeekIndex]);

  const handleOpenThisWeekVideo = useCallback(() => {
    setSelectedIndex(thisWeekIndex);
    setShowVideoPlayer(true);
    setTimeout(() => {
      document.getElementById('teaching')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 60);
  }, [thisWeekIndex]);

  const handleSelectIndex = useCallback((idx: number) => {
    setShowVideoPlayer(false);
    setSelectedIndex(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleCompleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(
          COMPLETED_STORAGE_KEY,
          JSON.stringify(Array.from(next))
        );
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const handleChangeFontScale = useCallback((scale: FontScale) => {
    setFontScale(scale);
    try {
      localStorage.setItem(FONT_SCALE_STORAGE_KEY, scale);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Keyboard navigation: ArrowLeft = 이전, ArrowRight = 다음, Home = 이번 주
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleThisWeek();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrev, handleNext, handleThisWeek]);

  if (!currentPortion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-stone-600">
        토라포션 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div id="top" className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col">
      <Header
        isCurrentWeek={isCurrentWeek}
        onJumpToThisWeek={handleThisWeek}
        onOpenThisWeekVideo={handleOpenThisWeekVideo}
        onOpenMobileIndex={() => setIsMobileIndexOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Top Week Navigation Key Strip: 이전 · 이번 주 · 다음 */}
        <div className="mb-6 space-y-3">
          <div className="flex justify-end empty:hidden">
            <PWAInstallButton />
          </div>
          <WeekNavigator
            currentPortion={currentPortion}
            prevPortion={prevPortion}
            nextPortion={nextPortion}
            isCurrentWeek={isCurrentWeek}
            onPrev={handlePrev}
            onNext={handleNext}
            onThisWeek={handleThisWeek}
          />
        </div>

        {/* Asymmetric 2-Column Editorial Layout: 70% Reader / 30% Index Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 lg:gap-8 items-start">
          <div className="space-y-6 min-w-0">
            <PortionReader
              portion={currentPortion}
              isCurrentWeek={isCurrentWeek}
              isCompleted={completedIds.has(currentPortion.id)}
              totalCount={portions.length}
              fontScale={fontScale}
              showVideoPlayer={showVideoPlayer}
              onToggleVideoPlayer={() => setShowVideoPlayer((prev) => !prev)}
              onChangeFontScale={handleChangeFontScale}
              onToggleCompleted={handleToggleCompleted}
            />

            {/* Bottom Week Navigation Mirror */}
            <WeekNavigator
              currentPortion={currentPortion}
              prevPortion={prevPortion}
              nextPortion={nextPortion}
              isCurrentWeek={isCurrentWeek}
              onPrev={handlePrev}
              onNext={handleNext}
              onThisWeek={handleThisWeek}
            />
          </div>

          <PortionIndexRail
            portions={portions}
            selectedIndex={selectedIndex}
            thisWeekIndex={thisWeekIndex}
            completedIds={completedIds}
            onSelect={handleSelectIndex}
            isMobileOpen={isMobileIndexOpen}
            onCloseMobile={() => setIsMobileIndexOpen(false)}
          />
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-[#F7F4EE]/60 mt-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>전체 토라포션과 절기 · 연간 51주 묵상 리더</span>
          <div className="flex items-center gap-4">
            <span>키보드 단축키: ← 이전 · Home 이번 주 · → 다음</span>
            <a
              href="https://noisy-zephyr-e51.notion.site/166f5a055c9d8027b90fcdf4dacfd617"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-stone-900 underline underline-offset-4"
            >
              노션 전체 페이지
            </a>
          </div>
        </div>
      </footer>

      <OfflineIndicator />
    </div>
  );
}

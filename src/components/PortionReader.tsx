import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Play,
  X,
  BookMarked,
  Minus,
  Plus,
} from 'lucide-react';
import { FontScale, TorahPortion } from '../types/torah';
import { extractYouTubeId } from '../utils/weekMatcher';

interface PortionReaderProps {
  portion: TorahPortion;
  isCurrentWeek: boolean;
  isCompleted: boolean;
  totalCount: number;
  fontScale: FontScale;
  showVideoPlayer: boolean;
  onToggleVideoPlayer: () => void;
  onChangeFontScale: (scale: FontScale) => void;
  onToggleCompleted: (id: string) => void;
}

export const PortionReader: React.FC<PortionReaderProps> = ({
  portion,
  isCurrentWeek,
  isCompleted,
  totalCount,
  fontScale,
  showVideoPlayer,
  onToggleVideoPlayer,
  onChangeFontScale,
  onToggleCompleted,
}) => {
  // -1 means "Show all chapters"
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // Reset chapter selection when navigating to a different week
  useEffect(() => {
    setSelectedChapterIdx(0);
  }, [portion.id]);

  const youtubeId = extractYouTubeId(portion.videoUrl);

  const verseTextClass =
    fontScale === 'sm'
      ? 'text-[15px] leading-[1.85]'
      : fontScale === 'lg'
      ? 'text-[19px] leading-[1.95]'
      : 'text-[17px] leading-[1.9]';

  const visibleChapters =
    selectedChapterIdx === -1
      ? portion.chapters
      : portion.chapters[selectedChapterIdx]
      ? [portion.chapters[selectedChapterIdx]]
      : [];

  return (
    <article className="bg-white border border-stone-200 rounded-lg p-6 sm:p-10">
      {/* Editorial Title & Metadata Header */}
      <header className="pb-6 border-b border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Zero-pill unboxed metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-stone-500">
            <span className="font-semibold text-[#1E3A8A]">{portion.book}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              제{portion.index + 1}주 ({String(portion.index + 1).padStart(2, '0')} / {totalCount})
            </span>
            {isCurrentWeek && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#78350F]">이번 주 본문</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleCompleted(portion.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A] ${
              isCompleted
                ? 'bg-[#1E3A8A]/8 border-[#1E3A8A]/30 text-[#1E3A8A]'
                : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{isCompleted ? '묵상 완료' : '읽기 완료 표시'}</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6">
          <h1 className="font-serif-kr text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight text-balance">
            {portion.koreanName}
          </h1>
          {portion.hebrewName && (
            <p
              dir="rtl"
              lang="he"
              className="font-hebrew text-2xl sm:text-3xl font-semibold text-[#78350F] shrink-0"
            >
              {portion.hebrewName}
            </p>
          )}
        </div>

        {portion.meaning && (
          <p className="mt-2 text-base sm:text-lg text-stone-600 font-serif-kr">
            {portion.meaning}
          </p>
        )}
      </header>

      {/* 3-Part Reading Schedule (Parashah / Haftarah / Brit Chadashah) */}
      <section id="readings" aria-label="주간 성경 읽기 범위" className="py-6 border-b border-stone-200 scroll-mt-24">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
          주간 읽기 본문 범위
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="pt-1">
            <dt className="text-xs font-medium text-stone-500">
              파라샤 (토라)
            </dt>
            <dd className="mt-1.5 text-sm sm:text-base font-semibold text-stone-900 font-serif-kr">
              {portion.parashahReading || '—'}
            </dd>
          </div>
          <div className="pt-1 md:border-l md:border-stone-200 md:pl-6">
            <dt className="text-xs font-medium text-stone-500">
              하프타라 (선지서)
            </dt>
            <dd className="mt-1.5 text-sm sm:text-base font-semibold text-stone-900 font-serif-kr">
              {portion.haftarahReading || '—'}
            </dd>
          </div>
          <div className="pt-1 md:border-l md:border-stone-200 md:pl-6">
            <dt className="text-xs font-medium text-stone-500">
              브리트 하닷샤 (신약)
            </dt>
            <dd className="mt-1.5 text-sm sm:text-base font-semibold text-stone-900 font-serif-kr">
              {portion.britChadashahReading || '—'}
            </dd>
          </div>
        </dl>
      </section>

      {/* Memory Verse Pull Quote */}
      {(portion.memoryVerseHebrew || portion.memoryVerseKorean) && (
        <section
          id="memory-verse"
          aria-label="주간 암송 구절"
          className="my-8 py-7 border-y border-stone-200 bg-[#FBF9F5]/60 px-4 sm:px-6 scroll-mt-24"
        >
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-stone-500 mb-4">
            <BookMarked className="w-3.5 h-3.5 text-[#78350F]" aria-hidden="true" />
            <span>주간 암송 말씀</span>
          </div>

          {portion.memoryVerseHebrew && (
            <p
              dir="rtl"
              lang="he"
              className="font-hebrew text-xl sm:text-2xl leading-relaxed text-stone-900 text-right mb-4"
            >
              {portion.memoryVerseHebrew}
            </p>
          )}

          {portion.memoryVerseKorean && (
            <blockquote className="font-serif-kr text-base sm:text-lg leading-relaxed text-stone-800">
              “{portion.memoryVerseKorean}”
            </blockquote>
          )}
        </section>
      )}

      {/* Teaching Video & Original Notion Source */}
      <section id="teaching" aria-label="강의 영상 및 노션 원문" className="pb-6 border-b border-stone-200 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              해설 강의 및 원문 링크
            </h2>
            {portion.videoTitle && (
              <p className="mt-1 text-sm font-medium text-stone-800 truncate max-w-xl">
                {portion.videoTitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {youtubeId && (
              <button
                type="button"
                onClick={onToggleVideoPlayer}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
              >
                {showVideoPlayer ? (
                  <>
                    <X className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>영상 닫기</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
                    <span>강의 영상 보기</span>
                  </>
                )}
              </button>
            )}

            <a
              href={portion.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-stone-200 bg-[#F7F4EE] text-stone-700 hover:text-stone-900 hover:border-stone-300 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <span>노션 원문 보기</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        {showVideoPlayer && youtubeId && (
          <div className="mt-4 aspect-video w-full overflow-hidden rounded-md border border-stone-200 bg-stone-950">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
              title={portion.videoTitle || portion.koreanName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </section>

      {/* Scripture Chapters Reader */}
      <section id="scripture" aria-label="성경 본문" className="pt-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-serif-kr font-bold text-stone-900">
              성경 본문 읽기
            </h2>
            <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
              {portion.chaptersCount}개 장 · 총 {portion.totalVerses}절 수록
            </p>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-md border border-stone-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onChangeFontScale('sm')}
              aria-label="글자 작게"
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                fontScale === 'sm'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Minus className="w-3 h-3" aria-hidden="true" />
              <span>작게</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale('md')}
              aria-label="글자 보통"
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                fontScale === 'md'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              보통
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale('lg')}
              aria-label="글자 크게"
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                fontScale === 'lg'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              <span>크게</span>
            </button>
          </div>
        </div>

        {/* Chapter Tabs */}
        {portion.chapters.length > 0 ? (
          <>
            <div
              role="tablist"
              aria-label="성경 장 선택"
              className="flex flex-wrap items-center gap-1.5 pb-6 border-b border-stone-200"
            >
              {portion.chapters.map((ch, idx) => (
                <button
                  key={`${portion.id}-ch-${idx}`}
                  type="button"
                  role="tab"
                  aria-selected={selectedChapterIdx === idx}
                  onClick={() => setSelectedChapterIdx(idx)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
                    selectedChapterIdx === idx
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#F7F4EE] text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  {ch.title.replace(/^\[|\]$/g, '').trim()}
                </button>
              ))}
              {portion.chapters.length > 1 && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedChapterIdx === -1}
                  onClick={() => setSelectedChapterIdx(-1)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] ${
                    selectedChapterIdx === -1
                      ? 'bg-stone-900 text-white'
                      : 'bg-[#F7F4EE] text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  전체 보기
                </button>
              )}
            </div>

            {/* Verse Prose List */}
            <div className="mt-6 space-y-10 max-w-prose">
              {visibleChapters.map((chapter, cIdx) => (
                <div key={`${portion.id}-content-${cIdx}`}>
                  <h3 className="font-serif-kr text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    {chapter.title.replace(/^\[|\]$/g, '').trim()}
                  </h3>
                  <ol className="space-y-3.5">
                    {chapter.verses.map((verse, vIdx) => (
                      <li
                        key={`${cIdx}-${vIdx}`}
                        className={`flex items-baseline gap-3 font-serif-kr text-stone-800 ${verseTextClass}`}
                      >
                        <span className="text-xs font-sans font-semibold text-stone-400 tabular-nums w-7 text-right shrink-0 select-none">
                          {(chapter.startVerse ?? 1) + vIdx}
                        </span>
                        <span className="flex-1">{verse}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center border border-stone-200 rounded-md bg-[#FBF9F5]">
            <p className="text-sm text-stone-600">
              이 주간의 상세 절 본문은 원본 노션 페이지에서 바로 확인하실 수 있습니다.
            </p>
            <a
              href={portion.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:underline underline-offset-4"
            >
              <span>노션 원문 열기</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </section>
    </article>
  );
};

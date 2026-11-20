import React, { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md bg-[#1E3A8A] text-white hover:bg-[#172E6E] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>앱으로 설치</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
        >
          <Smartphone className="w-4 h-4 shrink-0 text-[#1E3A8A]" aria-hidden="true" />
          <span>홈 화면에 추가</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-lg bg-[#FBF9F5] border border-stone-200 p-6 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <h3
                  id="ios-install-title"
                  className="font-serif-kr text-lg font-bold text-stone-900"
                >
                  아이폰 / 아이패드에 앱 설치
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="닫기"
                  className="p-1 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#1E3A8A] tabular-nums">1.</span>
                  <span>
                    Safari 하단 또는 상단 도구 모음의{' '}
                    <strong className="inline-flex items-center gap-1 text-stone-900">
                      <Share className="w-3.5 h-3.5 inline" aria-hidden="true" />
                      공유
                    </strong>{' '}
                    버튼을 누릅니다.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-[#1E3A8A] tabular-nums">2.</span>
                  <span>
                    아래로 내려 <strong className="text-stone-900">홈 화면에 추가</strong>를 선택하고 오른쪽 위 <strong className="text-stone-900">추가</strong>를 누릅니다.
                  </span>
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-md bg-stone-900 py-2.5 text-xs font-medium text-[#FBF9F5] hover:bg-stone-800 transition-colors cursor-pointer min-h-[40px]"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

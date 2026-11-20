import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-md border border-stone-300 bg-[#F7F4EE] px-3.5 py-2 text-xs font-medium text-stone-800 shadow-sm"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#78350F] shrink-0" aria-hidden="true" />
      <span>오프라인 모드 · 저장된 본문을 읽을 수 있습니다</span>
    </div>
  );
};

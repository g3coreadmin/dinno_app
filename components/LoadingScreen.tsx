'use client';

import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Image
        src="/images/dinno_logo_no_bg.png"
        alt="Logo"
        width={120}
        height={120}
        className="animate-pulse opacity-80"
      />
    </div>
  );
}

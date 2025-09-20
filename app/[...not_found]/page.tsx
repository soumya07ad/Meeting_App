'use client';

import Link from 'next/link';

export default function NotFoundCatchAll() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-dark-2">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">404 - Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you are looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
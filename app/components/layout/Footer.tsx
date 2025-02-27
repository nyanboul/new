import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-4 text-sm">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center">
          <div className="w-full mb-2">
            <div className="flex justify-center space-x-4 mb-2">
              <Link href="/company" className="text-gray-600 hover:text-gray-900">会社概要</Link>
              <span className="text-gray-300">|</span>
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">プライバシーポリシー</Link>
              <span className="text-gray-300">|</span>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">利用規約</Link>
              <span className="text-gray-300">|</span>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">お問い合わせ</Link>
            </div>
            <p className="text-xs text-gray-500">&copy; 2024 Otafli All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 
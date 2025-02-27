import Link from 'next/link';

type StaticPageLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export default function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        
        {children}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
} 
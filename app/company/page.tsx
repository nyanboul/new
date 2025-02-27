import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: '会社概要 | Otafli',
  description: 'Otafliの会社概要ページです。',
};

export default function CompanyPage() {
  return (
    <StaticPageLayout title="会社概要">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">会社名</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">株式会社Otafli</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">設立</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">2024年4月</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">代表取締役</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">山田 太郎</dd>
            </div>
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">所在地</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                〒100-0001<br />
                東京都千代田区千代田1-1<br />
                千代田ビル 10階
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">事業内容</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc pl-5">
                  <li>オタク向けフリマアプリの運営</li>
                  <li>電子商取引（EC）サイトの企画・開発・運営</li>
                  <li>インターネットを利用した各種情報提供サービス</li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </StaticPageLayout>
  );
} 
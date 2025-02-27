import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: 'お問い合わせ | Otafli',
  description: 'Otafliへのお問い合わせページです。',
};

export default function ContactPage() {
  return (
    <StaticPageLayout title="お問い合わせ">
      <div className="bg-white shadow rounded-lg overflow-hidden p-6">
        <p className="text-gray-700 mb-6">
          サービスに関するお問い合わせは、以下のメールアドレスにご連絡ください。
          <br />
          通常2営業日以内にご返信いたします。
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="font-medium text-blue-800">お問い合わせ先</p>
          <p className="text-blue-700 mt-2">
            Eメール：contact@otafli.example.com
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">よくあるご質問</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-900">商品が届かない場合はどうすればよいですか？</h3>
              <p className="mt-1 text-gray-600">
                発送から1週間以上経過しても商品が届かない場合は、「マイページ」の「取引一覧」から該当の取引を選択し、
                「お問い合わせ」ボタンから出品者にメッセージをお送りください。
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900">返品・交換はできますか？</h3>
              <p className="mt-1 text-gray-600">
                基本的に返品・交換は受け付けておりませんが、商品に明らかな不具合や出品情報と著しく異なる場合は、
                商品到着後3日以内にサポートへご連絡ください。
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900">アカウントを削除したいです</h3>
              <p className="mt-1 text-gray-600">
                アカウントの削除は「マイページ」の「設定」から行うことができます。ただし、取引中の商品がある場合や
                売上金が残っている場合は、それらを全て完了・引き出し後に削除が可能となります。
              </p>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
} 
import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: '利用規約 | Otafli',
  description: 'Otafliの利用規約について説明します。',
};

export default function TermsPage() {
  return (
    <StaticPageLayout title="利用規約">
      <div className="prose prose-indigo max-w-none">
        <p>
          この利用規約（以下「本規約」）は、株式会社Otafli（以下「当社」）が提供するサービス「Otafli」（以下「本サービス」）の
          利用条件を定めるものです。ユーザーの皆さま（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
        </p>
        
        <h2>第1条（適用）</h2>
        <ol>
          <li>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</li>
          <li>当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下「個別規定」といいます）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。</li>
          <li>本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。</li>
        </ol>
        
        <h2>第2条（利用登録）</h2>
        <ol>
          <li>本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。</li>
          <li>当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
            <ol>
              <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、当社が利用登録を相当でないと判断した場合</li>
            </ol>
          </li>
        </ol>
        
        {/* 省略 - 他のセクションも同様に追加 */}
        
        <h2>第16条（準拠法・裁判管轄）</h2>
        <ol>
          <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
          <li>本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。</li>
        </ol>
        
        <p className="text-right mt-8">以上</p>
        <p className="text-right">2024年4月1日 制定</p>
      </div>
    </StaticPageLayout>
  );
} 
import StaticPageLayout from '@/components/layout/StaticPageLayout';

export const metadata = {
  title: 'プライバシーポリシー | Otafli',
  description: 'Otafliのプライバシーポリシーについて説明します。',
};

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout title="プライバシーポリシー">
      <div className="prose prose-indigo max-w-none">
        <p>
          株式会社Otafli（以下「当社」）は、当社が提供するサービス「Otafli」（以下「本サービス」）における、
          ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」）を定めます。
        </p>
        
        <h2>1. 個人情報の収集方法</h2>
        <p>
          当社は、ユーザーが本サービスを利用する際に、氏名、生年月日、住所、電話番号、メールアドレス、
          銀行口座情報、クレジットカード情報などの個人情報をお尋ねすることがあります。
          また、ユーザーと提携先などとの間でなされた取引の内容や、ユーザーが本サービス上で行った
          閲覧・購入履歴等の情報も取得する場合があります。
        </p>
        
        <h2>2. 個人情報を収集・利用する目的</h2>
        <p>当社が個人情報を収集・利用する目的は、以下のとおりです。</p>
        <ul>
          <li>本サービスの提供・運営のため</li>
          <li>ユーザーからのお問い合わせに回答するため</li>
          <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内のメールを送付するため</li>
          <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
          <li>利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため</li>
          <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
          <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
          <li>上記の利用目的に付随する目的</li>
        </ul>
        
        <h2>3. 個人情報の第三者提供</h2>
        <p>
          当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を
          提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。
        </p>
        
        {/* 省略 - 他のセクションも同様に追加 */}
        
        <h2>7. お問い合わせ先</h2>
        <p>本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。</p>
        <p>
          株式会社Otafli 個人情報保護担当<br />
          Eメール：privacy@otafli.example.com
        </p>
      </div>
    </StaticPageLayout>
  );
} 
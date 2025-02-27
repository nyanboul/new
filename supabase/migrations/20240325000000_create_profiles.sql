-- profiles tableの作成
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text unique not null,
  avatar_url text,
  bio text,
  location text,
  rating decimal(2,1) default 0,
  total_sales integer default 0,
  total_purchases integer default 0,
  is_verified boolean default false,
  status text default 'active',
  email_notifications boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- updated_at自動更新のトリガー
create trigger handle_updated_at
  before update on profiles
  for each row
  execute procedure moddatetime (updated_at);

-- 新規ユーザー作成時の自動プロフィール作成
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLSポリシーの設定
alter table profiles enable row level security;

create policy "プロフィールは誰でも参照可能"
  on profiles for select
  using (true);

create policy "ユーザーは自分のプロフィールのみ更新可能"
  on profiles for update
  using (auth.uid() = id); 
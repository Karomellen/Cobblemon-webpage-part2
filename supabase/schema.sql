create table if not exists public.archive_issues (
  id uuid primary key default gen_random_uuid(),
  username varchar(50) not null,
  date date not null,
  subtext varchar(500) not null,
  image_url text not null,
  storage_path text not null unique,
  discord_message_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.archive_issues enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'archive-images',
  'archive-images',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

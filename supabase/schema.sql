-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Site Content Table (for static sections like Hero, About, etc.)
create table public.site_content (
  id uuid not null default uuid_generate_v4(),
  section text not null, -- 'hero', 'about', 'portfolio', 'contact', 'mobileMenu', 'dropdown', 'footer'
  locale text not null, -- 'id', 'en'
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  unique (section, locale)
);

-- Projects Table
create table public.projects (
  id uuid not null default uuid_generate_v4(),
  key text not null unique,
  year text not null,
  stack text[] not null,
  repo_url text not null,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Project Translations Table
create table public.project_translations (
  id uuid not null default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  locale text not null,
  title text not null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  unique (project_id, locale)
);

-- Contacts Table
create table public.contacts (
  id uuid not null default uuid_generate_v4(),
  key text not null unique,
  href text not null,
  value text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Contact Translations Table
create table public.contact_translations (
  id uuid not null default uuid_generate_v4(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  locale text not null,
  label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id),
  unique (contact_id, locale)
);

-- RLS Policies
alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_translations enable row level security;

-- Public read access
create policy "Allow public read access on site_content" on public.site_content for select using (true);
create policy "Allow public read access on projects" on public.projects for select using (true);
create policy "Allow public read access on project_translations" on public.project_translations for select using (true);
create policy "Allow public read access on contacts" on public.contacts for select using (true);
create policy "Allow public read access on contact_translations" on public.contact_translations for select using (true);

-- Admin write access (assuming authenticated users are admins for this portfolio)
create policy "Allow authenticated insert on site_content" on public.site_content for insert to authenticated with check (true);
create policy "Allow authenticated update on site_content" on public.site_content for update to authenticated using (true);
create policy "Allow authenticated delete on site_content" on public.site_content for delete to authenticated using (true);

create policy "Allow authenticated insert on projects" on public.projects for insert to authenticated with check (true);
create policy "Allow authenticated update on projects" on public.projects for update to authenticated using (true);
create policy "Allow authenticated delete on projects" on public.projects for delete to authenticated using (true);

create policy "Allow authenticated insert on project_translations" on public.project_translations for insert to authenticated with check (true);
create policy "Allow authenticated update on project_translations" on public.project_translations for update to authenticated using (true);
create policy "Allow authenticated delete on project_translations" on public.project_translations for delete to authenticated using (true);

create policy "Allow authenticated insert on contacts" on public.contacts for insert to authenticated with check (true);
create policy "Allow authenticated update on contacts" on public.contacts for update to authenticated using (true);
create policy "Allow authenticated delete on contacts" on public.contacts for delete to authenticated using (true);

create policy "Allow authenticated insert on contact_translations" on public.contact_translations for insert to authenticated with check (true);
create policy "Allow authenticated update on contact_translations" on public.contact_translations for update to authenticated using (true);
create policy "Allow authenticated delete on contact_translations" on public.contact_translations for delete to authenticated using (true);

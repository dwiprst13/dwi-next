-- 1. Create the 'portfolio' bucket
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 2. Enable RLS on objects (usually enabled by default, but good to ensure)
alter table storage.objects enable row level security;

-- 3. Policy: Allow Public Read Access (Everyone can view images)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- 4. Policy: Allow Authenticated Uploads (Only logged in users can upload)
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'portfolio' );

-- 5. Policy: Allow Authenticated Updates (Only logged in users can update)
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'portfolio' );

-- 6. Policy: Allow Authenticated Deletes (Only logged in users can delete)
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'portfolio' );

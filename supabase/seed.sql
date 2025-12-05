-- Seed Site Content (ID)
INSERT INTO public.site_content (section, locale, content) VALUES
('brand', 'id', '"PRAST13"'),
('nav', 'id', '[{"href": "#home", "label": "Beranda"}, {"href": "#tentang", "label": "Tentang"}, {"href": "#portofolio", "label": "Portofolio"}, {"href": "#kontak", "label": "Kontak"}]'),
('hero', 'id', '{"eyebrow": "PORTOFOLIO", "title": "Halo! Aku Dwi Prasetia.", "paragraphs": ["Aku suka ngoding dan ngulik hal-hal baru, mulai dari backend, mobile, sampai project random yang tiba-tiba kepikiran dan langsung aku coba.", "Biasanya aku pakai Go, Laravel, React, tapi sebenarnya fleksibel selama bisa bikin sesuatu yang berguna dan seru dikerjain. Banyak project-ku berangkat dari masalah kecil di sekitar yang aku selesain pakai aplikasi simpel.", "Kalau lagi nggak ngoding aku biasanya scroll cari inspirasi, belajar hal baru, atau mikirin side project berikutnya."], "stats": [{"label": "Fokus", "value": "Backend-first"}, {"label": "Stack", "value": "Go · Laravel · React"}, {"label": "Mood", "value": "Side project tiap minggu"}], "avatarButtonLabel": "Lihat avatar Dwi Prasetia", "availability": {"heading": "Saat ini", "role": "Backend Programmer", "description": "Lagi sibuk bangun API yang stabil sembari ngulik service kecil buat bantu workflow tim.", "name": "Dwi Prasetia", "location": "Jogja · Remote friendly"}}'),
('about', 'id', '{"eyebrow": "Tentang saya", "heading": "Aku programmer yang berfokus di backend dan selalu penasaran bikin solusi baru.", "paragraphs": ["Dari API, worker, sampai service kecil untuk mobile, aku senang nyusun arsitektur yang simpel tapi tangguh. Walaupun identitas utamanya di backend, aku nyaman nge-tweak antarmuka biar UX-nya kena."], "skills": ["Go & Laravel", "API Design", "Mobile tinkering", "Problem solving"]}'),
('portfolio', 'id', '{"eyebrow": "Portofolio", "heading": "Project random dan eksplorasi backend.", "cta": "Semua repositori →", "dropdownTitle": "Portofolio lainnya", "dropdownClosed": "Lihat lainnya", "dropdownOpen": "Sembunyikan"}'),
('contact', 'id', '{"eyebrow": "Kontak", "heading": "Mari ngobrol soal backend, mobile, atau ide liar berikutnya.", "description": "Kirim email atau DM kapan aja. Aku terbuka buat kolaborasi bikin tool internal, eksperimen mobile, sampai proyek kecil yang lahir dari keresahan sehari-hari.", "openLabel": "buka"}'),
('mobileMenu', 'id', '{"title": "Navigasi", "github": "GitHub", "toggleLabel": "Menu mobile"}'),
('dropdown', 'id', '{"label": "Menu dropdown"}'),
('footer', 'id', '{"tagline": "Stay monochrome."}'),
('avatarModalLabel', 'id', '"Avatar Dwi Prasetia"');

-- Seed Site Content (EN)
INSERT INTO public.site_content (section, locale, content) VALUES
('brand', 'en', '"PRAST13"'),
('nav', 'en', '[{"href": "#home", "label": "Home"}, {"href": "#tentang", "label": "About"}, {"href": "#portofolio", "label": "Work"}, {"href": "#kontak", "label": "Contact"}]'),
('hero', 'en', '{"eyebrow": "PORTFOLIO", "title": "Hi! I''m Dwi Prasetia.", "paragraphs": ["I love writing code and tinkering with new things, from backend services and mobile tools to random ideas that pop up and instantly turn into side projects.", "Go, Laravel, and React are my go-to stack, but I stay flexible as long as the work is useful and exciting. Most projects start from tiny pain points I find around me and end up as simple apps.", "When I''m not coding, I''m usually scrolling for inspiration, learning something new, or thinking about the next side project."], "stats": [{"label": "Focus", "value": "Backend-first"}, {"label": "Stack", "value": "Go · Laravel · React"}, {"label": "Mood", "value": "Side project every week"}], "avatarButtonLabel": "Open avatar modal", "availability": {"heading": "Current role", "role": "Backend Programmer", "description": "Shipping reliable APIs while prototyping helper services for the team workflow.", "name": "Dwi Prasetia", "location": "Jogja · Remote friendly"}}'),
('about', 'en', '{"eyebrow": "About me", "heading": "Backend-minded engineer who enjoys building simple yet resilient solutions.", "paragraphs": ["From APIs and workers to small utilities for mobile, I like crafting architecture that stays practical. Even though backend is my home, I still enjoy tweaking the interface so the UX feels right."], "skills": ["Go & Laravel", "API Design", "Mobile tinkering", "Problem solving"]}'),
('portfolio', 'en', '{"eyebrow": "Work", "heading": "Sandbox projects and backend explorations.", "cta": "View all repos →", "dropdownTitle": "More repositories", "dropdownClosed": "Show more", "dropdownOpen": "Hide"}'),
('contact', 'en', '{"eyebrow": "Contact", "heading": "Let''s talk backend, mobile, or your next wild idea.", "description": "Ping me anytime. I''m open to collaborate on internal tooling, mobile experiments, or small products born from everyday frustrations.", "openLabel": "open"}'),
('mobileMenu', 'en', '{"title": "Navigation", "github": "GitHub", "toggleLabel": "Mobile menu"}'),
('dropdown', 'en', '{"label": "Dropdown menu"}'),
('footer', 'en', '{"tagline": "Stay monochrome."}'),
('avatarModalLabel', 'en', '"Dwi Prasetia''s avatar"');

-- Seed Projects
-- Sekndess
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('sekndess', '2024', ARRAY['PHP', 'MySQL', 'Vanilla JS', 'TailwindCSS'], 'https://github.com/dwiprst13/sekndess', true)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Sekndess', 'Website desa dengan CMS sederhana berbasis PHP native untuk mengelola konten dinamis.' FROM p
UNION ALL
SELECT id, 'en', 'Sekndess', 'Village portal built with native PHP and a lightweight CMS to manage dynamic content.' FROM p;

-- Money Tracker API
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('money-tracker-api', '2025', ARRAY['Go', 'Gin', 'GORM', 'PostgreSQL'], 'https://github.com/dwiprst13/money-tracker', true)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Money Tracker API', 'API manajemen keuangan dengan autentikasi, pencatatan transaksi, dan laporan otomatis.' FROM p
UNION ALL
SELECT id, 'en', 'Money Tracker API', 'Finance management API powering auth, CRUD flows, and reporting for transaction tracking.' FROM p;

-- Blog REST API
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('blog-rest-api', '2025', ARRAY['PHP', 'Laravel', 'PostgreSQL', 'TailwindCSS'], 'https://github.com/dwiprst13/laravel-api', true)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Rest API Blog Website', 'Backend Laravel untuk blog—menyediakan endpoint posting, komentar, dan manajemen pengguna.' FROM p
UNION ALL
SELECT id, 'en', 'Blog Website REST API', 'Laravel backend powering posts, comments, and user management endpoints for a blog platform.' FROM p;

-- Password CLI
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('password-cli', '2025', ARRAY['Go'], 'https://github.com/dwiprst13/passgen', false)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Password Generator CLI', 'Generator kata sandi Go dengan opsi panjang dan keamanan kriptografi.' FROM p
UNION ALL
SELECT id, 'en', 'Password Generator CLI', 'Go-based password generator with crypto-safe randomness and simple flags.' FROM p;

-- Money Tracker FE
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('money-tracker-fe', '2025', ARRAY['Vue', 'TailwindCSS'], 'https://github.com/dwiprst13/money-tracker-fe', false)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Money Tracker Frontend', 'Dashboard frontend untuk Money Tracker API dengan grafik dan filter realtime.' FROM p
UNION ALL
SELECT id, 'en', 'Money Tracker Frontend', 'Frontend dashboard for the Money Tracker API featuring charts and realtime filters.' FROM p;

-- Blog Admin React
WITH p AS (
  INSERT INTO public.projects (key, year, stack, repo_url, is_featured)
  VALUES ('blog-admin-react', '2025', ARRAY['React', 'TailwindCSS'], 'https://github.com/dwiprst13/dwiprasetia-admin-react', false)
  RETURNING id
)
INSERT INTO public.project_translations (project_id, locale, title, description)
SELECT id, 'id', 'Blog Website Admin Panel', 'Panel admin React untuk mengelola konten blog dan peran pengguna.' FROM p
UNION ALL
SELECT id, 'en', 'Blog Website Admin Panel', 'React admin panel to handle blog content workflow and user roles.' FROM p;

-- Seed Contacts
WITH c AS (
  INSERT INTO public.contacts (key, href, value, display_order)
  VALUES ('email', 'mailto:dwiprasetia26@gmail.com', 'dwiprasetia26@gmail.com', 1)
  RETURNING id
)
INSERT INTO public.contact_translations (contact_id, locale, label)
SELECT id, 'id', 'Email' FROM c
UNION ALL
SELECT id, 'en', 'Email' FROM c;

WITH c AS (
  INSERT INTO public.contacts (key, href, value, display_order)
  VALUES ('github', 'https://github.com/dwiprst13', 'github.com/dwiprst13', 2)
  RETURNING id
)
INSERT INTO public.contact_translations (contact_id, locale, label)
SELECT id, 'id', 'GitHub' FROM c
UNION ALL
SELECT id, 'en', 'GitHub' FROM c;

WITH c AS (
  INSERT INTO public.contacts (key, href, value, display_order)
  VALUES ('linkedin', 'https://www.linkedin.com/in/dwiprasetia13', 'in/dwiprasetia13', 3)
  RETURNING id
)
INSERT INTO public.contact_translations (contact_id, locale, label)
SELECT id, 'id', 'LinkedIn' FROM c
UNION ALL
SELECT id, 'en', 'LinkedIn' FROM c;

WITH c AS (
  INSERT INTO public.contacts (key, href, value, display_order)
  VALUES ('instagram', 'https://www.instagram.com/prasttt13_', '@prasttt13_', 4)
  RETURNING id
)
INSERT INTO public.contact_translations (contact_id, locale, label)
SELECT id, 'id', 'Instagram' FROM c
UNION ALL
SELECT id, 'en', 'Instagram' FROM c;

-- =========================================================
-- The Breve Hub — Initial Schema
-- Paste this into Supabase SQL Editor and Run
-- =========================================================

-- Admins (dashboard users)
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'staff' check (role in ('owner','manager','staff')),
  created_at timestamptz default now()
);

-- Bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  date date not null,
  start_time time,
  end_time time,
  hours int not null default 1,
  client_name text not null,
  email text not null,
  phone text not null,
  event_type text,
  attendees int,
  extras jsonb default '[]'::jsonb,
  total numeric not null default 0,
  deposit numeric not null default 0,
  balance numeric not null default 0,
  status text not null default 'pending' check (status in ('pending','paid','confirmed','cancelled','completed')),
  payment_ref text,
  notes text,
  created_at timestamptz default now()
);
create index if not exists bookings_date_idx on bookings(date);
create index if not exists bookings_status_idx on bookings(status);

-- Events
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  host text,
  date date not null,
  start_time time,
  end_time time,
  price numeric default 0,
  capacity int,
  poster_url text,
  gallery jsonb default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz default now()
);
create index if not exists events_date_idx on events(date);
create index if not exists events_status_idx on events(status);

-- Gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Extras
create table if not exists extras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  active boolean default true,
  sort_order int default 0
);

-- Inclusions
create table if not exists inclusions (
  id uuid primary key default gen_random_uuid(),
  icon text,
  title text not null,
  description text,
  sort_order int default 0
);

-- FAQs
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int default 0
);

-- Testimonials
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  quote text not null,
  photo_url text,
  rating int default 5,
  published boolean default true,
  created_at timestamptz default now()
);

-- Contact messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Clients (CRM)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now()
);

-- Settings
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Activity log
create table if not exists activity (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  action text not null,
  target text,
  meta jsonb,
  created_at timestamptz default now()
);

-- =========================================================
-- SEED DATA
-- =========================================================

-- Default admin: username=admin / password=brevehub2025
insert into admins (username, password_hash, role)
values (
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'owner'
) on conflict (username) do nothing;

insert into settings (key, value) values
  ('hourly_rate', '35000'::jsonb),
  ('deposit_percent', '50'::jsonb),
  ('brand_name', '"Soundbank Media and Entertainment"'::jsonb),
  ('venue_name', '"The Breve Hub"'::jsonb),
  ('address', '"No. 258 Awolowo Road, Beside Friendly Top Petrol Station, Molete, Ibadan"'::jsonb),
  ('phone', '"+234 801 234 5678"'::jsonb),
  ('email', '"bookings@soundbankmedia.com"'::jsonb),
  ('whatsapp', '"2348012345678"'::jsonb)
on conflict (key) do nothing;

insert into inclusions (icon, title, description, sort_order) values
  ('Users', '50 Seats', 'Comfortable, spaced seating for 50 guests.', 1),
  ('Zap', 'Back Up Power Supply', 'Zero interruptions — power stays on.', 2),
  ('Wifi', 'WiFi', 'Fast, reliable internet for all attendees.', 3),
  ('Monitor', 'Smart Display Screen', 'Crisp presentations, videos & slides.', 4),
  ('Mic', 'PA System', '2 microphones + clear audio coverage.', 5),
  ('Snowflake', 'Air Condition', 'Cool, comfortable environment.', 6),
  ('Lightbulb', 'LED Stage Light', 'Professional stage lighting + technical support.', 7)
on conflict do nothing;

insert into extras (name, description, price, sort_order) values
  ('Livestreaming', 'Broadcast your event live to remote attendees.', 50000, 1),
  ('Audio Recording', 'Clean multi-track audio of your event.', 30000, 2),
  ('Video Coverage', 'Professional multi-cam video recording.', 80000, 3),
  ('Photography', 'Event photography with edited highlights.', 60000, 4)
on conflict do nothing;

insert into faqs (question, answer, sort_order) values
  ('How do I book the hall?', 'Pick your date on the calendar, choose hours, add extras, and pay 50% deposit to lock it in.', 1),
  ('What''s included in ₦35,000/hour?', '50 seats, backup power, WiFi, smart screen, PA system (2 mics), AC, LED stage light, and technical support.', 2),
  ('Can I pay at the venue?', 'No. A 50% deposit locks your date online. Balance is due 48 hours before the event.', 3),
  ('Do you offer livestreaming?', 'Yes — livestreaming, audio recording, video coverage, and photography are available as paid add-ons.', 4),
  ('Is parking available?', 'Yes, and we''re right by the roadside on Awolowo Road — no stressful turns.', 5),
  ('What''s the cancellation policy?', 'Deposits are transferable to a new date within 7 days. Full policy sent with your invoice.', 6)
on conflict do nothing;

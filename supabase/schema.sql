-- ──────────────────────────────────────────────────────────
-- MILES FOR SMILES 5K — SUPABASE REGISTRATIONS TABLE SCHEMA
-- ──────────────────────────────────────────────────────────

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  gender text not null,
  blood_group text not null,
  dob text not null,
  weight text,
  height text,
  t_shirt_size text not null,
  email text not null,
  phone text not null,
  city text not null,
  emergency_name text not null,
  emergency_phone text not null,
  category text not null,
  amount numeric not null,
  chest_number text not null unique,
  bib_number text not null unique,
  razorpay_order_id text not null,
  razorpay_payment_id text not null,
  payment_status text not null default 'paid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Allow server service role to read/write registrations
create policy "Allow service role full access" on public.registrations
  for all using (true) with check (true);

-- Allow public insert (if direct client insert is used)
create policy "Allow public insert" on public.registrations
  for insert with check (true);

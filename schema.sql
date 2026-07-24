-- ============================================================
-- PORTFOLIO JOE PENA · ESQUEMA COMPLETO PARA SUPABASE
-- Pegar TODO en: Supabase Dashboard > SQL Editor > New query > Run
-- Idempotente: se puede volver a ejecutar sin romper nada.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. CONFIGURACION GLOBAL (estilo del panel + textos editables)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  id          text primary key default 'default',
  style       jsonb not null default '{}'::jsonb,   -- capas, tipografias, colores, numeralia, hero
  texts       jsonb not null default '{}'::jsonb,   -- todos los [data-t] del sitio
  updated_at  timestamptz not null default now()
);
comment on table public.site_settings is 'Una sola fila (id = default) con el estilo y los textos del sitio.';

insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2. IMAGENES POR SECCION
-- ------------------------------------------------------------
create table if not exists public.site_images (
  id            uuid primary key default gen_random_uuid(),
  slot          text unique not null,      -- bg, ava, hero, tst, pj1..pj5
  section       text not null default '',  -- Fondo, Perfil, Hero, Testimonio, Proyectos
  url           text not null,
  storage_path  text,
  alt           text default '',
  position      int  not null default 0,
  updated_at    timestamptz not null default now()
);
create index if not exists site_images_section_idx on public.site_images (section, position);

-- ------------------------------------------------------------
-- 3. BOTONES CONFIGURABLES
-- ------------------------------------------------------------
create table if not exists public.site_buttons (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,          -- hero_primary, hero_secondary, side_cta, topbar_cta
  label         text not null,
  href          text default '',
  action        text not null default 'link'   check (action in ('link','modal','scroll','submit')),
  target_modal  text default '',               -- referencia a site_modals.key
  variant       text not null default 'lime'   check (variant in ('lime','dark','ghost','icon')),
  icon          text default '',
  position      int  not null default 0,
  visible       boolean not null default true,
  updated_at    timestamptz not null default now()
);

insert into public.site_buttons (key,label,action,target_modal,variant,position) values
  ('hero_primary',  'Ver Proyectos',   'scroll','',         'lime', 1),
  ('hero_secondary','Contactame',      'modal','mkContacto','dark', 2),
  ('side_cta',      'Iniciar Proyecto','modal','mkContacto','lime', 3),
  ('topbar_cta',    'Iniciar Proyecto','modal','mkContacto','lime', 4)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- 4. MODALES (contenido informativo)
-- ------------------------------------------------------------
create table if not exists public.site_modals (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,            -- mkContacto, mkPromo, mkTest, mkLeg
  title       text not null default '',
  subtitle    text default '',
  kicker      text default '',
  body_html   text default '',
  kind        text not null default 'glass'    check (kind in ('glass','flip3d','form')),
  accent      text not null default '#c9f31d',
  position    int  not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

insert into public.site_modals (key,title,subtitle,kicker,kind,position) values
  ('mkContacto','Contactame','Cuentame de tu proyecto y te respondo en menos de 24 horas.','Hablemos','form',1),
  ('mkPromo','Programa de promocion','Beneficios para clientes y aliados','Otras secciones','glass',2),
  ('mkTest','Programa testers','Creadores e influencers','Otras secciones','glass',3),
  ('mkLeg','Legales y Copyright','Actualizado: 23 de julio de 2026','Documento','glass',4)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- 5. MENSAJES DEL FORMULARIO DE CONTACTO
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text default '',
  message     text not null,
  source      text default 'web',
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ------------------------------------------------------------
-- 6. TRIGGER updated_at
-- ------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['site_settings','site_images','site_buttons','site_modals'] loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$s
                    for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- 7. RLS: lectura publica · escritura solo autenticados
-- ------------------------------------------------------------
alter table public.site_settings    enable row level security;
alter table public.site_images      enable row level security;
alter table public.site_buttons     enable row level security;
alter table public.site_modals      enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare t text;
begin
  foreach t in array array['site_settings','site_images','site_buttons','site_modals'] loop
    execute format('drop policy if exists "lectura publica" on public.%1$s', t);
    execute format('create policy "lectura publica" on public.%1$s for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "escritura editor" on public.%1$s', t);
    execute format('create policy "escritura editor" on public.%1$s for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- El formulario permite INSERT anonimo, pero solo el editor puede leer
drop policy if exists "insertar mensaje" on public.contact_messages;
create policy "insertar mensaje" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "leer mensajes editor" on public.contact_messages;
create policy "leer mensajes editor" on public.contact_messages
  for select to authenticated using (true);

drop policy if exists "borrar mensajes editor" on public.contact_messages;
create policy "borrar mensajes editor" on public.contact_messages
  for delete to authenticated using (true);

-- ------------------------------------------------------------
-- 8. STORAGE: bucket publico "media"
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media','media', true)
on conflict (id) do update set public = true;

drop policy if exists "media lectura publica" on storage.objects;
create policy "media lectura publica" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

drop policy if exists "media subir editor" on storage.objects;
create policy "media subir editor" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media actualizar editor" on storage.objects;
create policy "media actualizar editor" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media borrar editor" on storage.objects;
create policy "media borrar editor" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- ------------------------------------------------------------
-- 9. VISTA DE CORTESIA: todo el sitio en una sola consulta
-- ------------------------------------------------------------
create or replace view public.site_bundle as
select
  (select row_to_json(s) from public.site_settings s where s.id='default') as settings,
  (select coalesce(json_agg(i order by i.section, i.position),'[]'::json) from public.site_images i)  as images,
  (select coalesce(json_agg(b order by b.position),'[]'::json) from public.site_buttons b where b.visible) as buttons,
  (select coalesce(json_agg(m order by m.position),'[]'::json) from public.site_modals  m where m.visible) as modals;

-- ============================================================
-- FIN. Siguiente paso: crear tu usuario editor en
-- Authentication > Users > Add user  (email + password)
-- ============================================================

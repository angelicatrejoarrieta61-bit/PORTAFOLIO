# Portfolio Joe Pena — Vercel + Supabase

Sitio de una sola pagina, sin build. Funciona en local sin Supabase (guarda en el navegador)
y se conecta a la nube en cuanto pegas tus credenciales.

```
portfolio-joe/
├── index.html            App completa (HTML + CSS + JS)
├── config.js             Credenciales publicas de Supabase
├── vercel.json           Cabeceras de seguridad y cache
├── .gitignore
└── supabase/schema.sql   Base de datos completa (pegar en SQL Editor)
```

---

## PASO 1 · Crear el proyecto en Supabase

1. Entra a https://supabase.com/dashboard → **New project**
2. Nombre: `portfolio-joe` · Region: `East US` o la mas cercana a Mexico
3. Guarda la contrasena de la base de datos que te genere
4. Espera ~2 minutos a que termine de aprovisionar

## PASO 2 · Crear las tablas

1. Menu lateral → **SQL Editor** → **New query**
2. Abre `supabase/schema.sql`, copia **todo** el contenido y pegalo
3. Presiona **Run** (o Ctrl+Enter)
4. Debe decir *Success. No rows returned*

Esto crea:

| Objeto | Para que sirve |
|---|---|
| `site_settings` | Estilo del panel (capas, tipografias, colores, numeralia, hero) y todos los textos |
| `site_images` | Imagenes por seccion: fondo, perfil, hero, testimonio y los 5 proyectos |
| `site_buttons` | Botones configurables: etiqueta, accion, modal destino, variante |
| `site_modals` | Contenido de los modales (titulo, subtitulo, cuerpo HTML) |
| `contact_messages` | Mensajes que llegan del formulario de contacto |
| bucket `media` | Storage publico donde viven las imagenes subidas |
| vista `site_bundle` | Todo el sitio en una sola consulta |

**Seguridad ya configurada (RLS):** cualquiera puede *leer* el contenido publico y *enviar* un
mensaje de contacto; solo un usuario autenticado puede *editar* estilo, imagenes, botones,
modales y *leer* los mensajes recibidos.

## PASO 3 · Crear tu usuario editor

1. Menu lateral → **Authentication** → **Users** → **Add user**
2. Marca *Auto Confirm User*, pon tu correo y una contrasena fuerte
3. Ese sera el unico que puede guardar cambios

## PASO 4 · Pegar las credenciales

1. **Project Settings → API**
2. Copia *Project URL* y *anon public key*
3. Abre `config.js` y reemplaza:

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://xxxxxxxxxxxx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOi..."
};
```

La `anon key` es publica por diseno: no da acceso a nada que RLS no permita.

## PASO 5 · Subir a Vercel

### Opcion A — desde GitHub (recomendado)

```bash
cd portfolio-joe
git init
git add .
git commit -m "Portfolio Joe Pena"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/portfolio-joe.git
git push -u origin main
```

Luego en https://vercel.com/new → *Import Git Repository* → elige el repo →
**Framework Preset: Other** · Build Command: *(vacio)* · Output Directory: *(vacio)* → **Deploy**.

### Opcion B — desde la terminal

```bash
npm i -g vercel
cd portfolio-joe
vercel          # despliegue de prueba
vercel --prod   # despliegue definitivo
```

Cuando pregunte *In which directory is your code located?* responde `./`
y en *Want to override the settings?* responde **No**.

## PASO 6 · Dominio propio (opcional)

Vercel → tu proyecto → **Settings → Domains → Add** → escribe `joepena.design`
y agrega en tu proveedor DNS el registro que te indique (normalmente `A 76.76.21.21`
para el dominio raiz y `CNAME cname.vercel-dns.com` para `www`).

---

## Como se usa el admin

Los controles viven arriba a la derecha. Se ocultan con el ojo o con la tecla **H**.

| Boton | Funcion |
|---|---|
| Sliders | Panel de estilo: 4 capas de cristal, acento, tipografias, numeralia, hero, lienzo |
| Galeria | **Gestor de imagenes por seccion**: fondo, perfil, hero, testimonio y proyectos |
| Imagen | Atajo directo para cambiar solo la foto de fondo |
| Guardar | Guarda estilo, textos e imagenes. Si hay Supabase pide correo y contrasena la primera vez |
| PDF | Exporta el portfolio en horizontal |
| Reset | Restaura todo a los valores originales |

**Textos editables:** haz clic sobre nombre, titular, parrafos, datos de contacto o el cuerpo de
los modales informativos y escribe. Se guardan solos.

## Medidas recomendadas de imagen

| Seccion | Medida | Nota |
|---|---|---|
| Fondo general | 1920 x 1080 | Horizontal, tono oscuro |
| Foto de perfil | 600 x 600 | Cuadrada, rostro centrado |
| Hero principal | 1200 x 1500 | Vertical 4:5, **sujeto pegado a la derecha** |
| Testimonio | 300 x 300 | Cuadrada |
| Proyectos (5) | 800 x 550 | 16:11 horizontal |

Las imagenes se recomprimen solas antes de subir, asi que no te preocupes por el peso.

## Modales

- **Contactame** — modal 3D: gira desde el boton que lo abrio y traza una linea punteada
  que apunta de vuelta a ese boton. Incluye formulario que escribe en `contact_messages`.
- **Programa de promocion · Programa testers · Legales y Copyright** — modales de cristal
  con titulo en neon y cuerpo editable. Pega ahi tus textos cuando los tengas.

Para leer los mensajes recibidos: Supabase → **Table Editor → contact_messages**.

## Solucion de problemas

| Sintoma | Causa y solucion |
|---|---|
| Dice "Local" en la barra | Falta pegar las credenciales en `config.js` |
| No guarda en la nube | No has iniciado sesion: pulsa Guardar y captura correo/contrasena |
| Las imagenes no suben | Verifica que el bucket `media` exista y sea publico |
| Los cambios no se ven | Ctrl+Shift+R para saltar la cache del navegador |

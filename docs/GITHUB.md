# Subir TrawiStats a GitHub

## Paso 1: Crear el repositorio en GitHub

1. Ve a [github.com](https://github.com) y haz login
2. Click en el botón **"+"** (arriba derecha) → **New repository**
3. Configura:
   - **Repository name**: `TrawiStats` (o el nombre que prefieras)
   - **Description**: "Monitor de crecimiento de Instagram para Trawi Viajes"
   - **Visibility**: 
     - ✅ **Private** (recomendado, contiene tu token de Apify)
     - ⚠️ Public (solo si quitas datos sensibles)
   - **NO** marques "Initialize with README" (ya tienes uno)
4. Click **Create repository**

---

## Paso 2: Conectar tu proyecto local con GitHub

Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Users\Usuario\Desktop\TrawiStats V1"
```

### 2.1 Verificar que Git esté inicializado
```powershell
git status
```

Si dice `fatal: not a git repository`, inicializa:
```powershell
git init
```

### 2.2 Agregar el remote de GitHub
Copia la URL que GitHub te mostró (algo como `https://github.com/TU_USUARIO/TrawiStats.git`) y ejecuta:

```powershell
git remote add origin https://github.com/TU_USUARIO/TrawiStats.git
```

### 2.3 Verificar el remote
```powershell
git remote -v
```

Debe mostrar:
```
origin  https://github.com/TU_USUARIO/TrawiStats.git (fetch)
origin  https://github.com/TU_USUARIO/TrawiStats.git (push)
```

---

## Paso 3: Hacer el primer push

### 3.1 Verificar qué archivos se subirán
```powershell
git status
```

Deberías ver archivos en verde (staged) y ninguno sensible como `.env.local` o `data/`.

### 3.2 Si hay archivos que no deberían subirse
El `.gitignore` ya está configurado para excluir:
- `.env.local` (tu token de Apify)
- `data/` (tus datos históricos)
- `node_modules/`
- `.next/`

Si ves alguno de estos en `git status`, significa que ya fueron agregados antes. Elimínalos del staging:
```powershell
git rm --cached -r data/
git rm --cached .env.local
```

### 3.3 Subir a GitHub
```powershell
git branch -M main
git push -u origin main
```

Te pedirá autenticación:
- **Usuario**: Tu username de GitHub
- **Password**: Un **Personal Access Token** (NO tu contraseña)

#### ¿Cómo crear un Personal Access Token?
1. GitHub → Settings (tu perfil) → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Nombre: "TrawiStats Deploy"
4. Permisos: Marca **repo** (todos los checkboxes de repo)
5. Generate token
6. **Copia el token** (solo se muestra una vez)
7. Úsalo como "password" en el push

---

## Paso 4: Verificar en GitHub

1. Ve a `https://github.com/TU_USUARIO/TrawiStats`
2. Deberías ver todos tus archivos excepto:
   - `.env.local` ✅
   - `data/` ✅
   - `node_modules/` ✅

---

## Paso 5: Clonar en el servidor (DigitalOcean)

Cuando hagas el deployment, en lugar de copiar archivos manualmente:

```bash
cd /var/www
git clone https://github.com/TU_USUARIO/TrawiStats.git trawistats
cd trawistats
```

Si el repo es privado, GitHub te pedirá autenticación. Usa el mismo token.

---

## Comandos para futuras actualizaciones

### En tu PC (después de hacer cambios):
```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

### En el servidor (para actualizar):
```bash
cd /var/www/trawistats
git pull
npm install
npm run build
pm2 restart trawistats
```

---

## Archivos importantes que SÍ se suben:
✅ Todo el código fuente  
✅ `README.md`, `docs/`  
✅ `package.json`, `tsconfig.json`  
✅ `public/` (logo, etc.)  

## Archivos que NO se suben (protegidos por .gitignore):
❌ `.env.local` (token de Apify)  
❌ `data/` (historial de seguidores)  
❌ `node_modules/` (dependencias)  
❌ `.next/` (build de Next.js)  

---

**Nota de Seguridad**: Si accidentalmente subiste `.env.local`, **regenera tu token de Apify inmediatamente** y actualiza el archivo en el servidor.

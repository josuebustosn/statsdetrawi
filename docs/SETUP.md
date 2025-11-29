# Configuración y Puesta en Marcha

## Requisitos Previos

1.  **Node.js**: v18 o superior.
2.  **Python**: v3.8 o superior.
3.  **Cuenta de Apify**: Con saldo o plan gratuito para usar el actor de Instagram.

## Instalación

1.  Instalar dependencias de Node.js:
    ```bash
    npm install
    ```

2.  Instalar dependencias de Python:
    ```bash
    pip install apify-client
    ```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con tu token de Apify:

```env
APIFY_TOKEN=tu_token_de_apify_aqui
```

## Ejecución

Para desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Mantenimiento

-   **Intervalo de Actualización**: Configurado en `lib/storage.ts` (variable `baseDuration`). Actualmente 2 horas.
-   **Usuario Objetivo**: Configurado en `app/page.tsx` (variable `username`).
-   **Datos Históricos**: Se guardan en `data/history.json`. Puedes editar este archivo manualmente si necesitas corregir datos.

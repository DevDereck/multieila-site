# Multieila — Plantilla web con cotizador y envío de correo

Este repositorio contiene la plantilla responsive para Multieila con:

- Página estática (index.html)
- Estilos y scripts en /assets
- Función serverless /api/send-email.js (Nodemailer)
- Ejemplo de .env para variables SMTP

Instrucciones rápidas
1. Añade el logo que subiste a la carpeta assets como assets/logo.png.
2. Añade una imagen para el hero en assets/images/hero.jpg (o actualiza index.html).
3. Establece las variables de entorno en el proveedor de despliegue (Vercel/Netlify): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL.
4. Para desplegar en Vercel: sube el repo y en Settings > Environment Variables añade las variables. Verifica que api/send-email.js esté en /api/ en la raíz del repo.

Notas de seguridad
- No subas credenciales reales a Git.
- Para producción, usa un proveedor de correo transaccional o SMTP seguro.


IMPORTANT: I did not include binary image files. Please upload the logo image you provided in the chat to assets/logo.png and any other images to assets/images/. If you want, I can add the image files too if you grant upload or paste them as base64; otherwise please add them after I push these files.

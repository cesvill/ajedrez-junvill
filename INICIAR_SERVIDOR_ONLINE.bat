@echo off
title Servidor Online - Ajedrez Junvill
color 0A
echo ========================================================
echo        AJEDREZ JUNVILL - SERVIDOR ONLINE SEGURO
echo ========================================================
echo.
echo [1/2] Iniciando Servidor Web local en puerto 3000...
start /b cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo [2/2] Creando tunel seguro Cloudflare (cifrado TLS 1.3)...
echo.
echo --------------------------------------------------------
echo Tu enlace publico seguro aparecera a continuacion:
echo (Comparte ese enlace https://*.trycloudflare.com con amigos)
echo --------------------------------------------------------
echo.
npx -y cloudflared tunnel --url http://localhost:3000
pause

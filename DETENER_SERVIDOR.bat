@echo off
title Detener Servidor - Ajedrez Junvill
color 0C
echo ========================================================
echo        AJEDREZ JUNVILL - DETENER SERVIDORES
echo ========================================================
echo.
echo Deteniendo procesos de Node y Cloudflare...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM cloudflared.exe 2>nul
echo.
echo [OK] Todos los servidores y tuneles han sido detenidos.
echo.
pause

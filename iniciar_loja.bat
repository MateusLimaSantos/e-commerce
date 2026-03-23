@echo off
title Servidor da Loja
color 0A

echo ===================================================
echo     Iniciando o Servidor - E-commerce API
echo ===================================================
echo.
echo O servidor esta rodando. Pode minimizar esta janela!
echo Para desligar, basta fechar este terminal.
echo.

:: Executa o Uvicorn apontando para a pasta backend
uvicorn backend.main:app --reload

pause
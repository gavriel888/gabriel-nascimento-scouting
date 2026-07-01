@echo off
cd /d "%~dp0"
echo.
echo =========================================
echo   Gabriel Nascimento Scouting - Servidor Local
echo =========================================
echo.
echo Abrindo no navegador: http://localhost:8000
echo Para fechar o site depois, feche esta janela.
echo.
start "" "http://localhost:8000"
py -m http.server 8000
if errorlevel 1 (
  echo.
  echo Nao consegui iniciar com "py". Tentando com "python"...
  python -m http.server 8000
)
echo.
echo Se apareceu erro, talvez o Python nao esteja instalado.
echo Nesse caso, tente abrir o arquivo index.html com dois cliques.
pause

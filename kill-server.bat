@echo off
echo Parando todos os servidores HTTP na porta 8080...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Matando processo %%a
    taskkill /F /PID %%a
)

echo.
echo Pronto! Agora voce pode rodar: npm run dev
pause

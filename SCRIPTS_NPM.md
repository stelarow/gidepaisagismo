# 🚀 Scripts NPM - GIDI Paisagismo

## 📋 Comandos Disponíveis

### 🔥 **Desenvolvimento (Recomendado)**

```bash
npm run dev
```
**O que faz:**
- ✅ Inicia servidor HTTP na porta **8080**
- ✅ Abre automaticamente no navegador
- ✅ Cache desabilitado (sempre mostra versão mais recente)
- ✅ **Link**: http://localhost:8080

---

### 🌐 **Servidor sem Auto-open**

```bash
npm start
```
**O que faz:**
- ✅ Inicia servidor HTTP na porta **8080**
- ❌ NÃO abre navegador automaticamente
- ✅ Útil para rodar em background

**Acesse manualmente**: http://localhost:8080

---

### 🎯 **Portas Alternativas**

#### Porta 3000:
```bash
npm run dev:3000
```
**Link**: http://localhost:3000

#### Porta 5000:
```bash
npm run dev:5000
```
**Link**: http://localhost:5000

---

### 👁️ **Preview (Mesmo que dev)**

```bash
npm run preview
```
**Link**: http://localhost:8080

---

### 🌍 **Abrir no Navegador**

```bash
npm run open
```
Abre http://localhost:8080 no navegador padrão.

---

## ⚙️ **Como Usar**

### 1️⃣ **Primeira Vez (Instalar Dependências)**

```bash
# Não precisa! O projeto usa npx (sem dependências)
# Mas se quiser, rode:
npm install
```

### 2️⃣ **Iniciar Servidor de Desenvolvimento**

```bash
npm run dev
```

✅ Pronto! O site abre automaticamente em **http://localhost:8080**

### 3️⃣ **Parar o Servidor**

Pressione **Ctrl + C** no terminal.

---

## 📱 **Acessar de Outros Dispositivos**

### **No Celular/Tablet (mesma rede Wi-Fi):**

1. **Descubra seu IP local:**
   ```bash
   ipconfig
   ```
   Procure por **IPv4** (exemplo: 192.168.1.100)

2. **No celular, acesse:**
   ```
   http://192.168.1.100:8080
   ```

---

## 🔧 **Configurações Avançadas**

### **Mudar a Porta Padrão:**

Edite `package.json`:
```json
"dev": "npx http-server -p 3000 -c-1 -o"
```

### **Desabilitar Auto-open:**

Remova o `-o`:
```json
"dev": "npx http-server -p 8080 -c-1"
```

### **Ativar CORS:**

Adicione `--cors`:
```json
"dev": "npx http-server -p 8080 -c-1 -o --cors"
```

### **HTTPS (SSL):**

Adicione `-S`:
```json
"dev": "npx http-server -p 8080 -c-1 -o -S"
```

---

## 🎯 **Workflow Recomendado**

### **Desenvolvimento Diário:**

```bash
# 1. Abrir terminal na pasta do projeto
cd C:\projeto\ProjetoGIDI

# 2. Iniciar servidor
npm run dev

# 3. Editar arquivos (VSCode, etc.)
# 4. Atualizar navegador (F5) para ver mudanças

# 5. Quando terminar: Ctrl + C
```

---

## 🌐 **Testar Responsividade**

### **No Navegador (Chrome/Edge):**

1. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

2. **Abrir DevTools:**
   - Pressionar **F12**
   - Clicar no ícone 📱 (Device Toolbar)
   - Ou pressionar **Ctrl + Shift + M**

3. **Testar dispositivos:**
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

---

## 🚀 **Deploy para Produção**

### **Netlify (Recomendado - GRÁTIS):**

```bash
# 1. Ver mensagem de deploy
npm run deploy

# 2. Acessar Netlify Drop
# https://app.netlify.com/drop

# 3. Arrastar pasta ProjetoGIDI completa

# 4. Copiar link gerado
# Exemplo: gidi-paisagismo-abc123.netlify.app
```

### **Outros Métodos:**
- **GitHub Pages**: Push para GitHub + ativar Pages
- **Vercel**: Similar ao Netlify
- **Hospedagem tradicional**: Upload via FTP/cPanel

---

## 📊 **Comparação de Comandos**

| Comando | Porta | Auto-open | Uso |
|---------|-------|-----------|-----|
| `npm run dev` | 8080 | ✅ Sim | Desenvolvimento principal |
| `npm start` | 8080 | ❌ Não | Servidor em background |
| `npm run dev:3000` | 3000 | ✅ Sim | Porta alternativa |
| `npm run dev:5000` | 5000 | ✅ Sim | Porta alternativa |
| `npm run preview` | 8080 | ✅ Sim | Preview final |
| `npm run open` | - | ✅ Sim | Apenas abre navegador |

---

## 🐛 **Solução de Problemas**

### **Erro: "Port already in use"**

**Problema:** Porta 8080 já está ocupada.

**Solução:**
```bash
# Opção 1: Use porta alternativa
npm run dev:3000

# Opção 2: Mate o processo na porta 8080
netstat -ano | findstr :8080
taskkill /F /PID [NUMERO_DO_PROCESSO]

# Opção 3: Reinicie o computador
```

### **Erro: "npm not found"**

**Problema:** Node.js/npm não instalado.

**Solução:**
1. Baixe Node.js: https://nodejs.org
2. Instale (versão LTS recomendada)
3. Reinicie o terminal
4. Teste: `npm --version`

### **Erro: "http-server not found"**

**Problema:** Não encontra http-server.

**Solução:**
O projeto usa `npx` (não precisa instalar). Mas se preferir instalar:
```bash
npm install -g http-server
```

### **Site não atualiza após editar**

**Problema:** Cache do navegador.

**Solução:**
- Pressione **Ctrl + Shift + R** (hard refresh)
- Ou **Ctrl + F5**
- Ou abra DevTools (F12) → marque "Disable cache"

---

## 💡 **Dicas Profissionais**

### **1. Editor de Código:**
Use **VS Code** com Live Server extension:
- Mais rápido que npm run dev
- Auto-refresh automático
- Debugging integrado

### **2. Hot Reload:**
Para auto-refresh automático, use:
```bash
npx live-server --port=8080 --no-browser
```

### **3. Multiple Ports:**
Rode múltiplos servidores simultaneamente:
```bash
# Terminal 1
npm run dev:3000

# Terminal 2
npm run dev:5000
```

### **4. Tunnel Público (ngrok):**
Compartilhe localhost com qualquer pessoa:
```bash
# Instalar ngrok
npm install -g ngrok

# Iniciar servidor
npm run dev

# Em outro terminal
ngrok http 8080

# Compartilhe o link gerado (ex: https://abc123.ngrok.io)
```

---

## ✅ **Quick Start**

### **TL;DR - Começar Agora:**

```bash
cd C:\projeto\ProjetoGIDI
npm run dev
```

**Pronto! Site rodando em http://localhost:8080** 🎉

---

## 📞 **Suporte**

Problemas? Consulte:
- `README.md` - Documentação completa
- `INSTRUCOES_CLIENTE.md` - Guia para cliente
- `INICIO_RAPIDO.md` - Quick start

---

**Última atualização:** 26 de Fevereiro de 2024
**Versão:** 1.0.0

🌿 **GIDI Paisagismo - Transformando espaços verdes desde 2009**

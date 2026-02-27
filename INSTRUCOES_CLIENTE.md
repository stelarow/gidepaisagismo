# 📋 Instruções para o Cliente - GIDI Paisagismo

Bem-vindo ao seu novo site! Este documento contém todas as instruções necessárias para finalizar e publicar o site.

## 🎯 Passo a Passo Rápido

### 1️⃣ FORNECER IMAGENS (ESSENCIAL)

Você precisa fornecer as seguintes imagens para que o site funcione completamente:

#### 📌 Imagens Obrigatórias:

**Logo da Empresa**
- Arquivo: `logo.png`
- Onde colocar: `/images/logo.png`
- Tamanho recomendado: 150 x 60 pixels
- Formato: PNG com fundo transparente
- Qualidade: Alta resolução para telas Retina

**Imagem Hero (Banner Principal)**
- Arquivo: `hero-bg.jpg`
- Onde colocar: `/images/hero-bg.jpg`
- Tamanho mínimo: 1920 x 1080 pixels
- Formato: JPG ou WebP
- Dica: Use uma imagem de jardim/paisagem impressionante

**Imagem Sobre a Empresa**
- Arquivo: `about.jpg`
- Onde colocar: `/images/about.jpg`
- Tamanho recomendado: 800 x 600 pixels
- Dica: Foto da equipe ou de um projeto em andamento

#### 📸 Portfólio (mínimo 6 projetos):

**Imagens dos Projetos**
- Arquivos: `projeto-1.jpg` até `projeto-6.jpg` (ou mais)
- Onde colocar: `/images/portfolio/`
- Tamanho: 800 x 800 pixels (quadrado)
- Formato: JPG

**Categorias disponíveis:**
- `residencial` - Jardins de residências
- `comercial` - Projetos corporativos
- `vertical` - Jardins verticais
- `telhado` - Telhados verdes

Para cada imagem, informe:
- Nome do projeto
- Descrição breve
- Categoria

#### 📱 Instagram (8 posts recentes):

**Posts do Instagram**
- Arquivos: `post-1.jpg` até `post-8.jpg`
- Onde colocar: `/images/instagram/`
- Tamanho: 600 x 600 pixels (quadrado)
- Formato: JPG

#### 👥 Depoimentos (3 clientes):

**Fotos dos Clientes**
- Arquivos: `cliente-1.jpg`, `cliente-2.jpg`, `cliente-3.jpg`
- Onde colocar: `/images/`
- Tamanho: 100 x 100 pixels (será circular)
- Formato: JPG

Para cada cliente, forneça:
- Nome completo
- Projeto realizado
- Depoimento (texto)

---

### 2️⃣ ATUALIZAR INFORMAÇÕES DE CONTATO

Abra o arquivo `index.html` e procure por estas seções para atualizar:

#### 📍 Endereço
Procurar por: `Rua Exemplo, 123`
Substituir por: Seu endereço completo

#### 📞 Telefones
Procurar por: `(XX) XXXXX-XXXX`
Substituir por: Seus telefones reais
Formato: `(11) 98765-4321`

#### 📧 Emails
Procurar por: `contato@gidipaisagismo.com.br`
Substituir por: Seu email real

#### 🕐 Horário de Atendimento
Procurar por: `Segunda a Sexta: 08h - 18h`
Ajustar conforme seu horário

#### 🌐 Redes Sociais
Procurar por:
- `https://facebook.com/gidipaisagismo`
- `https://instagram.com/gidipaisagismo`
- `https://wa.me/5511999999999`
- `https://linkedin.com/company/gidipaisagismo`

Substituir pelos seus links reais.

---

### 3️⃣ CONFIGURAR GOOGLE MAPS

1. Acesse: https://www.google.com/maps
2. Procure seu endereço
3. Clique em "Compartilhar" → "Incorporar um mapa"
4. Copie o código iframe
5. No arquivo `index.html`, procure por `<iframe src="https://www.google.com/maps/embed`
6. Substitua pelo seu código

---

### 4️⃣ CONFIGURAR FORMULÁRIO DE CONTATO

#### Opção A - FormSpree (Recomendado - GRÁTIS)

**Mais simples e rápido:**

1. Acesse: https://formspree.io
2. Crie uma conta gratuita
3. Crie um novo formulário
4. Copie o Form ID (exemplo: `abc123xyz`)
5. Abra `js/form.js`
6. Procure por: `const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';`
7. Substitua por: `const FORMSPREE_ID = 'abc123xyz';`
8. Na linha ~120, descomente:
```javascript
// const response = await sendViaFormSpree(data);
```
E comente:
```javascript
const response = await simulateFormSubmission(data);
```

**Pronto! Formulário funcionando!**

#### Opção B - Backend Próprio

Se você tem um servidor/backend:
1. Implemente um endpoint POST `/api/contact`
2. Configure para enviar emails
3. Atualize a URL em `sendToBackend()`

---

### 5️⃣ CONFIGURAR FEED DO INSTAGRAM (OPCIONAL)

#### Opção A - Manter Estático
- Apenas coloque suas 8 melhores fotos em `/images/instagram/`
- Atualize manualmente quando quiser

#### Opção B - Feed Dinâmico (Avançado)
Instruções detalhadas no arquivo `js/instagram.js`

---

### 6️⃣ AJUSTAR PREÇOS DA CALCULADORA (OPCIONAL)

Se quiser ajustar os valores estimados:

1. Abra `js/calculator.js`
2. Procure por `const priceTable`
3. Ajuste os valores base (em R$/m²):

```javascript
jardim: { base: 150 },        // R$ 150/m²
manutencao: { base: 80 },     // R$ 80/m²
irrigacao: { base: 200 },     // R$ 200/m²
vertical: { base: 300 },      // R$ 300/m²
telhado: { base: 350 },       // R$ 350/m²
consultoria: { base: 120 }    // R$ 120/m²
```

---

### 7️⃣ CONFIGURAR ANALYTICS (OPCIONAL)

#### Google Analytics 4

1. Crie conta em: https://analytics.google.com
2. Obtenha o código de acompanhamento
3. Adicione no `<head>` do `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 Como Publicar o Site

### Opção 1 - Hospedagem Compartilhada (cPanel)

1. Acesse o cPanel da sua hospedagem
2. Vá em "Gerenciador de Arquivos"
3. Navegue até `public_html/`
4. Faça upload de TODOS os arquivos do projeto
5. Aguarde o upload completar
6. Acesse seu domínio

### Opção 2 - GitHub Pages (GRÁTIS)

1. Crie conta no GitHub
2. Crie um repositório novo
3. Faça upload dos arquivos
4. Vá em Settings → Pages
5. Ative GitHub Pages
6. Seu site estará em: `seuusuario.github.io/repositorio`

### Opção 3 - Netlify (GRÁTIS - Recomendado)

1. Acesse: https://www.netlify.com
2. Arraste a pasta do projeto para o Netlify
3. Site publicado instantaneamente!
4. Configure domínio personalizado (opcional)

---

## ✅ Checklist Final Antes de Publicar

Marque cada item conforme completa:

### Conteúdo
- [ ] Logo inserido
- [ ] Imagem hero inserida
- [ ] Imagem sobre inserida
- [ ] Mínimo 6 imagens de portfólio
- [ ] 8 imagens do Instagram
- [ ] 3 fotos de clientes para depoimentos

### Informações
- [ ] Endereço atualizado (3 lugares)
- [ ] Telefones atualizados (3 lugares)
- [ ] Emails atualizados (2 lugares)
- [ ] Horário de atendimento correto
- [ ] Links redes sociais corretos
- [ ] Google Maps configurado

### Funcionalidades
- [ ] Formulário de contato funcionando
- [ ] Testei envio de formulário
- [ ] Calculadora com preços corretos
- [ ] WhatsApp com número correto
- [ ] Instagram feed funcionando

### Testes
- [ ] Testei no celular
- [ ] Testei em tablet
- [ ] Testei no computador
- [ ] Todos os links funcionam
- [ ] Todas as imagens aparecem
- [ ] Formulário envia corretamente

---

## 📞 Suporte Técnico

Se tiver dúvidas ou problemas:

### Problemas Comuns:

**❌ "Minhas imagens não aparecem"**
✅ Verifique se:
- Arquivos estão nas pastas corretas
- Nomes dos arquivos estão corretos (com extensão .jpg)
- Tamanhos são adequados (não muito grandes)

**❌ "Formulário não envia"**
✅ Verifique se:
- Configurou FormSpree corretamente
- Copiou o Form ID correto
- Descomenteou a linha certa no código

**❌ "Site está lento"**
✅ Otimize as imagens:
- Use https://tinypng.com para comprimir
- Converta para WebP se possível
- Redimensione para tamanhos adequados

---

## 🎨 Personalizações Avançadas

### Alterar Cores

Edite `css/style.css` no início:

```css
:root {
    --color-primary: #2d5f3f;     /* Verde principal */
    --color-secondary: #78b719;   /* Verde secundário */
    --color-terra: #a67c52;       /* Tom terra */
    --color-accent: #e75101;      /* Laranja destaque */
}
```

### Alterar Fontes

No `<head>` do `index.html`, substitua o link do Google Fonts.

---

## 📊 Estatísticas do Site

Após configurar Google Analytics, você poderá ver:
- Quantas pessoas visitam o site
- De onde vêm os visitantes
- Quais páginas mais acessam
- Quantos formulários são enviados
- Quanto tempo ficam no site

---

## 🆘 Precisa de Ajuda?

### Documentação Completa:
Veja `README.md` para informações técnicas detalhadas.

### Tutoriais em Vídeo:
- Como adicionar imagens: [Link futuro]
- Como configurar FormSpree: [Link futuro]
- Como publicar no Netlify: [Link futuro]

---

**Parabéns pelo seu novo site! 🎉**

Ele foi desenvolvido com as melhores práticas de:
✅ Design moderno e profissional
✅ Otimização para Google (SEO)
✅ Velocidade e performance
✅ Acessibilidade
✅ Responsividade total

**Agora é hora de adicionar seu conteúdo e publicar!** 🚀

---

**Última atualização:** Fevereiro 2024
**Desenvolvido com** ❤️ **para GIDI Paisagismo**

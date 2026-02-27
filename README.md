# 🌿 GIDI Paisagismo - Website Sofisticado

Site moderno e elegante para GIDI Paisagismo, combinando design minimalista com elementos naturais.

## 📋 Visão Geral

Site profissional de paisagismo com foco em:
- Design sofisticado e clean
- Experiência de usuário excepcional
- Performance otimizada
- Responsividade completa
- Acessibilidade (WCAG AA)

## 🎨 Design

### Paleta de Cores
- **Verde Primário**: #2d5f3f (verde floresta sofisticado)
- **Verde Secundário**: #78b719 (verde vivo)
- **Terra**: #a67c52 (tom terra quente)
- **Branco**: #ffffff
- **Cinza Escuro**: #333333
- **Acento Coral**: #e75101

### Tipografia
- **Headings**: Playfair Display (elegante e sofisticado)
- **Body**: Inter (moderna e legível)
- **Accent**: Montserrat (para CTAs e destaques)

## 🚀 Funcionalidades

### ✅ Implementadas
1. **Hero Section** - Full-width com animação cross-fade
2. **Navegação Responsiva** - Menu hamburger para mobile
3. **Seção Sobre** - Layout duas colunas com estatísticas animadas
4. **Serviços** - Grid de 6 cards com hover effects
5. **Portfólio** - Galeria com filtros e lightbox (GLightbox)
6. **Depoimentos** - Carrossel Swiper com autoplay
7. **Calculadora de Orçamento** - Ferramenta interativa com noUiSlider
8. **Galeria Instagram** - Grid responsivo 4 colunas
9. **Formulário de Contato** - Validação completa e Google Maps
10. **Animações** - AOS (Animate On Scroll) em todas seções
11. **Scroll to Top** - Botão flutuante
12. **WhatsApp Float** - Botão de contato rápido

## 📁 Estrutura do Projeto

```
ProjetoGIDI/
├── index.html              # Página principal
├── css/
│   ├── style.css          # Estilos principais
│   ├── animations.css     # Animações e transições
│   └── responsive.css     # Media queries
├── js/
│   ├── main.js           # JavaScript principal
│   ├── animations.js     # Controle de animações
│   ├── calculator.js     # Calculadora de orçamento
│   ├── instagram.js      # Feed do Instagram
│   └── form.js          # Validação de formulário
├── images/
│   ├── logo.png         # Logo GIDI (FORNECIDO PELO CLIENTE)
│   ├── hero-bg.jpg      # Background hero (FORNECIDO PELO CLIENTE)
│   ├── about.jpg        # Imagem sobre (FORNECIDO PELO CLIENTE)
│   ├── services/        # Ícones de serviços
│   ├── portfolio/       # Imagens de projetos (FORNECIDO PELO CLIENTE)
│   └── instagram/       # Posts Instagram (FORNECIDO PELO CLIENTE)
└── README.md
```

## 🎯 Como Usar

### 1. Preparar Imagens

O cliente deve fornecer as seguintes imagens:

#### Obrigatórias:
- **logo.png** (150x60px recomendado) → `/images/logo.png`
- **hero-bg.jpg** (1920x1080px mínimo) → `/images/hero-bg.jpg`
- **about.jpg** (800x600px mínimo) → `/images/about.jpg`

#### Portfólio (mínimo 6 imagens):
- `projeto-1.jpg` a `projeto-6.jpg` → `/images/portfolio/`
- Dimensões recomendadas: 800x800px (quadrado)
- Formato: JPG ou WebP
- Categorias: residencial, comercial, vertical, telhado

#### Instagram (8 imagens):
- `post-1.jpg` a `post-8.jpg` → `/images/instagram/`
- Dimensões: 600x600px (quadrado)

#### Depoimentos (3 imagens de clientes):
- `cliente-1.jpg` a `cliente-3.jpg` → `/images/`
- Dimensões: 100x100px (circular)

### 2. Configurações Necessárias

#### Google Maps
Abrir `index.html` e atualizar o iframe do mapa (linha ~970):
```html
<iframe src="SUA_URL_DO_GOOGLE_MAPS_EMBED">
```

#### Informações de Contato
Atualizar em `index.html`:
- Endereço (múltiplas ocorrências)
- Telefone (formato: +55-XX-XXXXX-XXXX)
- Email
- Horário de atendimento
- Links de redes sociais

#### Schema.org
Atualizar dados estruturados no `<head>` (linha ~52):
```json
{
  "telephone": "+55-XX-XXXXX-XXXX",
  "address": { ... }
}
```

### 3. Configurações Opcionais

#### Formulário de Contato
Escolher método de envio (editar `js/form.js`):

**OPÇÃO A - FormSpree (Recomendado para início)**:
1. Criar conta em https://formspree.io
2. Obter Form ID
3. Atualizar `FORMSPREE_ID` em `form.js`
4. Descomentar `sendViaFormSpree()`

**OPÇÃO B - Backend próprio**:
1. Implementar endpoint `/api/contact`
2. Atualizar `sendToBackend()` com URL

#### Feed do Instagram
Escolher método (editar `js/instagram.js`):

**OPÇÃO A - Feed Estático (Atual)**:
- Manter imagens estáticas em `/images/instagram/`

**OPÇÃO B - Instagram API**:
1. Criar app em https://developers.facebook.com
2. Configurar Instagram Basic Display
3. Obter Access Token e User ID
4. Atualizar variáveis em `instagram.js`

**OPÇÃO C - Widget de Terceiros**:
1. Usar SnapWidget, Behold ou Taggbox
2. Copiar código embed
3. Atualizar `loadInstagramWidget()`

#### Tracking Analytics

**Google Analytics 4**:
```html
<!-- Adicionar no <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Facebook Pixel**:
```html
<!-- Adicionar no <head> -->
<script>
  !function(f,b,e,v,n,t,s) { /* Facebook Pixel Code */ }
</script>
```

## 🔧 Personalização

### Cores
Editar CSS Variables em `css/style.css`:
```css
:root {
    --color-primary: #2d5f3f;
    --color-secondary: #78b719;
    /* ... */
}
```

### Calculadora de Orçamento
Ajustar preços em `js/calculator.js`:
```javascript
const priceTable = {
    jardim: { base: 150 },  // R$/m²
    /* ... */
}
```

### Animações
Configurar AOS em `js/animations.js`:
```javascript
AOS.init({
    duration: 800,
    once: true,
    /* ... */
});
```

## 📱 Responsividade

### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Todos os elementos são totalmente responsivos com:
- Menu hamburger para mobile
- Grid adaptativo
- Imagens responsivas
- Touch-friendly buttons (44px mínimo)

## ♿ Acessibilidade

### Implementado:
- ✅ ARIA labels
- ✅ Skip to content link
- ✅ Navegação por teclado
- ✅ Contraste adequado (WCAG AA)
- ✅ Alt texts em imagens
- ✅ Headings hierárquicos
- ✅ Focus indicators
- ✅ Reduced motion support

## 🚀 Performance

### Otimizações:
- ✅ Lazy loading de imagens
- ✅ CSS minificado
- ✅ JavaScript modular
- ✅ Async/defer scripts
- ✅ Debounce/throttle em eventos
- ✅ Intersection Observer
- ✅ WebP com fallback

### Meta Lighthouse:
- Performance: > 90
- Acessibilidade: > 90
- Best Practices: > 90
- SEO: > 90

## 🌐 Navegadores Suportados

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Bibliotecas Utilizadas

### CSS:
- **AOS** (2.3.1) - Animate On Scroll
- **Swiper** (11.x) - Carrossel
- **GLightbox** (3.x) - Lightbox
- **noUiSlider** (15.7.1) - Slider

### Fonts:
- **Google Fonts**: Playfair Display, Inter, Montserrat
- **Font Awesome** (6.5.1) - Ícones

## 🔒 Segurança

### Implementado:
- ✅ Honeypot anti-spam
- ✅ Validação client-side
- ✅ Sanitização de inputs
- ✅ HTTPS ready
- ✅ NoOpener/NoReferrer em links externos

## 📝 Checklist de Deploy

### Antes de publicar:
- [ ] Substituir todas as imagens placeholder
- [ ] Atualizar informações de contato
- [ ] Configurar Google Maps
- [ ] Configurar formulário (FormSpree ou backend)
- [ ] Configurar feed Instagram (opcional)
- [ ] Adicionar Google Analytics
- [ ] Testar em múltiplos dispositivos
- [ ] Validar HTML/CSS
- [ ] Testar formulário
- [ ] Verificar links de redes sociais
- [ ] Testar performance (Lighthouse)
- [ ] Backup do site

## 🆘 Suporte

### Problemas Comuns:

**1. Imagens não aparecem**
- Verificar caminhos das imagens
- Garantir que arquivos existem nas pastas corretas

**2. Formulário não envia**
- Verificar configuração FormSpree/backend
- Checar console do navegador para erros

**3. Instagram feed vazio**
- Verificar se imagens estão em `/images/instagram/`
- Ou configurar API conforme instruções

**4. Animações não funcionam**
- Verificar se scripts AOS.js carregaram
- Checar console para erros JavaScript

## 📄 Licença

© 2024 GIDI Paisagismo. Todos os direitos reservados.

---

**Desenvolvido com** ❤️ **para conectar você com a natureza**

🌿 GIDI Paisagismo - Transformando espaços verdes desde 2009

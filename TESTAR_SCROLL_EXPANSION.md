# 🚀 TESTAR SCROLL EXPANSION HERO - INSTRUÇÕES

## ✅ Status: PRONTO PARA TESTE!

O Scroll Expansion Hero foi implementado com sucesso e está pronto para ser testado.

---

## 🌐 Acessar o Site

**URL:** http://localhost:8080

O servidor já está rodando! Abra esta URL no seu navegador.

---

## ⚠️ ANTES DE TESTAR

### Imagem Hero Necessária

Para ver o scroll expansion funcionando perfeitamente, você precisa da imagem:

**Arquivo:** `hero-bg.jpg`
**Local:** `C:\projeto\ProjetoGIDI\images\hero-bg.jpg`
**Tamanho:** 1920 x 1080 pixels (mínimo)
**Formato:** JPG

#### Opções para Teste Rápido:

**Opção 1: Usar Imagem Temporária (Recomendado)**
1. Baixe uma imagem de paisagem/jardim da internet
2. Redimensione para 1920x1080 (ou maior)
3. Salve como `hero-bg.jpg`
4. Coloque em `C:\projeto\ProjetoGIDI\images\`

**Opção 2: Criar Placeholder com Gradiente**
Você pode criar um arquivo temporário colorido:
1. Use qualquer editor de imagem
2. Crie um retângulo 1920x1080
3. Preencha com gradiente verde (#2d5f3f → #78b719)
4. Salve como `hero-bg.jpg` em `images/`

**Opção 3: Usar Imagem de Teste**
Sites para download gratuito:
- https://unsplash.com (busque: "garden" ou "landscape")
- https://pexels.com (busque: "jardim" ou "paisagem")

---

## 🧪 COMO TESTAR

### 1. Abrir Site
```
http://localhost:8080
```

### 2. Testar Scroll Expansion

#### Desktop (Mouse):
1. **Estado Inicial:**
   - Você verá uma imagem pequena no centro
   - Texto "GIDI" à esquerda, "Paisagismo" à direita
   - Background visível
   - Indicador de scroll animado embaixo

2. **Role o Mouse para Baixo:**
   - ✅ Imagem deve expandir suavemente
   - ✅ Texto se move lateralmente (palavras se afastam)
   - ✅ Background faz fade out
   - ✅ Indicador de scroll desaparece

3. **Continue Rolando:**
   - ✅ Imagem continua expandindo até preencher a tela
   - ✅ Texto sai completamente da tela
   - ✅ Background fica transparente
   - ✅ Conteúdo aparece embaixo (seção "Sobre")

4. **Scroll Normal Liberado:**
   - ✅ Depois da expansão completa, scroll normal funciona
   - ✅ Você pode navegar pelo resto do site

5. **Role para Trás (Scroll Up):**
   - ✅ Media contrai
   - ✅ Texto volta ao centro
   - ✅ Background volta a aparecer
   - ✅ Retorna ao estado inicial

#### Mobile/Tablet (Touch):
1. Abra o site no celular ou use F12 → modo responsivo
2. **Deslize para cima com o dedo:**
   - ✅ Mesma funcionalidade do mouse
   - ✅ Touch events funcionam
   - ✅ Dimensões adaptadas ao mobile

---

## 🔍 CHECKLIST DE TESTE

### Funcionalidades Visuais:
- [ ] Imagem pequena aparece no centro (estado inicial)
- [ ] Texto dividido em duas partes
- [ ] Background visível
- [ ] Scroll indicator animado (bounce)
- [ ] Imagem expande ao rolar
- [ ] Texto se move lateralmente
- [ ] Background faz fade out
- [ ] Indicador desaparece
- [ ] Conteúdo aparece após expansão
- [ ] Scroll para trás funciona (reset)

### Performance:
- [ ] Animação suave (60fps)
- [ ] Sem travamentos
- [ ] Transições fluidas
- [ ] Responsivo em mobile

### Navegadores:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (se disponível)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 🐛 PROBLEMAS COMUNS

### Problema: Hero aparece em branco
**Causa:** Imagem `hero-bg.jpg` não encontrada
**Solução:** Adicionar imagem em `C:\projeto\ProjetoGIDI\images\hero-bg.jpg`

### Problema: Scroll não funciona
**Causa:** Erro JavaScript ou conflito
**Solução:**
1. Abrir console (F12)
2. Verificar erros em vermelho
3. Limpar cache (Ctrl+Shift+R)

### Problema: Imagem não expande
**Causa:** JavaScript não carregado
**Solução:**
1. Verificar console (F12)
2. Ver se arquivo `scroll-expansion-hero.js` existe
3. Verificar rede (Network tab)

### Problema: Texto não se move
**Causa:** CSS não aplicado
**Solução:**
1. Verificar se `scroll-expansion.css` está carregado
2. Inspecionar elemento (botão direito → Inspecionar)
3. Ver se classes estão aplicadas

---

## 🎨 AJUSTES OPCIONAIS

### Se a Expansão Estiver Muito Rápida/Lenta:

Edite `js/scroll-expansion-hero.js` linha 157:

```javascript
// Mais lento: diminuir valor
const scrollDelta = e.deltaY * 0.0005; // era 0.0009

// Mais rápido: aumentar valor
const scrollDelta = e.deltaY * 0.0015; // era 0.0009
```

### Se o Texto Estiver Se Movendo Muito/Pouco:

Edite `js/scroll-expansion-hero.js` linha 221:

```javascript
// Menos movimento
const textTranslateX = this.scrollProgress * 100; // era 150

// Mais movimento
const textTranslateX = this.scrollProgress * 200; // era 150
```

### Para Trocar para Vídeo:

Edite `js/scroll-expansion-hero.js` linha 280:

```javascript
window.scrollExpansionHero = new ScrollExpansionHero({
    mediaType: 'video',
    mediaSrc: 'videos/hero-video.mp4',
    posterSrc: 'images/hero-poster.jpg',
    // ...resto
});
```

---

## 📊 CONSOLE DO NAVEGADOR

Para ver o que está acontecendo:

1. **Abrir Console:** F12 (ou botão direito → Inspecionar)
2. **Aba Console:** Ver mensagens e erros
3. **Aba Network:** Ver se arquivos carregaram
4. **Aba Elements:** Inspecionar estrutura HTML

### O que você deve ver no console:
- Sem erros em vermelho (idealmente)
- Scripts carregados (verde ou azul)
- CSS aplicado

---

## ✅ TESTE PASSOU?

Se tudo funcionou:
1. ✅ Imagem expande suavemente
2. ✅ Texto se move lateralmente
3. ✅ Background faz fade
4. ✅ Conteúdo aparece
5. ✅ Scroll funciona perfeitamente

**Parabéns! O Scroll Expansion Hero está funcionando!** 🎉

---

## 📸 COMO DEVE PARECER

### Estado Inicial:
```
┌─────────────────────────────────────┐
│                                     │
│         ┌──────────┐                │
│  GIDI   │  IMAGEM  │  Paisagismo   │
│         └──────────┘                │
│    Transformando Espaços Verdes     │
│                                     │
│       Role para explorar ↓          │
└─────────────────────────────────────┘
```

### Expansão Completa:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        [IMAGEM EXPANDIDA]           │
│         OCUPA TODA TELA             │
│                                     │
│                                     │
└─────────────────────────────────────┘
[CONTEÚDO DO SITE APARECE AQUI]
```

---

## 🔗 LINKS ÚTEIS

- **Documentação Completa:** `SCROLL_EXPANSION_IMPLEMENTADO.md`
- **Lista de Imagens:** `LISTA_IMAGENS_NECESSARIAS.txt`
- **Instruções Cliente:** `INSTRUCOES_CLIENTE.md`

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Adicionar imagem `hero-bg.jpg`
2. ✅ Testar funcionalidade
3. ⚙️ Ajustar velocidade (se necessário)
4. 📱 Testar em mobile real
5. 🎨 Personalizar textos (opcional)
6. 🚀 Deploy para produção

---

**Bons testes!** 🚀

Se encontrar problemas, verifique o console do navegador (F12) e consulte `SCROLL_EXPANSION_IMPLEMENTADO.md` para soluções.

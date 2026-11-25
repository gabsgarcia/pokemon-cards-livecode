# 🃏 Pokémon Cards · Live code de Front-end Templating

Live code da unidade **Front-end Templating** do **AI Software Development Bootcamp da Le Wagon**.

Vamos revisar os conceitos do dia montando um app de cartas de Pokémon. Os dados vêm da [PokéAPI](https://pokeapi.co/), que é gratuita e não pede chave. Para isso fazemos requisições com `fetch`.

Durante o dia vimos várias linguagens de templating. Neste live code usamos só **a tag `<template>` e JavaScript puro**, sem frameworks e sem bibliotecas.

![HTML + CSS + JS](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-ffcb05)

### 👉 [Veja funcionando aqui](https://gabsgarcia.github.io/pokemon-cards-livecode/)

## ✨ O que o app faz

- Busca os **151 Pokémon** da primeira geração
- Mostra cada um numa **carta** com nome, arte oficial e tipos
- Pinta a carta com a **cor do tipo principal** (fogo é laranja, água é azul...)
- **Clique na carta** para virar e ver os *base stats* no verso
- Aperte **🔊 Cry** para ouvir o grito do Pokémon (a carta treme enquanto toca)

## 🚀 Como rodar

Para só ver o app, abra a [versão online](https://gabsgarcia.github.io/pokemon-cards-livecode/) (publicada com GitHub Pages).

Para rodar no seu computador:

O `<script>` usa `type="module"`, por isso o navegador não roda o projeto abrindo o `index.html` com dois cliques (`file://`). É preciso um servidor local:

```bash
# com Python
python3 -m http.server 8000
# e abra http://localhost:8000

# ou, no VS Code, a extensão "Live Server"
```

## 🧠 A ideia central: fôrma + dados

```
  index.html                      PokéAPI
 ┌──────────────┐           ┌─────────────────┐
 │ <template>   │           │ { name, sprites,│
 │  (a fôrma)   │           │   types, stats }│
 └──────┬───────┘           └────────┬────────┘
        │ cloneNode(true)            │ fetch
        └────────────┬───────────────┘
                     ▼
              preenche o clone
                     ▼
        cardsContainer.appendChild(clone)
```

Para cada Pokémon, o JS repete o ciclo:

1. **SELECT**: pega o container e o `<template>` no HTML
2. **FETCH**: busca os dados na API
3. **CLONE**: `cardTemplate.content.cloneNode(true)`
4. **FILL**: preenche `textContent`, `src`, `dataset`...
5. **INSERT**: `appendChild` no container

## 🪜 Passo a passo

O código final fica em [`lib/pokemon.js`](lib/pokemon.js). A construção na aula foi em etapas, e cada etapa está em [`lib/passos/`](lib/passos/). Para rodar uma delas, troque o `src` do `<script>` no `index.html`.

| Passo | Arquivo | O que entra | Conceitos |
|---|---|---|---|
| 1 | [`passo-1.js`](lib/passos/passo-1.js) | Carta básica: nome, sprite e tipos | `fetch`, `async/await`, `<template>`, `cloneNode`, `.map().join()` |
| 2 | [`passo-2.js`](lib/passos/passo-2.js) | Arte oficial e cor por tipo | notação de colchetes (`["official-artwork"]`), `dataset`, CSS custom properties |
| 3 | [`passo-3.js`](lib/passos/passo-3.js) | Carta que vira, com stats no verso | `addEventListener`, `classList.toggle`, `insertAdjacentHTML`, transform 3D |
| 4 | [`passo-4.js`](lib/passos/passo-4.js) | Grito do Pokémon | `new Audio()`, `event.stopPropagation()` (event bubbling), `@keyframes` |
| ✅ | [`pokemon.js`](lib/pokemon.js) | Versão final | `Promise.all` (cartas em ordem), `try/catch`, estado de carregamento |

### Por que a versão final usa `Promise.all`?

Nos passos 1 a 4 usamos `data.results.forEach(insertPokemonCard)`. Isso funciona, mas os 151 fetches saem ao mesmo tempo, e **cada carta entra na tela quando o fetch dela termina**. Quem responde primeiro aparece primeiro, então a ordem sai embaralhada.

`Promise.all(data.results.map(fetchPokemon))` também dispara tudo em paralelo, mas espera todas as respostas e as devolve **na mesma ordem da lista**. Assim o Bulbasaur (#1) sempre vem primeiro.

### JS coloca etiqueta, CSS escolhe a cor

O JS não sabe nenhuma cor. Ele só faz:

```js
card.dataset.type = "fire"; // vira <div class="pokemon-card" data-type="fire">
```

E o CSS decide:

```css
[data-type="fire"] { --type-color: #ee8130; }
.card-front { background: radial-gradient(..., var(--type-color) 75%); }
```

O mesmo vale para virar a carta (`.is-flipped`) e para tremer (`.is-singing`): **o JS liga e desliga classes, o CSS faz a animação.**

## 📁 Estrutura

```
.
├── index.html          # página + <template> da carta
├── style.css           # cores por tipo, flip 3D, animação do grito
└── lib/
    ├── pokemon.js      # versão final
    └── passos/         # a construção, passo a passo
        ├── passo-1.js
        ├── passo-2.js
        ├── passo-3.js
        └── passo-4.js
```

## 💡 Desafios para continuar

- Um campo de busca que filtra as cartas pelo nome
- Botões para filtrar por tipo (dica: `card.dataset.type` já está lá!)
- Um botão "carregar mais" usando `?offset=151` na URL da API
- Virar a carta pelo teclado (`tabindex="0"` + evento `keydown`)

---

Feito durante o AI Software Development Bootcamp da [Le Wagon](https://www.lewagon.com/). Dados da [PokéAPI](https://pokeapi.co/). Pokémon e nomes relacionados são marcas da Nintendo/Game Freak.

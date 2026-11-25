// PASSO 2 · Arte oficial + cor por tipo
//
// Objetivo: navegar num JSON mais fundo e separar responsabilidades
// (o JS coloca uma etiqueta, o CSS escolhe a cor).
// Para rodar: no index.html, aponte o <script> para lib/passos/passo-2.js

// 1. SELECT: onde colocar as cartas e qual é a fôrma
const cardsContainer = document.querySelector("#cardsContainer");
const cardTemplate = document.querySelector("#cardTemplate");

const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

// 2. Para CADA Pokémon: segundo fetch → clona → preenche → insere
const insertPokemonCard = async (result) => {
  const response = await fetch(result.url);
  const pokemon = await response.json();

  const clone = cardTemplate.content.cloneNode(true);
  const card = clone.querySelector(".pokemon-card"); // NOVO: guardo a carta

  // NOVO: imagem grande. "official-artwork" tem hífen, então
  // .other.official-artwork não funciona → uso colchetes ["..."]
  clone.querySelector(".card-image").src = pokemon.sprites.other["official-artwork"].front_default;

  // NOVO: etiqueta com o tipo principal → vira data-type="grass" no HTML.
  // No style.css, [data-type="grass"] { --type-color: ... } faz o resto.
  card.dataset.type = pokemon.types[0].type.name;

  clone.querySelector(".card-name").textContent = pokemon.name;
  clone.querySelector(".card-types").textContent = pokemon.types
    .map((type) => type.type.name)
    .join(", ");

  cardsContainer.appendChild(clone);
};

// 3. Primeiro fetch: a lista (só nome + url de cada Pokémon)
const fetchAllPokemon = async () => {
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach(insertPokemonCard);
};

fetchAllPokemon();

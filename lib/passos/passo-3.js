// PASSO 3 · Carta que vira, com stats no verso
//
// Objetivo: eventos dentro de elementos clonados + duas formas de criar HTML
// (template para a carta, string + insertAdjacentHTML para cada <li>).
// Para rodar: no index.html, aponte o <script> para lib/passos/passo-3.js

// 1. SELECT: onde colocar as cartas e qual é a fôrma
const cardsContainer = document.querySelector("#cardsContainer");
const cardTemplate = document.querySelector("#cardTemplate");

const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

// 2. Para CADA Pokémon: segundo fetch → clona → preenche → insere
const insertPokemonCard = async (result) => {
  const response = await fetch(result.url);
  const pokemon = await response.json();

  const clone = cardTemplate.content.cloneNode(true);
  const card = clone.querySelector(".pokemon-card"); // guardo a carta

  // imagem grande (com colchetes por causa do hífen!)
  clone.querySelector(".card-image").src = pokemon.sprites.other["official-artwork"].front_default;
  // etiqueta com o tipo principal. Quem escolhe a cor é o CSS
  card.dataset.type = pokemon.types[0].type.name;
  clone.querySelector(".card-name").textContent = pokemon.name;
  clone.querySelector(".card-types").textContent = pokemon.types
    .map((type) => type.type.name)
    .join(", ");

  // NOVO: stats no verso (string + insertAdjacentHTML, como na aula de manhã)
  // pokemon.stats = [{ base_stat: 45, stat: { name: "hp" } }, ...]
  const statsList = clone.querySelector(".card-stats");
  pokemon.stats.forEach((stat) => {
    statsList.insertAdjacentHTML("beforeend", `<li><span>${stat.stat.name}</span><strong>${stat.base_stat}</strong></li>`);
  });

  // NOVO: clicar vira a carta. O JS só liga/desliga a classe,
  // o CSS faz o giro (.is-flipped .card-inner { transform: rotateY(180deg) })
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  cardsContainer.appendChild(clone);
};

// 3. Primeiro fetch: a lista (só nome + url de cada Pokémon)
const fetchAllPokemon = async () => {
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach(insertPokemonCard);
};

fetchAllPokemon();

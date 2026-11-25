// PASSO 4 · O grito do Pokémon 🔊
//
// Objetivo: tocar áudio com new Audio() e entender event bubbling
// (um clique no botão também "sobe" até a carta).
// Para rodar: no index.html, aponte o <script> para lib/passos/passo-4.js

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

  // stats no verso (string + insertAdjacentHTML, como na aula de manhã)
  const statsList = clone.querySelector(".card-stats");
  pokemon.stats.forEach((stat) => {
    statsList.insertAdjacentHTML("beforeend", `<li><span>${stat.stat.name}</span><strong>${stat.base_stat}</strong></li>`);
  });

  // clicar vira a carta (o CSS faz o giro)
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  // NOVO: o grito do Pokémon (campo "cries" da API, um arquivo .ogg)
  clone.querySelector(".cry-button").addEventListener("click", (event) => {
    event.stopPropagation(); // senão o clique "sobe" até a carta e ela desvira
    const cry = new Audio(pokemon.cries.latest);
    card.classList.add("is-singing"); // a carta treme (animação no CSS)
    cry.addEventListener("ended", () => card.classList.remove("is-singing"));
    cry.play();
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

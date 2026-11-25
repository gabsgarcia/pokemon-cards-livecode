// PASSO 1 · A carta básica (a solução da Le Wagon)
//
// Objetivo: entender o ciclo SELECT → FETCH → CLONE → FILL → INSERT.
// Para rodar este passo: no index.html, troque
//   <script src="lib/pokemon.js" ...>  por  <script src="lib/passos/passo-1.js" ...>

// 1. SELECT: onde colocar as cartas e qual é a fôrma
const cardsContainer = document.querySelector("#cardsContainer");
const cardTemplate = document.querySelector("#cardTemplate");

const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

// 2. Para CADA Pokémon: segundo fetch → clona → preenche → insere
const insertPokemonCard = async (result) => {
  // result = { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }
  // A lista só tem nome + url, então preciso de outro fetch para os detalhes.
  const response = await fetch(result.url);
  const pokemon = await response.json();

  // CLONE: cópia do conteúdo do <template> (true = copia os filhos também)
  const clone = cardTemplate.content.cloneNode(true);

  // FILL: procuro DENTRO do clone (clone.querySelector, não document.querySelector!)
  clone.querySelector(".card-image").src = pokemon.sprites.front_default;
  clone.querySelector(".card-name").textContent = pokemon.name;
  clone.querySelector(".card-types").textContent = pokemon.types
    .map((type) => type.type.name) // [{type: {name: "grass"}}] → ["grass"]
    .join(", ");                   // ["grass", "poison"] → "grass, poison"

  // INSERT: só agora a carta aparece na página
  cardsContainer.appendChild(clone);
};

// 3. Primeiro fetch: a lista (só nome + url de cada Pokémon)
const fetchAllPokemon = async () => {
  const response = await fetch(url);
  const data = await response.json();
  // Repare: as cartas podem aparecer fora de ordem! Cada fetch termina
  // num tempo diferente. A versão final (lib/pokemon.js) resolve com Promise.all.
  data.results.forEach(insertPokemonCard);
};

fetchAllPokemon();

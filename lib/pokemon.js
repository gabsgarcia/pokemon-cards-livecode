// =====================================================================
// POKÉMON CARDS · versão final do live code
// Le Wagon · AI Software Development Bootcamp · Unidade "Front-end Templating"
//
// A ideia em uma frase:
//   o HTML tem uma FÔRMA (<template>), o JS busca os DADOS (fetch na PokéAPI)
//   e, para cada Pokémon, CLONA a fôrma, PREENCHE e INSERE na página.
//
// O fluxo completo:
//   1. SELECT   → pego o container e o <template> no HTML
//   2. FETCH 1  → a lista dos 151 Pokémon (só nome + url de cada um)
//   3. FETCH 2  → para cada Pokémon, os detalhes (imagem, tipos, stats, grito)
//   4. CLONE    → copio o conteúdo do <template>
//   5. FILL     → preencho o clone com os dados
//   6. INSERT   → coloco o clone dentro do container
//
// Quer ver a construção passo a passo? Veja a pasta lib/passos/.
// =====================================================================

// ---------------------------------------------------------------------
// 1. SELECT: onde as cartas vão morar e qual é a fôrma delas
// ---------------------------------------------------------------------
const cardsContainer = document.querySelector("#cardsContainer");
const cardTemplate = document.querySelector("#cardTemplate");

// "?limit=151" = só a primeira geração (Kanto)
const url = "https://pokeapi.co/api/v2/pokemon?limit=151";

// ---------------------------------------------------------------------
// 2. Função que monta UMA carta a partir dos dados de UM Pokémon
//    (ela não faz fetch: só recebe o objeto pronto e devolve a carta)
// ---------------------------------------------------------------------
const buildPokemonCard = (pokemon) => {
  // .content = o "fragmento" de dentro do <template>
  // cloneNode(true) = cópia profunda (true → copia também os filhos)
  const clone = cardTemplate.content.cloneNode(true);

  // Guardo a carta numa variável: vou usar ela nos eventos lá embaixo.
  // Atenção: depois do appendChild o "clone" fica vazio (os elementos
  // MUDAM para a página), mas a variável "card" continua apontando
  // para a carta de verdade.
  const card = clone.querySelector(".pokemon-card");

  // ----- FRENTE -----

  // Arte oficial (imagem grande). "official-artwork" tem hífen, então
  // não dá para escrever .other.official-artwork → uso colchetes.
  // Se não houver arte oficial, caio no sprite pequeno (operador ||).
  const image = clone.querySelector(".card-image");
  image.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
  image.alt = pokemon.name; // acessibilidade: leitores de tela leem o alt

  clone.querySelector(".card-name").textContent = pokemon.name;

  // A API devolve: types: [{ type: { name: "grass" } }, { type: { name: "poison" } }]
  // .map transforma em ["grass", "poison"] e .join junta em "grass, poison"
  clone.querySelector(".card-types").textContent = pokemon.types
    .map((type) => type.type.name)
    .join(", ");

  // Cor da carta: o JS NÃO escolhe cor nenhuma. Ele só coloca uma
  // etiqueta (data-type="fire") e o CSS decide a cor. Cada um no seu papel.
  card.dataset.type = pokemon.types[0].type.name;

  // ----- VERSO -----

  // Duas formas de inserir HTML aparecem neste projeto:
  //   - <template> + cloneNode → para estruturas grandes (a carta inteira)
  //   - string + insertAdjacentHTML → para pedacinhos simples (cada <li>)
  const statsList = clone.querySelector(".card-stats");
  pokemon.stats.forEach((stat) => {
    statsList.insertAdjacentHTML(
      "beforeend",
      `<li><span>${stat.stat.name}</span><strong>${stat.base_stat}</strong></li>`
    );
  });

  // ----- EVENTOS -----

  // Clicar na carta vira ela. O JS só liga/desliga a classe;
  // quem faz o giro 3D é o CSS (.is-flipped .card-inner { rotateY(180deg) }).
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });

  // O grito do Pokémon (campo "cries" da API).
  // Alguns Pokémon não têm "latest", então uso "legacy" como reserva.
  clone.querySelector(".cry-button").addEventListener("click", (event) => {
    // O botão está DENTRO da carta. Sem isso, o clique "borbulha"
    // (event bubbling) até a carta e ela desvira.
    event.stopPropagation();

    const cry = new Audio(pokemon.cries.latest || pokemon.cries.legacy);
    card.classList.add("is-singing"); // o CSS faz a carta tremer
    cry.addEventListener("ended", () => card.classList.remove("is-singing"));

    // play() devolve uma Promise: se o navegador bloquear o áudio,
    // paro de tremer em vez de ficar tremendo para sempre.
    cry.play().catch(() => card.classList.remove("is-singing"));
  });

  return clone;
};

// ---------------------------------------------------------------------
// 3. Segundo fetch: os detalhes de UM Pokémon
// ---------------------------------------------------------------------
const fetchPokemon = async (result) => {
  const response = await fetch(result.url);
  return response.json();
};

// ---------------------------------------------------------------------
// 4. Primeiro fetch: a lista. Depois, todos os detalhes. Depois, a tela.
// ---------------------------------------------------------------------
const fetchAllPokemon = async () => {
  cardsContainer.textContent = "Carregando Pokémon...";

  try {
    const response = await fetch(url);
    const data = await response.json();
    // data.results = [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }, ...]

    // Por que Promise.all e não só data.results.forEach(insertPokemonCard)?
    // Com forEach, os 151 fetches saem juntos e cada carta entra na tela
    // quando o SEU fetch termina. Quem responde primeiro aparece primeiro
    // → a ordem fica embaralhada (o Pikachu pode aparecer antes do Bulbasaur).
    // Promise.all também dispara tudo em paralelo (rápido), mas espera
    // todos terminarem e devolve os resultados NA MESMA ORDEM da lista.
    const pokemons = await Promise.all(data.results.map(fetchPokemon));

    cardsContainer.textContent = ""; // tira o "Carregando..."
    pokemons.forEach((pokemon) => {
      cardsContainer.appendChild(buildPokemonCard(pokemon));
    });
  } catch (error) {
    // Sem internet ou API fora do ar: avisa na tela em vez de ficar em branco
    console.error(error);
    cardsContainer.textContent = "Ops! Não consegui falar com a PokéAPI. Tente recarregar a página.";
  }
};

// ---------------------------------------------------------------------
// 5. Começa tudo!
// ---------------------------------------------------------------------
fetchAllPokemon();

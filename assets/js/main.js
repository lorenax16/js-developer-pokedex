const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <button class="btn-detail" id="${pokemon.name}" class type="button">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </button>
            </div>
        </li>
    `
}


function modal(poke) {
    const abilitiesList = poke.abilities.map((item) => item.ability.name).join(', ');
    return `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <h1>Abaout</h1>
                <h3 class="name">Pokemon: ${poke.name}</h3>
                
                <div class="abilites">
                    <span >Abilities:</span>
                    <p>${abilitiesList}</p>
                </div>
                
                <span >heigth:  ${poke.height}</span>
                <span > weight: ${poke.weight} </span>
                
                <button id="closeModalBtn" class="close">close</button>
            </div>
        </div>
    `
}



function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    
        const btns = document.querySelectorAll('.btn-detail');
        btns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.id;
                umpokemon(id);
            });
        });
    })
}



function umpokemon(id) {

    pokeApi.getPokemonsCardDetalhes(id).then((poke) => {
        let modalHtml  = modal(poke);
        

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        const open = document.querySelector(".modal");
        open.style.display = 'block';

        const closeModalBtn = document.querySelector(".close");
          const modal2 = modalContainer.querySelector(".modal");

        closeModalBtn.addEventListener("click", () => {
            modal2.style.display = "none";
            modalContainer.remove();
        });

        window.addEventListener("click", (event) => {
            if (event.target === modal2) {
                modal2.style.display = "none";
                modalContainer.remove();
            }
        });
    })
}





loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
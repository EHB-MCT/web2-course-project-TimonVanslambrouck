window.onload = () => {
    let pokemonNameList = [];
    async function getOptions() {
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_names.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        pokemonNameList = [];
        console.log(data);
        for (let id in data) {
            let pokemonName = data[id].name;
            let htmlString = `<option value=${pokemonName}>${pokemonName}</option>`;
            document.getElementById('PokemonName').insertAdjacentHTML('beforeend', htmlString);
            pokemonNameList.push(pokemonName);
        }
    }

    function addPokemon(event) {
        event.preventDefault();
        let selectedName = document.getElementById('PokemonName').value;
        let pokemon = {
            name: selectedName,
            type: "fire"
        };
        fetch('http://localhost:3000/api/pokemon', {
            method: "POST",
            body: JSON.stringify(pokemon),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }

    document.getElementById('submitButton').addEventListener('click', addPokemon);
    getOptions();

};
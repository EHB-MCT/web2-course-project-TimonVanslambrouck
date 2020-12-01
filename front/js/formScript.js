window.onload = () => {
    let pokemonNameList = [];
    let pokemonFormList = [];

    setup();

    function setup() {
        document.getElementById('submitButton').addEventListener('click', addPokemon);
        document.getElementById('pokemonName').addEventListener('change', showTypeAndShiny);
        getPokemonNames();
        getPokemonForms();
    }

    async function getPokemonNames() {
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_names.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        pokemonNameList = [];
        let htmlString = '';
        for (let id in data) {
            let pokemonName = data[id].name;
            htmlString += `<option value= ${data[id].id}>${pokemonName}</option>`;
            pokemonNameList.push(pokemonName);
        }
        document.getElementById('pokemonName').insertAdjacentHTML('beforeend', htmlString);
    }

    async function getPokemonForms() {
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_types.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        pokemonFormList = data;
    }

    async function addPokemon(event) {
        event.preventDefault();
        if (document.getElementById('pokemonName').value == 'begin') {
            return window.alert('please choose a Pokémon!');
        }
        let cpSelectedPokemon = document.getElementById('cpPokemon').value;
        let selectedId = Number(document.getElementById('pokemonName').value);
        let selectedName = pokemonNameList[Number(document.getElementById('pokemonName').value) - 1];
        let selectedForm = pokemonFormList[document.getElementById('pokemonFormSelect').value].form;
        let selectedType = pokemonFormList[document.getElementById('pokemonFormSelect').value].type;
        let selectedPokemon = await getPokemon(selectedName);
        let picturePokemon = selectedPokemon.sprites.front_default;
        let shiny = false;
        if (document.getElementById('pokemonShinySelect').value == 'shiny') {
            shiny = true;
            picturePokemon = selectedPokemon.sprites.front_shiny;
        }
        let cpIsInvalid = await checkCP(cpSelectedPokemon, selectedForm, selectedId);
        if (cpIsInvalid) {
            return window.alert('please enter valid CP!');
        }

        let selectedPokemonEvolution = await getEvoltuions(selectedId, selectedForm);
        let selectedPokemonBuddyDistance = await getBuddyDistance(selectedId);

        let pokemon = {
            id: selectedId,
            name: selectedName,
            form: selectedForm,
            type: selectedType,
            shiny: shiny,
            cp: cpSelectedPokemon,
            evolution: selectedPokemonEvolution,
            distance: selectedPokemonBuddyDistance,
            picture: picturePokemon
        };
        // source: https: //www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/
        fetch('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', {
            method: "POST",
            body: JSON.stringify(pokemon),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        window.alert('Pokémon has been added!');
    }

    async function getPokemon(name) {
        name = name.toLowerCase();
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = resp.json();
        return data;
    }

    function showTypeAndShiny(event) {
        event.preventDefault();

        let cpPokemon = document.getElementById('cpPokemon');
        let pokemonShinySelect = document.getElementById('pokemonShinySelect');
        let pokemonFormSelect = document.getElementById('pokemonFormSelect');
        let pokemonId = Number(document.getElementById('pokemonName').value);
        let htmlString = '';

        for (let id in pokemonFormList) {
            if (pokemonFormList[id].pokemon_id === pokemonId) {
                let pokemonForm = pokemonFormList[id].form;
                if (pokemonForm === "Normal") {
                    htmlString += `<option value=${id} selected>${pokemonForm}</option>`
                } else {
                    htmlString += `<option value=${id}>${pokemonForm}</option>`;
                }
            } else if (pokemonFormList[id].pokemon_id > pokemonId) {
                break
            }
        }
        clearOptions(pokemonFormSelect);
        pokemonFormSelect.insertAdjacentHTML('beforeend', htmlString);
        pokemonFormSelect.style.display = 'inline-block';
        pokemonShinySelect.style.display = 'inline-block';
        cpPokemon.style.display = 'inline-block';
    }

    async function checkCP(cp, form, id) {
        let maxCP = 5000;
        cp = cp * 1;
        if (cp <= 0 || cp > 6000 || cp === '') {
            console.log(cp);
            return true
        }
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_max_cp.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        for (let pokemonId in data) {
            if (data[pokemonId].pokemon_id === id && data[pokemonId].form === form) {
                maxCP = data[pokemonId].max_cp;
                break
            }
        }

        if (cp > maxCP) {
            return true;
        }
        return false;

    }

    async function getEvoltuions(id, form) {
        let evolutions = 0;
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_evolutions.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        for (let pokemonId in data) {
            if (data[pokemonId].pokemon_id === id && data[pokemonId].form === form) {
                evolutions = data[pokemonId].evolutions;
                return evolutions
            }
        }
        return evolutions
    }

    async function getBuddyDistance(id) {
        let distance = 0;
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_buddy_distances.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        for (pokemonId in data) {
            data[pokemonId].forEach(pokemon => {
                if (distance !== 0) {
                    return distance;
                }
                if (pokemon.pokemon_id == id) {
                    distance = pokemon.distance;
                    return distance;
                }
            });
        }
        return distance;
    }

    // source: https://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
    function clearOptions(selectElement) {
        let length = selectElement.options.length - 1;
        for (let i = length; i >= 0; i--) {
            selectElement.remove(i)
        }
    }
};
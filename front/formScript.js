window.onload = () => {
    let pokemonNameList = [];
    let pokemonNameListSorted = [];
    let pokemonNameReverseListSorted = [];
    let pokemonFormList = [];

    setup();

    function setup() {
        document.getElementById('submitButton').addEventListener('click', addPokemon);
        document.getElementById('pokemonName').addEventListener('change', showType);
        document.getElementById('selectOrder').addEventListener('change', changeOrder);
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
        pokemonNameListSorted = pokemonNameList;
        pokemonNameReverseListSorted = pokemonNameList;
        sortList(pokemonNameListSorted, -1, 1);
        console.log(pokemonNameListSorted);
        reverseSortList(pokemonNameReverseListSorted, 1, -1);
        console.log(pokemonNameListSorted);

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

    function addPokemon(event) {
        event.preventDefault();
        if (document.getElementById('pokemonName').value == 'begin') {
            return window.alert('please choose a Pokémon!');
        }
        let selectedName = pokemonNameList[Number(document.getElementById('pokemonName').value) - 1];
        let selectedForm = pokemonFormList[document.getElementById('pokemonFormSelect').value].form;
        let selectedType = pokemonFormList[document.getElementById('pokemonFormSelect').value].type;
        let pokemon = {
            name: selectedName,
            form: selectedForm,
            type: selectedType
        };
        // source: https: //www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/
        fetch('http://localhost:3000/api/pokemon', {
            method: "POST",
            body: JSON.stringify(pokemon),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        window.alert('Pokémon has been added!');
    }

    function showType(event) {
        event.preventDefault();

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
    }

    function changeOrder(event) {
        event.preventDefault();
        let selectedOrder = document.getElementById('selectOrder').value;
        if (selectedOrder === 'alphabetical') {

        }
    }

    // source: https://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
    function clearOptions(selectElement) {
        let length = selectElement.options.length - 1;
        for (let i = length; i >= 0; i--) {
            selectElement.remove(i)
        }
    }

    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    function sortList(array) {
        array.sort(function (a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
    }

    function reverseSortList(array) {
        array.sort(function (a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }
            // names must be equal
            return 0;
        });
    }
};
window.onload = () => {

    let pokemonNameList = [];
    let sortedPokemonNameList = [];
    let pokemonFormList = [];
    let htmlPokedexSorted = '';
    let htmlReversePokedexSorted = '';
    let htmlAlphabeticalSorted = '';
    let htmlReverseAlphabeticalSorted = '';
    let nameData = '';
    getAllPokemon();
    getTypes();
    getPokemonForms();
    document.getElementById('sorts').addEventListener('change', changeSort);
    document.getElementById('nameSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchName();
        }
    });

    function changeSort(e) {
        e.preventDefault();
        let sortBy = document.getElementById('sorts').value;
        if (sortBy === 'pokedex') {
            document.getElementById('pokemonDisplay').innerHTML = htmlPokedexSorted;
            addEventListenersIndex();
        } else if (sortBy === 'reversePokedex') {
            document.getElementById('pokemonDisplay').innerHTML = htmlReversePokedexSorted;
            addEventListenersIndex();
        } else if (sortBy === 'alphabetical') {
            document.getElementById('pokemonDisplay').innerHTML = htmlAlphabeticalSorted;
            addEventListenersIndex();
        } else if (sortBy === 'reverseAlphabetical') {
            document.getElementById('pokemonDisplay').innerHTML = htmlReverseAlphabeticalSorted;
            addEventListenersIndex();
        }
    }

    function addInputs(e) {
        closeOverlay();
        /* 
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
        fetch('ttps://web2-course-project-api-tv.herokuapp.com/api/pokemon', {
            method: "POST",
            body: JSON.stringify(pokemon),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        window.alert('Pokémon has been added!');
    }
        */
    }

    async function getTypes() {
        fetch('https://pokeapi.co/api/v2/type')
            .then(response => response.json())
            .then(content => content.results)
            .then(types => types.forEach(type => {
                document.getElementById('types').insertAdjacentHTML('beforeend', `<option value="${type.name}">${type.name.toUpperCase()}</option>`)
            }));
    }

    async function getAllPokemon() {
        const resp = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_names.json", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "9d0a09fc10mshe5a93973c23a87ap12761ajsndf646d78f6f5",
                "x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
            }
        });
        const data = await resp.json();
        nameData = data;
        let htmlString = '';
        for (let id in data) {
            let pokemonName = data[id].name;
            pokemonNameList.push(pokemonName);
            htmlString = `<div class="pokemon">
            <button type="submit" id="selectPokemonButton${data[id].id}" value=${data[id].id}>
                <div class="pokemonPicutreBox">
                    <img class="pokemonPicture"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data[id].id}.png"
                        alt="picture of ${pokemonName}">
                    <img class="addButton" src="./svg/plus.svg" alt="">
                </div>
                <h2 class="pokemonName">${pokemonName}</h2>
            </button>
        </div>`;
            htmlPokedexSorted += htmlString;
            htmlReversePokedexSorted = htmlString + htmlReversePokedexSorted;
            document.getElementById('pokemonDisplay').insertAdjacentHTML('beforeend', htmlString);
            document.getElementById(`selectPokemonButton${data[id].id}`).addEventListener('click', function () {
                getOverlay(`selectPokemonButton${data[id].id}`);
            });
        }
        // SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        sortedPokemonNameList = pokemonNameList;
        sortedPokemonNameList = sortedPokemonNameList.sort(function (a, b) {
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
        getAlphabeticalHtml();
    }

    function getOverlay(button) {
        window.scrollTo(0, 0);
        document.body.classList.add("stop-scrolling");
        let selectedPokemonID = document.getElementById(button).value;
        let htmlStringOptions = '`<option selected value="normal">Normal</option>`';
        for (let id in pokemonFormList) {
            if (pokemonFormList[id].pokemon_id == selectedPokemonID) {
                let pokemonForm = pokemonFormList[id].form;
                if (pokemonForm !== "Normal") {
                    htmlStringOptions += `<option value=${pokemonForm.toLowerCase()}>${pokemonForm}</option>`;
                }
            } else if (pokemonFormList[id].pokemon_id > selectedPokemonID) {
                break
            }
        }

        let htmlString = `<div class="inputScreen">
        <button id="closeButton"><img id="closeWindow" src="./svg/cross.svg" alt="close window"></button>
        <h1>${nameData[selectedPokemonID].name}</h1>
        <div class="inputField">
            <h2>Form:</h2>
            <select class="form-control" id="form">
                ${htmlStringOptions}
            </select>
            <h2>CP:</h2>
            <input class="form-control" type="number">
            <h2>Attack:</h2>
            <input class="form-control" type="number">
            <h2>Defence:</h2>
            <input class="form-control" type="number">
            <h2>HP:</h2>
            <input class="form-control" type="number">
            <h2>Shiny:</h2>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="shinyCheckbox" value="shiny">
            </div>
        </div>
        <div class="saveButton">
            <button value=${selectedPokemonID} id="saveButton"><a href="#">SAVE</a></button>
        </div>
    </div>`
        document.getElementById('overlay').innerHTML = htmlString;
        document.getElementById('closeButton').addEventListener('click', closeOverlay)
        document.getElementById('saveButton').addEventListener('click', addInputs);
        document.getElementById('overlay').style.display = 'block';
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

    async function getAlphabeticalHtml() {
        sortedPokemonNameList.forEach(name => {
            for (let id in nameData) {
                if (name === nameData[id].name) {
                    htmlString = `<div class="pokemon">
                    <button type="submit" id="selectPokemonButton${nameData[id].id}" value=${nameData[id].id}>
                        <div class="pokemonPicutreBox">
                            <img class="pokemonPicture"
                                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameData[id].id}.png"
                                alt="picture of ${name}">
                            <img class="addButton" src="./svg/plus.svg" alt="">
                        </div>
                        <h2 class="pokemonName">${name}</h2>
                    </button>
                </div>`;
                    htmlAlphabeticalSorted += htmlString;
                    htmlReverseAlphabeticalSorted = htmlString + htmlReverseAlphabeticalSorted;
                }
            }
        });
    }

    function addEventListenersIndex() {
        for (let index = 1; index <= pokemonNameList.length; index++) {
            if (document.getElementById(`selectPokemonButton${index}`) !== null) {
                document.getElementById(`selectPokemonButton${index}`).addEventListener('click', function () {
                    getOverlay(`selectPokemonButton${index}`);
                });
            }
        }
    }

    function closeOverlay() {
        document.body.classList.remove("stop-scrolling");
        document.getElementById('overlay').style.display = 'none';
    }

    function searchName() {
        let search = document.getElementById('nameSearch').value.toLowerCase();
        let htmlString = '';
        for (let id in nameData) {
            let pokemonName = nameData[id].name;
            let pokemonNameLowerCase = pokemonName.toLowerCase();
            if (pokemonNameLowerCase.includes(search)) {
                htmlString += `<div class="pokemon">
            <button type="submit" id="selectPokemonButton${nameData[id].id}" value=${nameData[id].id}>
                <div class="pokemonPicutreBox">
                    <img class="pokemonPicture"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${nameData[id].id}.png"
                        alt="picture of ${pokemonName}">
                    <img class="addButton" src="./svg/plus.svg" alt="">
                </div>
                <h2 class="pokemonName">${pokemonName}</h2>
            </button>
        </div>`;
            }
            if (htmlString == '') {
                htmlString = '<p>NO RESULT</p>'
                document.getElementById('pokemonDisplay').innerHTML = htmlString;
            } else {
                document.getElementById('pokemonDisplay').innerHTML = htmlString;
                addEventListenersIndex();
            }


        }
    }
};
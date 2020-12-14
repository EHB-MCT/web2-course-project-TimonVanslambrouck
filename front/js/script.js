window.onload = () => {

    let selectedPokemonID;
    let pokemonNameList = [];
    let sortedPokemonNameList = [];
    let pokemonFormList = [];
    let htmlPokedexSorted = '';
    let htmlReversePokedexSorted = '';
    let htmlAlphabeticalSorted = '';
    let htmlReverseAlphabeticalSorted = '';
    let nameData = '';
    let selectedType = [];
    let counter = 0;
    getAllPokemon();
    getPokemonForms();
    document.getElementById('sorts').addEventListener('change', changeSort);
    document.getElementById('nameSearch').value = '';
    document.getElementById('sorts').value = 'sort';
    document.getElementById('nameSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('pokemonDisplay').innerHTML = `<div class="spinner-grow" role="status">
            <span class="sr-only">Loading...</span>
            </div>`;
            searchName();
        }
    });
    document.getElementById('scrollUpArrow').addEventListener('click', function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    })

    function changeSort(e) {
        e.preventDefault();
        let sortBy = document.getElementById('sorts').value;

        if (sortBy === 'sort') {
            return;
        } else if (sortBy === 'pokedex') {
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

    async function addInputs(e) {

        let cpSelectedPokemon = document.getElementById('cpSelectedPokemon').value;
        let selectedId = Number(selectedPokemonID);
        let selectedName = nameData[selectedPokemonID].name;
        let selectedForm = '';
        if (document.getElementById('forms').value == 'noData') {
            selectedForm = 'Normal';
        } else {
            selectedType = pokemonFormList[document.getElementById('forms').value].type;
            selectedForm = pokemonFormList[document.getElementById('forms').value].form;
        }
        let selectedAttack = document.getElementById('attack').value;
        let selectedDefense = document.getElementById('defense').value;
        let selectedHp = document.getElementById('hp').value;
        if (checkStats(selectedAttack, selectedDefense, selectedHp)) {
            return window.alert('please enter valid STATS! (between 0-15)');
        }
        let selectedPokemon = await getPokemon(selectedId);
        let picturePokemon = selectedPokemon.sprites.front_default;
        let shiny = '0';
        if (document.getElementById('shinyCheckbox').checked) {
            shiny = '1';
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
            picture: picturePokemon,
            attack: selectedAttack,
            defense: selectedDefense,
            hp: selectedHp
        };

        console.log(pokemon)
        // source: https://www.freecodecamp.org/news/javascript-fetch-api-tutorial-with-js-fetch-post-and-header-examples/
        fetch('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', {
            method: "POST",
            body: JSON.stringify(pokemon),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        let html = `<div class="askDiv" id="askDivAdded" >
        <button id="closeButton"><img id="closeWindowTeam" src="./svg/cross.svg" alt="close window"></button>
        <h2>Pokemon added! <br> Would you like to keep adding Pokémon <br>
        or go to your team?</h2>
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonYes">
                <h3>
                GO TO MY TEAM
                </h3>
            </div>
        </div>
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonNo">
                <h3>
                KEEP ADDING                    
                </h3>
            </div>
        </div>
    </div>`;
        document.getElementById('overlay').innerHTML = html;

        document.getElementById('closeButton').addEventListener('click', function () {
            closeOverlay();
        });
        document.getElementById('askButtonNo').addEventListener('click', function () {
            closeOverlay();
        });
        document.getElementById('askButtonYes').addEventListener('click', function () {
            window.location.href = 'https://web2-course-project-site-tv.herokuapp.com/myTeam.html';
        });

    }

    async function getPokemon(id) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = resp.json();
        return data;
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

    function checkStats(attack, defense, hp) {
        if (attack == '' || defense == '' || hp == '') {
            return true;
        } else if (attack < 0 || defense < 0 || hp < 0) {
            return true;
        } else if (attack > 15 || defense > 15 || hp > 15) {
            return true;
        } else {
            return false;
        }
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
            counter++;
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
            if (counter === 1) {
                document.getElementById('pokemonDisplay').innerHTML = '';
            }
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

    async function getOverlay(button) {
        window.scrollTo(0, 0);
        document.body.classList.add("stop-scrolling");
        selectedPokemonID = document.getElementById(button).value;
        let htmlStringOptions = '';
        for (let id in pokemonFormList) {
            if (pokemonFormList[id].pokemon_id == selectedPokemonID) {
                let pokemonForm = pokemonFormList[id].form;
                if (pokemonForm == "Normal") {
                    htmlStringOptions += `<option selected value=${id}>Normal</option>`
                } else {
                    htmlStringOptions += `<option value=${id}>${pokemonForm}</option>`;
                }
            } else if (pokemonFormList[id].pokemon_id > selectedPokemonID) {
                break
            }
        }

        if (htmlStringOptions == '') {
            htmlStringOptions = `<option selected value='noData'>Normal</option>`;
            selectedType = [];
            let name = nameData[selectedPokemonID].name.toLowerCase();
            const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            const resp = await data.json();
            let types = resp.types
            for (let id in types) {
                let type = types[id].type.name;
                selectedType.push(capitalizeFirstLetter(type));
            }
        }

        let htmlString = `<div class="inputScreen">
        <button id="closeButton"><img id="closeWindow" src="./svg/cross.svg" alt="close window"></button>
        <h1>${nameData[selectedPokemonID].name}</h1>
        <div class="inputField">
            <h2>Form:</h2>
            <select class="form-control" id="forms">
                ${htmlStringOptions}
            </select>
            <h2>CP:</h2>
            <input id="cpSelectedPokemon" class="form-control" type="number">
            <h2>Attack:</h2>
            <input id="attack" placeholder="/15" class="form-control" type="number">
            <h2>Defence:</h2>
            <input id="defense" placeholder="/15" class="form-control" type="number">
            <h2>HP:</h2>
            <input id="hp" placeholder="/15" class="form-control" type="number">
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

            document.getElementById('pokemonDisplay').innerHTML = htmlString;
            addEventListenersIndex();
        }
    }

    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
};
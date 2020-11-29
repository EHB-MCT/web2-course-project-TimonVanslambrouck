window.onload = () => {

    let pokemonNameList = [];
    let pokemonFormList = [];
    getAllPokemon();
    getTypes();
    getPokemonForms();



    function showInputs() {
        document.getElementById('overlay').style.display = 'block';
    }

    function addInputs(e) {
        e.preventDefault();
        console.log('add');
        document.getElementById('overlay').style.display = 'none';
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
            document.getElementById('pokemonDisplay').insertAdjacentHTML('beforeend', htmlString);
            document.getElementById(`selectPokemonButton${data[id].id}`).addEventListener('click', function () {
                getOverlay(`selectPokemonButton${data[id].id}`);
            });
        }

    }

    async function getOverlay(button) {
        let selectedPokemonID = document.getElementById(button).value;
        let htmlStringOptions = '';
        for (let id in pokemonFormList) {
            if (pokemonFormList[id].pokemon_id == selectedPokemonID) {
                let pokemonForm = pokemonFormList[id].form;
                if (pokemonForm === "Normal") {
                    htmlStringOptions += `<option value=${id} selected>${pokemonForm}</option>`
                } else {
                    htmlStringOptions += `<option value=${id}>${pokemonForm}</option>`;
                }
            } else if (pokemonFormList[id].pokemon_id > selectedPokemonID) {
                break
            }
        }

        let htmlString = `<div class="inputScreen">
        <h1>${pokemonNameList[selectedPokemonID-1]}</h1>
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
            <button id="saveButton"><a href="#">SAVE</a></button>
        </div>
    </div>`
        document.getElementById('overlay').innerHTML = htmlString;
        document.getElementById('saveButton').addEventListener('click', addInputs);
        showInputs();
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
        console.log(pokemonFormList)
    }

};

// async function runTest() {
//     const resp = await fetch("https://web2-course-project-api-tv.herokuapp.com/api/pokemon");
//     const data = await resp.json();
//     // document.getElementById('content').innerText = JSON.stringify(data);
//     console.log(data);
//     let htmlstring = '';
//     data.forEach(pokemon => {
//         if (`${pokemon.evolution}` == 0) {
//             htmlstring += `<p>${pokemon.name}, ${pokemon.form}, ${pokemon.type}, ${pokemon.cp}, ${pokemon.distance}km,<a target="_blank" href=${pokemon.picture}>picture</a>, /</p>`
//         } else {
//             htmlstring += `<p>${pokemon.name}, ${pokemon.form}, ${pokemon.type}, ${pokemon.cp}, ${pokemon.distance}km,<a target="_blank" href=${pokemon.picture}>picture</a>, ${pokemon.evolution[0].pokemon_name}</p>`
//         }
//     });
//     // document.getElementById('allPokemon').insertAdjacentHTML('afterend', htmlstring);
// }
// runTest();
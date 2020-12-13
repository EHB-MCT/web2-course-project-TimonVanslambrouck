window.onload = () => {
    let apiData;
    let reverseAddedHtml = '';
    let typeList = [];
    let cpList = [];
    let reverseCpList = [];
    let counter = 1;
    getTeam("https://web2-course-project-api-tv.herokuapp.com/api/pokemon", true);
    document.getElementById('specificPokemon').style.display = 'none';
    document.getElementById('types').addEventListener('change', filterByType);
    document.getElementById('sorts').value = 'sort';
    document.getElementById('types').value = 'type';
    document.getElementById('nameSearch').value = '';
    document.getElementById('sorts').addEventListener('change', sortBy);
    document.getElementById('nameSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
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

    async function getTeamData(url) {
        const resp = await fetch(url);
        const data = await resp.json();
        return data;
    }

    async function getTeam(url, replace) {
        const resp = await fetch(url);
        const data = await resp.json();
        apiData = data;
        let htmlStringTotal = '';
        let htmlString = '';
        let pokemonObject = '';
        for (let id in data) {
            pokemonObject = data[id];
            htmlString =
                `<div class="pokemon">
        <button type="submit" id="selectPokemonButton${pokemonObject._id}">
            <div class="pokemonPicutreBox">
                <img class="pokemonPicture"
                    src="${pokemonObject.picture}"
                    alt="picture of ${pokemonObject.name}">                
            </div>
            <h2 class="pokemonName">${pokemonObject.name} <br> ${pokemonObject.cp} CP</h2>
        </button>
        <img id="deleteImage${pokemonObject._id}" class="removeButton" src="./svg/min.svg" alt="">
    </div>`;
            htmlStringTotal += htmlString;
            if (counter === 1) {
                if (!reverseCpList.includes(pokemonObject.cp)) {
                    reverseCpList.push(pokemonObject.cp);
                }
                reverseAddedHtml = htmlString + reverseAddedHtml;
            }
        }
        if (counter === 1) {
            reverseCpList.sort(function (a, b) {
                return a - b;
            });
            for (let index = 0; index < reverseCpList.length; index++) {
                cpList[reverseCpList.length - 1 - index] = reverseCpList[index];
            }
        }
        if (replace == true) {
            document.getElementById('pokemonDisplay').innerHTML = htmlStringTotal;
        } else if (replace == false) {
            document.getElementById('pokemonDisplay').insertAdjacentHTML('beforeend', htmlStringTotal);
        }
        addEventListenersWithId();
        if (counter === 1) {
            getTypes();
            counter++;
        }
    }

    function addEventListenersWithId() {
        for (let id in apiData) {
            let pokemonObjectId = apiData[id]._id;
            let pokemonName = apiData[id].name;
            if (document.getElementById(`selectPokemonButton${pokemonObjectId}`) !== null) {
                document.getElementById(`selectPokemonButton${pokemonObjectId}`).addEventListener('click', function () {
                    showPokemonPage(pokemonObjectId);
                });
            }
            if (document.getElementById(`deleteImage${pokemonObjectId}`) !== null) {
                document.getElementById(`deleteImage${pokemonObjectId}`).addEventListener('click', function () {
                    deletePokemon(pokemonObjectId, pokemonName);
                });
            }
        }
    }

    function getTypes() {
        for (let id in apiData) {
            let pokemonObjectType = apiData[id].type;
            pokemonObjectType.forEach(type => {
                let boolean = typeList.includes(type);
                if (!(boolean)) {
                    typeList.push(type);
                }
            });
        }
        // SOURCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        typeList.sort(function (a, b) {
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
        let htmlString = '';
        typeList.forEach(type => {
            htmlString += `<option value=${type}>${type.toUpperCase()}</option>`
        });
        document.getElementById('types').insertAdjacentHTML('beforeend', htmlString);
    }

    function filterByType() {
        document.getElementById('nameSearch').value = '';
        let selectedType = document.getElementById('types').value;
        let selectedSort = document.getElementById('sorts').value;
        if (selectedType == 'type') {
            if (selectedSort !== 'sort') {
                if (selectedSort == 'shiny') {
                    getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=1`, true);
                } else if (selectedSort == 'noShiny') {
                    getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=0`, true);
                } else if (selectedSort == 'cp') {
                    sortByCP(cpList);
                } else if (selectedSort == 'reverseCp') {
                    sortByCP(reverseCpList);
                } else if (selectedSort == 'added') {
                    getTeam('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', true);
                } else if (selectedSort == 'reverseAdded') {
                    document.getElementById('pokemonDisplay').innerHTML = reverseAddedHtml;
                } else {
                    getTeam('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', true);
                }
            } else {
                getTeam('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', true);
            }
        } else {
            if (selectedSort == 'shiny') {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}&shiny=1`, true);
            } else if (selectedSort == 'noShiny')
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}&shiny=0`, true);
            else if (selectedSort == 'sort') {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}`, true);
            } else if (selectedSort == 'cp') {
                sortByCPWithType(selectedType, 'highLow');
            } else if (selectedSort == 'reverseCp') {
                sortByCPWithType(selectedType, 'lowHigh');
            } else if (selectedSort == 'added') {
                sortByAddedWithType(selectedType, 'oldNew');
            } else if (selectedSort == 'reverseAdded') {
                sortByAddedWithType(selectedType, 'newOld');
            }
        }
    }

    async function sortBy(e) {
        e.preventDefault();
        document.getElementById('nameSearch').value = '';
        let selectedSort = document.getElementById('sorts').value;
        let selectedType = document.getElementById('types').value;
        if (selectedSort == 'sort') {
            if (selectedType !== 'type') {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}`, true);
            } else {
                getTeam('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', true);
            }
        } else if (selectedSort == 'added') {
            if (selectedType !== 'type') {
                sortByAddedWithType(selectedType, 'oldNew')
            } else {
                getTeam('https://web2-course-project-api-tv.herokuapp.com/api/pokemon', true);
            }
        } else if (selectedSort == 'reverseAdded') {
            if (selectedType !== 'type') {
                sortByAddedWithType(selectedType, 'newOld')
            } else {
                document.getElementById('pokemonDisplay').innerHTML = reverseAddedHtml;
            }
        } else if (selectedSort == 'cp') {
            if (selectedType !== 'type') {
                sortByCPWithType(selectedType, 'highLow');
            } else {
                sortByCP(cpList);
            }
        } else if (selectedSort == 'reverseCp') {
            if (selectedType !== 'type') {
                sortByCPWithType(selectedType, 'lowHigh');
            } else {
                sortByCP(reverseCpList);
            }
        } else if (selectedSort == 'shiny') {
            if (selectedType !== 'type') {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=1&type=${selectedType}`, true)
            } else {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=1`, true)
            }
        } else if (selectedSort == 'noShiny') {
            if (selectedType !== 'type') {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=0&type=${selectedType}`, true)
            } else {
                getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?shiny=0`, true)
            }
        }
    }

    async function sortByAddedWithType(selectedType, direction) {
        let addedList = [];
        let typeData = await getTeamData(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}`, true);
        for (let id in typeData) {
            if (!addedList.includes(typeData[id]._id)) {
                addedList.push(typeData[id]._id);
            }
        }
        if (direction == 'newOld') {
            addedList.reverse();
            console.log(addedList);
            sortByID(addedList)
        } else if (direction == 'oldNew') {
            console.log(addedList);
            sortByID(addedList)
        }

    }

    async function sortByID(list) {
        document.getElementById('pokemonDisplay').innerHTML = '';
        list.forEach(listElement => {
            getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${listElement}`, false);

        });

    }

    async function sortByCPWithType(selectedType, direction) {
        let sortedTypeList = [];
        let typeData = await getTeamData(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}`, true);
        for (let id in typeData) {
            if (!sortedTypeList.includes(typeData[id].cp)) {
                sortedTypeList.push(typeData[id].cp);
            }
            if (direction == 'highLow') {
                sortedTypeList.sort(function (a, b) {
                    return b - a;
                });
            } else if (direction == 'lowHigh') {
                sortedTypeList.sort(function (a, b) {
                    return a - b;
                });
            }

        }
        sortByCP(sortedTypeList, selectedType);
    }

    async function sortByCP(list, type) {
        document.getElementById('pokemonDisplay').innerHTML = '';
        // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
        if (type) {
            for (const listElement of list) {
                await getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?cp=${listElement}&type=${type}`, false)
            }
        } else {
            for (const listElement of list) {
                await getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?cp=${listElement}`, false)
            }
        }
    }

    async function showPokemonPage(id) {
        document.getElementById('scrollUpArrow').style.display = 'none';
        document.getElementById('inputsMyTeam').style.display = 'none';
        document.getElementById('pokemonDisplay').style.display = 'none';
        const resp = await fetch(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${id}`)
        const data = await resp.json();
        let pokemonData = data[0];
        let name = pokemonData.name;
        let form = pokemonData.form;
        let cp = Number(pokemonData.cp);
        let attack = Number(pokemonData.attack);
        let defense = Number(pokemonData.defense);
        let hp = Number(pokemonData.hp);
        let iv = Number((attack + defense + hp) / 45 * 100);
        iv = Math.floor(iv);
        let distance = pokemonData.distance;
        if (distance === 0) {
            distance = 'NO DATA';
        }
        let pictureId = pokemonData.id;
        let shiny = 'No';
        if (Number(pokemonData.shiny) == 1) {
            shiny = 'Yes';
        }
        let htmlString =
            `<a id="backButton" href="./myTeam.html"><img id="backArrow" src="./svg/arrow.svg"><span id="back">Back</span></a>
            <a id="deleteButton" href="#">Delete</a>
            <div class="firstColumn">
        <h2>CP:</h2>
        <h2>${cp} CP  </h2>
        <h2>Attack:</h2>
        <h2><img class='ivBar' src="./svg/${attack}.svg"></h2>
        <h2>Defence:</h2>
        <h2><img class='ivBar' src="./svg/${defense}.svg"></h2>
        <h2>HP:</h2>
        <h2><img class='ivBar' src="./svg/${hp}.svg"></h2>
        <h2>IV:</h2>
        <h2>${iv}%</h2>
        <h2>Distance:</h2>
        <h2>${distance}</h2>
        <h2>Form:</h2>
        <h2>${form}</h2>
        <h2>Shiny:</h2>
        <h2>${shiny}</h2>

    </div>
    <div class="secondColumn">
        <h1 id="">${name}</h1>
        <img id="bigImage" src="https://pokeres.bastionbot.org/images/pokemon/${pictureId}.png" alt="picture of ${name}">
        <button id="powerUpButton">POWER UP</button>
    </div> `;

        if (pokemonData.evolution !== 0) {
            let evolution = pokemonData.evolution[0];
            htmlString += `<div class="thirdColumn">
        <h2>Evolution:</h2>
        <h1>${evolution.pokemon_name}</h1>
        <img id="smallImage" src="https://pokeres.bastionbot.org/images/pokemon/${evolution.pokemon_id}.png" alt="picture of ${evolution.pokemon_name}">
        <h3>${evolution.candy_required} Candies</h3>
        <button id="evolveButton">EVOLVE</button>
        </div>`
        } else {
            htmlString += `<div class="thirdColumn">
        <h2> No Evolution</h2>
        </div>`
        }
        document.getElementById('specificPokemon').innerHTML = htmlString;
        document.getElementById('deleteButton').addEventListener('click', function () {
            deletePokemon(id, name);
        });
        document.getElementById('powerUpButton').addEventListener('click', function () {
            powerUpPokemon(id);
        });
        if (pokemonData.evolution !== 0) {
            document.getElementById('evolveButton').addEventListener('click', function () {
                evolvePokemonOverlay(id);
            });
        }
        document.getElementById('specificPokemon').style.display = 'grid';

    }

    async function evolvePokemonOverlay(id) {
        console.log(id);
        window.scrollTo(0, 0);
        document.body.classList.add("stop-scrolling");
        let html = `<div class="askDiv" id="askDivEvolve">
        <button id="closeButton"><img id="closeWindowTeam" src="./svg/cross.svg" alt="close window"></button>
        <h2>Did you evolve this Pokémon? <br>
            If so, what is its new CP?</h2>
        <input class="form-control" id="newCP" placeholder="NEW CP" type="number">
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonYes">
                <h3>
                    YES
                </h3>
            </div>
        </div>
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonNo">
                <h3>
                    NO
                </h3>
            </div>
        </div>
    </div>`;
        document.getElementById('overlayMyTeam').innerHTML = html;
        document.getElementById('newCP').value = '';
        document.getElementById('overlayMyTeam').style.display = 'block';

        document.getElementById('closeButton').addEventListener('click', function () {
            closeOverlay();
        });
        document.getElementById('askButtonNo').addEventListener('click', function () {
            closeOverlay();
        });
        document.getElementById('askButtonYes').addEventListener('click', function () {
            evolvePokemon(id);
        });
    }

    async function evolvePokemon(id) {
        console.log('evolve');
        if (await checkCP(id, true)) {
            const resp = await fetch(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${id}`);
            const data = await resp.json();
            let currentPokemon = data[0];
            let evolution = await getEvoltuions(currentPokemon.evolution[0].pokemon_id, currentPokemon.form);
            let typeList = await getTypeEvolution(currentPokemon.evolution[0].pokemon_name.toLowerCase());
            let distance = await getBuddyDistance(currentPokemon.evolution[0].pokemon_id);

            let evolutionPokemon = {
                _id: currentPokemon._id,
                id: currentPokemon.evolution[0].pokemon_id,
                name: currentPokemon.evolution[0].pokemon_name,
                form: currentPokemon.form,
                type: typeList,
                shiny: currentPokemon.shiny,
                cp: `${document.getElementById('newCP').value}`,
                evolution: evolution,
                distance: distance,
                picture: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${currentPokemon.evolution[0].pokemon_id}.png`,
                attack: currentPokemon.attack,
                defense: currentPokemon.defense,
                hp: currentPokemon.hp
            }
            let url = `https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${currentPokemon._id}`;

            console.log(JSON.stringify(evolutionPokemon));

            await fetch(url, {
                method: "PATCH",
                body: JSON.stringify(evolutionPokemon),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            setTimeout(function () {
                window.location.href = 'https://web2-course-project-site-tv.herokuapp.com/myTeam.html';
            }, 1);
        } else {
            return window.alert('please enter valid CP!');
        }
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

    async function getTypeEvolution(name) {
        let list = [];
        console.log(name)
        const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const resp = await data.json();
        let types = resp.types
        for (let id in types) {
            let type = types[id].type.name;
            list.push(capitalizeFirstLetter(type));
        }
        return list;
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

    async function powerUpPokemon(id) {
        window.scrollTo(0, 0);
        document.body.classList.add("stop-scrolling");
        let html = `<div class="askDiv" id="askDivPowerUp">
        <button id="closeButton"><img id="closeWindowTeam" src="./svg/cross.svg" alt="close window"></button>
        <h2>Did you power up this Pokémon? <br>
            If so, what is its new CP?</h2>
        <input class="form-control" id="newCP" placeholder="NEW CP" type="number">
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonYes">
                <h3>
                    YES
                </h3>
            </div>
        </div>
        <div class="askButtonContainer">
            <div class="askButton" id="askButtonNo">
                <h3>
                    NO
                </h3>
            </div>
        </div>
    </div>`;
        document.getElementById('overlayMyTeam').innerHTML = html;
        document.getElementById('newCP').value = '';
        document.getElementById('overlayMyTeam').style.display = 'block';

        document.getElementById('askButtonYes').addEventListener('click', async function () {
            let cp = document.getElementById('newCP').value;
            await updatePokemon(id, cp);
        });
        document.getElementById('closeButton').addEventListener('click', function () {
            closeOverlay();
        });
        document.getElementById('askButtonNo').addEventListener('click', function () {
            closeOverlay();
        });
    }

    function closeOverlay() {
        document.getElementById('overlayMyTeam').style.display = 'none';
        document.body.classList.remove("stop-scrolling");

    }

    async function deletePokemon(id, name) {
        let url = `https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${id}`;
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            await fetch(url, {
                method: "DELETE"
            });
            window.location.href = 'https://web2-course-project-site-tv.herokuapp.com/myTeam.html'
        }
    }

    function searchName() {
        let search = document.getElementById('nameSearch').value;
        document.getElementById('sorts').value = 'sort';
        document.getElementById('types').value = 'type';
        search = capitalizeFirstLetter(search);
        getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?name=${search}`, true)
    }

    async function updatePokemon(id, cp) {
        if (await checkCP(id, false)) {
            const url = `https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${id}`;
            console.log(url);
            const data = {
                "cp": `${cp}`
            };
            await fetch(url, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            setTimeout(function () {
                window.location.href = 'https://web2-course-project-site-tv.herokuapp.com/myTeam.html';
            }, 1);
        } else {
            return window.alert('please enter valid CP!');
        }
    }

    async function checkCP(id, isAnEvolution) {
        let newCP = document.getElementById('newCP').value;
        const respPokemon = await fetch(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon/${id}`);
        const dataPokemon = await respPokemon.json();
        let oldCP = dataPokemon[0].cp;
        let form = dataPokemon[0].form;
        let selectedID = dataPokemon[0].id;
        if (isAnEvolution) {
            selectedID = dataPokemon[0].evolution[0].pokemon_id
        }
        let maxCP = 5000;
        newCP = newCP * 1;
        oldCP = oldCP * 1;
        if (newCP <= 0 || newCP > 6000 || newCP === '' || newCP <= oldCP) {
            return false
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
            if (data[pokemonId].pokemon_id === selectedID && data[pokemonId].form === form) {
                console.log(data[pokemonId].pokemon_id, selectedID);
                maxCP = data[pokemonId].max_cp;
                console.log(maxCP);
                break
            }
        }

        if (newCP > maxCP) {
            return false;
        }
        return true;

    }

    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

}
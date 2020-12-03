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
        for (let id in data) {
            let pokemonObject = data[id];
            htmlString =
                `<div class="pokemon">
        <button type="submit" id="selectPokemonButton${pokemonObject._id}">
            <div class="pokemonPicutreBox">
                <img class="pokemonPicture"
                    src="${pokemonObject.picture}"
                    alt="picture of ${pokemonObject.name}">
                <a href="./index.html"><img class="removeButton" src="./svg/min.svg" alt=""></a>
            </div>
            <h2 class="pokemonName">${pokemonObject.name} <br> ${pokemonObject.cp} CP</h2>
        </button>
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
            if (document.getElementById(`selectPokemonButton${pokemonObjectId}`) !== null) {
                document.getElementById(`selectPokemonButton${pokemonObjectId}`).addEventListener('click', function () {
                    showPokemonPage(pokemonObjectId);
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
        sortByCP(sortedTypeList);
    }

    async function sortByCP(list) {
        document.getElementById('pokemonDisplay').innerHTML = '';
        // https://lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
        for (const listElement of list) {
            await getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?cp=${listElement}`, false)
        }
    }

    async function showPokemonPage(id) {
        console.log(id);
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
        let pictureId = pokemonData.id;
        let shiny = 'No';
        if (Number(pokemonData.shiny) == 1) {
            shiny = 'Yes';
        }
        let htmlString =
            `<a id="backButton" href="./myTeam.html"><img id="backArrow" src="./svg/arrow.svg"> <span id="back">Back</span></a>
            <div class="firstColumn">
        <h2>CP:</h2>
        <h2>${cp} CP</h2>
        <h2>Attack:</h2>
        <h2><img src="./svg/${attack}.svg"></h2>
        <h2>Defence:</h2>
        <h2><img src="./svg/${defense}.svg"></h2>
        <h2>HP:</h2>
        <h2><img src="./svg/${hp}.svg"></h2>
        <h2>IV:</h2>
        <h2>${iv}%</h2>
        <h2>Distance:</h2>
        <h2>${distance} KM</h2>
        <h2>Form:</h2>
        <h2>${form}</h2>
        <h2>Shiny:</h2>
        <h2>${shiny}</h2>

    </div>
    <div class="secondColumn">
        <h1 id="">${name}</h1>
        <img id="bigImage" src="https://pokeres.bastionbot.org/images/pokemon/${pictureId}.png" alt="picture of ${name}">
    </div> `;

        if (pokemonData.evolution !== 0) {
            let evolution = pokemonData.evolution[0];
            htmlString += `<div class="thirdColumn">
        <h2>Evolution:</h2>
        <h1>${evolution.pokemon_name}</h1>
        <img id="smallImage" src="https://pokeres.bastionbot.org/images/pokemon/${evolution.pokemon_id}.png" alt="picture of ${evolution.pokemon_name}">
        <h3>${evolution.candy_required} Candies</h3>
        </div>`
        } else {
            htmlString += `<div class="thirdColumn">
        <h2> No Evolution</h2>
        </div>`
        }
        htmlString += '</div>';
        document.getElementById('specificPokemon').innerHTML = htmlString;
        document.getElementById('specificPokemon').style.display = 'grid';

    }

    function searchName() {
        let search = document.getElementById('nameSearch').value;
        document.getElementById('sorts').value = 'sort';
        document.getElementById('types').value = 'type';
        search = capitalizeFirstLetter(search);
        getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?name=${search}`, true)
    }

    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

}
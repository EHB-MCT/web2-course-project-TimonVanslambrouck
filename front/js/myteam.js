window.onload = () => {
    let apiData;
    let reverseAddedHtml;
    let typeList = [];
    let counter = 1;
    getTeam("https://web2-course-project-api-tv.herokuapp.com/api/pokemon");
    document.getElementById('types').addEventListener('change', filterByType);
    document.getElementById('nameSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchName();
        }
    });

    async function getTeam(url) {
        const resp = await fetch(url);
        const data = await resp.json();
        apiData = data;
        console.log(apiData[0]);
        let htmlString = '';
        for (let id in data) {
            let pokemonObject = data[id];
            htmlString +=
                `<div class="pokemon">
            <button type="submit" id="selectPokemonButton${pokemonObject._id}" value=${pokemonObject.id}>
                <div class="pokemonPicutreBox">
                    <img class="pokemonPicture"
                        src="${pokemonObject.picture}"
                        alt="picture of ${pokemonObject.name}">
                    <a href="./index.html"><img class="removeButton" src="./svg/min.svg" alt=""></a>
                </div>
                <h2 class="pokemonName">${pokemonObject.name} <br> ${pokemonObject.cp} CP</h2>
            </button>
        </div>`;
            reverseAddedHtml = htmlString + reverseAddedHtml;
        }
        document.getElementById('pokemonDisplay').innerHTML = htmlString;
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
        let selectedType = document.getElementById('types').value;
        if (selectedType == 'type') {
            return
        } else {
            getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?type=${selectedType}`)
        }
    }

    function showPokemonPage(id) {
        console.log(id);
    }

    function searchName() {
        let search = document.getElementById('nameSearch').value;
        search = capitalizeFirstLetter(search);
        getTeam(`https://web2-course-project-api-tv.herokuapp.com/api/pokemon?name=${search}`)
    }

    // https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}
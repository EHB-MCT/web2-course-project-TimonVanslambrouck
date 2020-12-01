window.onload = () => {
    let apiData;
    getTeam();

    async function getTeam() {
        const resp = await fetch("https://web2-course-project-api-tv.herokuapp.com/api/pokemon");
        const data = await resp.json();
        apiData = data;
        let htmlString = '';
        for (let id in data) {
            let pokemonObject = data[id];
            console.log(pokemonObject);
            htmlString +=
                `<div class="pokemon">
            <button type="submit" id="selectPokemonButton${pokemonObject._id}" value=${pokemonObject.id}>
                <div class="pokemonPicutreBox">
                    <img class="pokemonPicture"
                        src="${pokemonObject.picture}"
                        alt="picture of ${pokemonObject.name}">
                    <img class="addButton" src="./svg/min.svg" alt="">
                </div>
                <h2 class="pokemonName">${pokemonObject.name}</h2>
            </button>
        </div>`;
            document.getElementById('pokemonDisplay').insertAdjacentHTML('beforeend', htmlString);
            document.getElementById(`selectPokemonButton${pokemonObject._id}`).addEventListener('click', function () {
                showPokemonPage(`selectPokemonButton${pokemonObject._id}`);
            });
        }
    }

}
window.onload = () => {

    document.getElementById('selectPokemonButton').addEventListener('click', showInputs);
    document.getElementById('saveButton').addEventListener('click', addInputs);
    getTypes();

    function showInputs(e) {
        e.preventDefault();
        document.getElementById('overlay').style.display = 'block';
    }

    function addInputs(e) {
        e.preventDefault();
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
window.onload = () => {
    async function runTest() {
        const resp = await fetch(urlData.url);
        const data = await resp.json("https://web2-course-project-api-tv.herokuapp.com/api/pokemon");
        document.getElementById('content').innerText = JSON.stringify(data);
        console.log(data);
        let htmlstring = '';
        data.forEach(pokemon => {
            if (`${pokemon.evolution}` == 0) {
                htmlstring += `<p>${pokemon.name}, ${pokemon.form}, ${pokemon.type}, ${pokemon.cp}, ${pokemon.distance}km,<a target="_blank" href=${pokemon.picture}>picture</a>, /</p>`
            } else {
                htmlstring += `<p>${pokemon.name}, ${pokemon.form}, ${pokemon.type}, ${pokemon.cp}, ${pokemon.distance}km,<a target="_blank" href=${pokemon.picture}>picture</a>, ${pokemon.evolution[0].pokemon_name}</p>`
            }
        });
        document.getElementById('allPokemon').insertAdjacentHTML('afterend', htmlstring);
    }
    runTest();
};
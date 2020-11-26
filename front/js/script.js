window.onload = () => {
    async function runTest() {
        const urlResp = await fetch('../config.json');
        const urlData = await urlResp.json();
        console.log(urlData.url);
        const resp = await fetch(urlData.url);
        const data = await resp.json();
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
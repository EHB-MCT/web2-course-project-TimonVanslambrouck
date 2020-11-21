window.onload = () => {
    async function runTest() {
        const resp = await fetch("http://localhost:3000/api/pokemon");
        const data = await resp.json();
        document.getElementById('content').innerText = JSON.stringify(data);
        console.log(data);
        let htmlstring = '';
        data.forEach(pokemon => {
            htmlstring += `<p>${pokemon.name}, ${pokemon.form}, ${pokemon.type}, ${pokemon.cp},<a target="_blank" href=${pokemon.picture}>picture</a></p>`
        });
        document.getElementById('allPokemon').insertAdjacentHTML('afterend', htmlstring);
    }
    runTest();
};
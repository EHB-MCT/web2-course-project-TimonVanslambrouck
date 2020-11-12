const {
    response
} = require("express");

window.onload = () => {
    async function runTest() {
        const resp = await fetch();
        const data = resp.json();
        document.getElementById('content').innerText = JSON.stringify(data);
        console.log(data);
    }

    runTest();

}
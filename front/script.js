window.onload = () => {
    async function runTest() {
        const resp = await fetch("http://localhost:3000/api/pokemon");
        const data = await resp.json();
        document.getElementById('content').innerText = JSON.stringify(data);
        console.log(data);
    }
    runTest();
};
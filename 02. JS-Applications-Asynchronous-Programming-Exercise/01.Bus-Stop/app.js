async function getInfo() {
    const stopIdElement = document.getElementById('stopId');
    const stopNameElement = document.getElementById('stopName');
    const timeTableElement = document.getElementById('buses');

    timeTableElement.replaceChildren();
    stopNameElement.textContent = 'Loading...';
    
    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopIdElement.value}`;

    try {
        const responce = await fetch(url);
        if (responce.status != 200) {
            throw new Error(`${responce.status} - ${responce.statusText}`);
        }

        const data = await responce.json()
        
        stopIdElement.value = '';
        stopNameElement.textContent = data.name;

        Object.entries(data.buses).forEach(b => {
            const li = document.createElement('li');
            li.textContent = `Bus ${b[0]} arrives in ${b[1]} minutes`;
            timeTableElement.appendChild(li);
        });

    } catch (err) {
        stopNameElement.textContent = err.message;
    }
}
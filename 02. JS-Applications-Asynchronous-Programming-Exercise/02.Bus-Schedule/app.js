function solve() {
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const infoOutput = document.querySelector('#info span');

    let stop = {
        name: '',
        next: 'depot'
    };

    async function depart() {
        const url = `http://localhost:3030/jsonstore/bus/schedule/${stop.next}`;
        departBtn.disabled = true;

        try {
            const response = await fetch(url);
            if (response.status != 200) {
                throw new Error(`${response.status} - ${response.statusText}`);
            }

            stop = await response.json();

        } catch (err) {
            infoOutput.textContent = 'Error';
            departBtn.disabled = true;
            arriveBtn.disabled = true;
        }

        infoOutput.textContent = `Next stop ${stop.name}`;

        arriveBtn.disabled = false;
    }

    function arrive() {
        infoOutput.textContent = `Arriving at ${stop.name}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();
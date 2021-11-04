const locationInput = document.getElementById('location');
const submitBtn = document.getElementById('submit');
const forecastDiv = document.getElementById('forecast');
const currentDiv = document.getElementById('current');
const upcomingDiv = document.getElementById('upcoming');
const content = document.getElementById('content');
const loader = createElement('div', { id: 'loader', className: 'loader' });

async function attachEvents() {
    submitBtn.addEventListener('click', async () => {
        await processForecast();
    });

}

attachEvents();

async function processForecast() {
    try {
        submitBtn.disabled = true;
        submitBtn.value = 'Loading...';
        forecastDiv.style.display = 'none';

        content.appendChild(loader);

        const forecastData = await getForecast(locationInput.value);

        content.removeChild(loader);
        renderForecast(forecastData);
    } catch (err) {
        content.removeChild(loader);
        renderError(err);
    }

    submitBtn.value = 'Get Weather';
    submitBtn.disabled = false;
}

async function getForecast(name) {
    try {
        const code = await getLocationCode(name);

        const [current, upcoming] = await Promise.all([
            getCurrent(code),
            getUpcoming(code)
        ]);

        return { current, upcoming };
    } catch (err) {
        throw (err);
    }
}

async function getLocationCode(name) {
    const url = 'http://localhost:3030/jsonstore/forecaster/locations';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        const data = await res.json();

        const location = data.find(l => l.name == name);
        if (location == undefined) {
            throw new Error('Invalid location!');
        }

        return location.code;
    } catch (err) {
        throw (err);
    }
}

async function getCurrent(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        throw (err);
    }
}

async function getUpcoming(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        throw (err);
    }
}

function renderForecast(data) {
    const weatherSymbols = {
        Sunny: String.fromCharCode(0x2600), // ☀
        'Partly sunny': String.fromCharCode(0x26C5), // ⛅
        Overcast: String.fromCharCode(0x2601), // ☁
        Rain: String.fromCharCode(0x2614), // ☂
        Degrees: String.fromCharCode(176)
    };

    const degrees = weatherSymbols.Degrees;
    const name = data.current.name;
    const condition = data.current.forecast.condition;
    const low = data.current.forecast.low;
    const high = data.current.forecast.high;


    const currentElement =
        createElement('div', { className: 'forecasts' },
            createElement('span', { className: 'condition symbol' }, weatherSymbols[condition]),
            createElement('span', { className: 'condition' },
                createElement('span', { className: 'forecast-data' }, name),
                createElement('span', { className: 'forecast-data' }, `${low}${degrees}/${high}${degrees}`),
                createElement('span', { className: 'forecast-data' }, condition)
            )
        );

    currentDiv.replaceChildren();
    currentDiv.appendChild(createElement('div', { className: 'label' }, 'Current conditions'));
    currentDiv.appendChild(currentElement);

    const upcomingElement = createElement('div', { className: 'forecast-info' });

    data.upcoming.forecast.forEach(d => {
        const element = createElement('span', { className: 'upcoming' },
            createElement('span', { className: 'symbol' }, weatherSymbols[d.condition]),
            createElement('span', { className: 'forecast-data' }, `${d.low}${degrees}/${d.high}${degrees}`),
            createElement('span', { className: 'forecast-data' }, d.condition)
        );

        upcomingElement.appendChild(element);
    });

    upcomingDiv.replaceChildren();
    upcomingDiv.appendChild(createElement('div', { className: 'label' }, 'Three-day forecast'));
    upcomingDiv.appendChild(upcomingElement);

    forecastDiv.style.display = 'block';
}

function renderError(err) {
    alert(err);
}

function createElement(type, attr, ...content) {
    const element = document.createElement(type);

    for (let prop in attr) {
        element[prop] = attr[prop];
    }

    for (let item of content) {
        if (typeof item == 'string' || typeof item == 'number') {
            item = document.createTextNode(item);
        }
        element.appendChild(item);
    }

    return element;
}
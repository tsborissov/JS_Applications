async function solution() {
    const articles = await getArticles();
    renderArticles(articles);
}

solution();

const mainSection = document.getElementById('main');

function renderArticles(data) {
    data.forEach(a => {
        const moreBtn = e('button', { className: 'button', id: a._id }, 'More');

        const element = 
            e('div', {className: 'accordion'}, 
                e('div', {className: 'head'}, 
                    e('span', {}, a.title),
                    moreBtn
                )
            );
        
        moreBtn.addEventListener('click', renderArticleById.bind(null, a._id, element, moreBtn));

    mainSection.appendChild(element);
    });
}

async function renderArticleById(id, element, button) {

    if (button.textContent == 'More') {
        button.textContent = 'Loading...';
        button.disabled = true;

        const articleDetails = await getArticleById(id);

        const detailsP = document.createElement('p');
        detailsP.textContent = articleDetails.content;

        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('extra');
        detailsDiv.style.display = 'block';
        detailsDiv.appendChild(detailsP);
        
        element.appendChild(detailsDiv);

        button.textContent = 'Less';
        button.disabled = false;
    } else {
        const targetElement = element.querySelector('.extra');
        targetElement.remove();

        button.textContent = 'More';
    }
    
}

async function getArticles() {
    const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        return await res.json();
    } catch (err) {
        alert(err.message);
    }
}

async function getArticleById(id) {
    const url = `http://localhost:3030/jsonstore/advanced/articles/details/${id}`;

    try {
        const res = await fetch(url);
        if (res.status != 200) {
            throw new Error(`${res.status} - ${res.statusText}`);
        }

        return res.json();
    } catch (err) {
        alert(err.message);
    }
}

function e(type, attr, ...content) {
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
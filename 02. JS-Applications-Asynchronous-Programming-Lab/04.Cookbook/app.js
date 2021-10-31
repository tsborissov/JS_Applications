window.addEventListener('DOMContentLoaded', start);

async function start() {
    const output = document.querySelector('main');

    const recipes = await getRecipes();

    output.replaceChildren();

    recipes.map(createPreview).forEach(r => output.appendChild(r));
}

function createPreview(recipe) {
    const article = document.createElement('article');
    article.classList.add('preview');

    const titleH2 = document.createElement('h2');
    titleH2.textContent = `${recipe.name}`;

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.appendChild(titleH2);

    const img = document.createElement('img');
    img.src = `${recipe.img}`;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('small');
    imgDiv.appendChild(img);

    article.appendChild(titleDiv);
    article.appendChild(imgDiv);

    article.addEventListener('click', () =>  {
        titleH2.textContent = 'Loading...';
        togglePreview(recipe._id, article)
    });

    return article;
}

async function togglePreview(id, preview) {
    const recipe = await getRecipeById(id);

    const titleH2 = document.createElement('h2');
    titleH2.textContent = recipe.name;

    const img = document.createElement('img');
    img.src = recipe.img;

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('thumb');
    imgDiv.appendChild(img);

    const ingredientsH3 = document.createElement('h3');
    ingredientsH3.textContent = 'Ingredients:';

    const ingredientsUl = document.createElement('ul');
    recipe.ingredients.forEach(ingr => {
        const li = document.createElement('li');
        li.textContent = ingr;
        ingredientsUl.appendChild(li);
    });

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');
    ingredientsDiv.appendChild(ingredientsH3);
    ingredientsDiv.appendChild(ingredientsUl);

    const bandDiv = document.createElement('div');
    bandDiv.classList.add('band');
    bandDiv.appendChild(imgDiv);
    bandDiv.appendChild(ingredientsDiv);

    const descriptionH3 = document.createElement('h3');
    descriptionH3.textContent = 'Preparation:';

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.appendChild(descriptionH3);

    recipe.steps.forEach(step => {
        const p = document.createElement('p');
        p.textContent = step;

        descriptionDiv.appendChild(p);
    });

    const article = document.createElement('article');
    article.appendChild(titleH2);
    article.appendChild(bandDiv);
    article.appendChild(descriptionDiv);

    preview.replaceWith(article);
}

async function getRecipes() {
    const url = 'http://localhost:3030/jsonstore/cookbook/recipes';

    try {
        const responce = await fetch(url);

        if (responce.status != 200) {
            throw new Error(`${responce.status} - ${responce.statusText}`);
        }

        const data = await responce.json();
        return Object.values(data);
    }
    catch (err) {
        alert(err);
    }
}

async function getRecipeById(id) {
    const url = `http://localhost:3030/jsonstore/cookbook/details/${id}`;

    try {
        const responce = await fetch(url);

        if (responce.status != 200) {
            throw new Error(`${responce.status} - ${responce.statusText}`);
        }

        const data = await responce.json();
        return data;
    }
    catch (err) {
        alert(err);
    }
}
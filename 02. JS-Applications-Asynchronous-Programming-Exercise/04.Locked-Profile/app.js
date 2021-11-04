const output = document.getElementById('main');

const loader = 
    e('div', { className: 'sk-chase' },
        e('div', { className: 'sk-chase-dot' }),
        e('div', { className: 'sk-chase-dot' }),
        e('div', { className: 'sk-chase-dot' }),
        e('div', { className: 'sk-chase-dot' }),
        e('div', { className: 'sk-chase-dot' }),
        e('div', { className: 'sk-chase-dot' }),
);

output.replaceChildren(loader);

async function lockedProfile() {
    const users = await getUsers();

    renderInfo(users);
}

async function getUsers() {
    const url = 'http://localhost:3030/jsonstore/advanced/profiles';
    try {
        const response = await fetch(url);
        if (response.status != 200) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }

        return Object.values(await response.json());
    } catch (err) {
        alert(err.message);
    }
}

function renderInfo(users) {
    let counter = 1;

    output.replaceChildren();

    users.forEach(u => {
        const moreBtn = document.createElement('button');
        moreBtn.textContent = 'Show more';

        const hiddenInfoDiv =
            e('div', { id: `user${counter}HiddenFields` },
                e('hr'),
                e('label', {}, 'Email:'),
                e('input', { type: 'email', name: `user${counter}Email`, disabled: true, readonly: true, value: u.email }),
                e('label', {}, 'Age:'),
                e('input', { type: 'text', name: `user${counter}Age`, disabled: true, readonly: true, value: u.age })
            );

        const lock = e('input', { type: 'radio', name: `user${counter}Locked`, value: 'locked', checked: true });
        const unlock = e('input', { type: 'radio', name: `user${counter}Locked`, value: 'unlock' });
        

    const element =
        e('div', { className: 'profile' },
            e('img', { src: './iconProfile2.png', className: 'userIcon' }),
            e('label', {}, 'Lock'),
            lock,
            e('label', {}, 'Unlock'),
            unlock,
            e('br'),
            e('hr'),
            e('label', {}, 'Username'),
            e('input', { type: 'text', name: `user${counter}Username`, disabled: true, readonly: true, value: u.username }),
            hiddenInfoDiv,
            moreBtn
        );

    moreBtn.addEventListener('click', toggleView.bind(null, hiddenInfoDiv, moreBtn, unlock));

    output.appendChild(element);
    counter++;
});
}

function toggleView(hiddenInfoDiv, moreBtn, unlock) {
    if(unlock.checked == false) {
        return;
    }

    if (hiddenInfoDiv.style.display == 'block') {
        hiddenInfoDiv.style.display = 'none';
        moreBtn.textContent = 'Show more'
    } else {
        hiddenInfoDiv.style.display = 'block';
        moreBtn.textContent = 'Show less'
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
async function loadCommits() {
    const user = document.getElementById('username').value;
    const repo = document.getElementById('repo').value;
    const commits = document.getElementById('commits');

    commits.replaceChildren();

    const li = document.createElement('LI');
    li.textContent = 'Loading...';
    commits.appendChild(li);

    const url = `https://api.github.com/repos/${user}/${repo}/commits`;

    try {
        const responce = await fetch(url);

        if (responce.status != 200) {
            throw new Error();
        }

        let data = await responce.json();
        data = data.map(c => c.commit);

        commits.replaceChildren();

        data.forEach(c => {
            const commitLi = document.createElement('LI');
            commitLi.textContent = `${c.author.name}: ${c.message}`;
            commits.appendChild(commitLi);
        });
    }
    catch(err) {
        commits.replaceChildren();
        const li = document.createElement('LI');
        li.textContent = `Error: ${err.status} (Not Found)`;
        commits.appendChild(li);
    }
    
    
}
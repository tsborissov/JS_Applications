async function loadRepos() {
	const user = document.getElementById('username').value;
	const output = document.getElementById('repos');

	output.textContent = '';
	output.textContent = 'Loading...';

	const url = `https://api.github.com/users/${user}/repos`;

	try {
		const response = await fetch(url);
		
		if (response.status != 200) {
			throw new Error(`${response.status} - ${response.statusText}`);
		}

		const data = await response.json();
		renderData(data, output);
	}
	catch(err) {
		output.textContent = '';
		alert(err);
	}
}

function renderData(data, output) {
	output.replaceChildren();

	data.forEach(r => {
		const anchor = document.createElement('A');
		anchor.textContent = r.full_name;
		anchor.href = r.html_url;

		const li = document.createElement('LI');
		li.appendChild(anchor);

		output.appendChild(li);
	});

}
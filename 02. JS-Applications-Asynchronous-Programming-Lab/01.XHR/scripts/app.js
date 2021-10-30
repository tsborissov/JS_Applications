async function loadRepos() {
   const url = 'https://api.github.com/users/testnakov/repos';

   const output = document.getElementById('res');

   output.textContent = '';
   output.textContent = 'Loading...';

   try {
      const response = await fetch(url);
      const data = await response.text();

      output.textContent = data;
   }
   catch(err) {
      alert(err);
   }
}

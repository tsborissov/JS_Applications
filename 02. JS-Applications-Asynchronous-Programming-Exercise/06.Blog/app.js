const postsSelect = document.getElementById('posts');
const loadPostsBtn = document.getElementById('btnLoadPosts');
const viewPostBtn = document.getElementById('btnViewPost');
const postTitle = document.getElementById('post-title');
const postBody = document.getElementById('post-body');
const postComments = document.getElementById('post-comments');
const commentsH2 = document.querySelector('h2');

viewPostBtn.disabled = true;

function attachEvents() {
    loadPostsBtn.addEventListener('click', renderPosts);
    viewPostBtn.addEventListener('click', renderPostDetails)
}

attachEvents();

async function getPosts() {
    const url = 'http://localhost:3030/jsonstore/blog/posts';

    try {
        const response = await fetch(url);
        if (response.status != 200) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        return Object.values(data);
    } catch (err) {
        alert(err.message);
    }
}

async function getPostById(id) {
    const url = `http://localhost:3030/jsonstore/blog/posts/${id}`;

    try {
        const response = await fetch(url);
        if (response.status != 200) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (err) {
        alert(err.message);
    }
}

async function getCommentsByPostId(id) {
    const url = 'http://localhost:3030/jsonstore/blog/comments';

    try {
        const response = await fetch(url);
        if (response.status != 200) {
            throw new Error(`${response.status} - ${response.statusText}`);
        }

        let data = await response.json();

        data = Object.values(data).filter(p => p.postId == id);

        return data;
    } catch (err) {
        alert(err.message);
    }
}

async function renderPosts(event) {
    loadPostsBtn.disabled = true;
    loadPostsBtn.textContent = 'Loading...';

    clearContent();

    postsSelect.replaceChildren();

    const posts = await getPosts();

    loadPostsBtn.disabled = false;
    loadPostsBtn.textContent = 'Load Posts';

    posts.forEach(p => {
        const element = document.createElement('option');
        element.value = p.id;
        element.textContent = p.title;
        postsSelect.appendChild(element);
    });

    viewPostBtn.disabled = false;
}

async function renderPostDetails(event) {
    clearContent();
    viewPostBtn.textContent = 'Loading...';

    const postId = postsSelect.selectedOptions[0].value;

    const [targetPost, targetComments] = await Promise.all([
        getPostById(postId),
        getCommentsByPostId(postId)
    ]);

    viewPostBtn.textContent = 'View';
    postTitle.textContent = targetPost.title;
    postBody.textContent = targetPost.body;
    commentsH2.textContent = 'Comments';

    targetComments.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.text;

        postComments.appendChild(li);
    });
}

function clearContent() {
    postTitle.textContent = '';
    postBody.textContent = '';
    postComments.textContent = '';
    commentsH2.textContent = '';
}
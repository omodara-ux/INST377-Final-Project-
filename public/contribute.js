async function fetchPosts() {
    const response = await fetch('/users_posts');
    const posts = await response.json();

    const postsList = document.getElementById('postsList');
    postsList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = `Name: ${post.name}, Posted At: ${post.created_at}, Description: ${post.desc}`;
        postsList.appendChild(listItem);
    });
}

document.getElementById('postForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const desc = document.getElementById('desc').value;

    console.log('Submitting:', { name, desc });

    await fetch('/user_post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, desc }),
    });

    document.getElementById('postForm').reset();
    fetchPosts();
});

fetchPosts();
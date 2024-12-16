const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // Serves static files from 'public' folder

const supabaseUrl = 'https://wdtypnolaudgigkbasem.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdHlwbm9sYXVkZ2lna2Jhc2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTQyOTAsImV4cCI6MjA0OTc3MDI5MH0.yKuTd1B1KtDo3WA0gsHQe3vQ9UQsT5gJ1pntFQdJsfA';
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

// Serve posts.html when the root URL (/) is accessed
app.get('/post', (req, res) => {
    res.sendFile(__dirname + '/views/post.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/details', (req, res) => {
    res.sendFile(__dirname + '/views/search.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/views/search.html');
});


app.get('/users_posts', async (req, res) => {
    console.log("Attempting to get all users");
    
    const {data, error} = await supabase
        .from('user_posts')
        .select();
    
    console.log('Data Retrieved:', data);
    console.log('Error:', error);

    if (error) {
        console.log('Error:', error);
        res.send(error);
    } else {
        console.log("Successfully retrieved");
        res.send(data);
    }
});

app.post('/user_post', async (req, res) => {
    console.log("Received POST request at /user_post"); // Log when endpoint is hit

    const { name, desc } = req.body;
    console.log('Request Body:', { name, desc }); // Log request data

    const { data, error } = await supabase
        .from('user_posts')
        .insert([{ name, desc, created_at: new Date().toISOString() }]);

    if (error) {
        console.log('Error inserting data:', error); // Log any error
        return res.status(500).send(error); // Send error response
    }

    console.log('Successfully added post:', data); // Log successful insertion
    res.status(200).send({ message: 'Post added successfully!' }); // Respond to frontend
});

app.listen(port, () => {
    console.log("App is working :)");
});

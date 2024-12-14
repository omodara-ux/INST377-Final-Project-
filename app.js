const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/users_posts', async (req, res) => {
    const { data, error } = await supabase.from('user_posts').select();
    if (error) res.status(500).send(error);
    else res.send(data);
});

app.post('/user_post', async (req, res) => {
    const { name, desc } = req.body;
    const { data, error } = await supabase
        .from('user_posts')
        .insert([{ name, desc, created_at: new Date().toISOString() }]);
    if (error) res.status(500).send(error);
    else res.status(200).send({ message: 'Post added successfully!' });
});

module.exports = app;

const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = 'https://wdtypnolaudgigkbasem.supabase.co';
const supabaseKey = env;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/users_posts', async (req, res) => {
    console.log("Attempting to get all users");
    
    const {data, error} = await supabase
        .from('user_posts')
        .select()
    
    console.log('Data Retrived:', data)
    console.log('Error:', error)

    if(error) {
        console.log('Error:', error);
        res.send(error);
    } else {
        console.log("Sucessfully retrieved")
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
    console.log("App is working :)")
})
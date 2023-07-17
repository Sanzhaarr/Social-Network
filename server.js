const express = require("express");
const mongoose = require("mongoose")
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'web')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'login.html'));
});



// const userRouter = require("./routes/users");
// const {router} = require("express/lib/application");
//
// app.use("/users", userRouter);


mongoose
    .connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });

// Create a schema for user registration
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

// Create a User model and specify the collection name
const User = mongoose.model('User', userSchema, 'web osek');

// Middleware to parse JSON data in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', (req, res) => {
    const { email, password } = req.body;

    const user = new User({ email, password });
    console.log('User:', user);

    user
        .save()
        .then(() => {
            console.log('User saved successfully');
            res.status(200).json({ message: 'User registered successfully' });

        })
        .catch((error) => {
            console.log('Error saving user:', error);
            res.status(500).json({ error: 'Error registering user' });
        });
});

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//
//     User.findOne({ email })
//         .then((user) => {
//             if (user) {
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (result) {
//                         // Redirect to the index.html file if login is successful
//                         res.redirect('/index.html');
//                     } else {
//                         res.status(401).json({ error: 'Invalid credentials' });
//                     }
//                 });
//             } else {
//                 res.status(401).json({ error: 'Invalid credentials' });
//             }
//         })
//         .catch((error) => {
//             res.status(500).json({ error: 'Error logging in' });
//         });
// });


app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email, password })
        .then((user) => {
            if (user) {
                // res.status(200).json({ message: 'User logged in successfully' });
                res.sendFile(path.join(__dirname, 'web','index.html'));


            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error logging in' });
        });
});

const postSchema = new mongoose.Schema({
    text: String
});

// Create a post model
const Post = mongoose.model('Post', postSchema);

// Create an Express app
app.use(express.json());

// API endpoint to create a post
app.post('/api/posts', (req, res) => {
    const post = new Post({
        text: req.body.text
    });

    post.save()
        .then((createdPost) => {
            res.status(201).json(createdPost);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to create post' });
        });
});





app.listen(port, () => {
    console.log('Server is listening on port 3000');
});




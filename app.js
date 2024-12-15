const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Database setup
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, profile_picture TEXT DEFAULT 'https://i.imgur.com/mT0z8zV.png')");
});

// Middleware for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
        if (err) {
            return res.status(500).send('Error registering user');
        }
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err || !row) {
            return res.status(401).send('Invalid credentials');
        }
        req.session.userId = row.id;
        res.redirect('/home');
    });
});

app.get('/home', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    db.get("SELECT * FROM users WHERE id = ?", [req.session.userId], (err, row) => {
        if (err || !row) {
            return res.status(500).send('Error retrieving user data');
        }
        res.render('home', { user: row });
    });
});

app.post('/upload', upload.single('profile-picture'), (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const profilePictureUrl = `/images/${req.file.filename}`;
    db.run("UPDATE users SET profile_picture = ? WHERE id = ?", [profilePictureUrl, req.session.userId], function(err) {
        if (err) {
            return res.status(500).send('Error updating profile picture');
        }
        res.redirect('/home');
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
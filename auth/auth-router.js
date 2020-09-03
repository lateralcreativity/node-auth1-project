const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    const creds = req.body;
    const rounds = process.env.ROUNDS || 8;
    const hash = bcryptjs.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
    .then(payload => {
        res.status(201).json({ data: payload });
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.getBy({ username })
    .then(users => {
        const user = users[0]
        if(user && bcryptjs.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            res.status(200).json({ message: 'Logged in' })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                res.status(500).json({ message: 'error logging out try again later' })
            } else {
                res.status(204).end();
            }
        })
    } else {
        res.status(200).json({ message: 'already logged out' });
    }
});

module.exports = router;
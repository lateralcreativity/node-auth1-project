const router = require('express').Router();
const Users = require('./users-model');

router.get('/', (req, res) => {
    Users.get()
    .then(users => {
        res.status(200).json({ data: users })
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    })
})

module.exports = router;
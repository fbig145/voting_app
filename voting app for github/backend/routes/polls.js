const express = require('express');
const Poll = require('../models/Poll');

const router = express.Router();

// create a new poll
router.post('/', async (req, res) => {
    try {
        const poll = new Poll({
            name: req.body.pollName
        });
        await poll.save();
        res.status(201).send(poll);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

//update a poll
router.put('/:name', async (req, res) => {
    try {
        const poll = await Poll.findOne({ name: req.params.name });
        if (!poll) {
            return res.status(404).send('Poll not found.');
        }
        poll.candidates.push(req.body.candidateName);
        await poll.save();
        res.status(200).send(poll);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});


// get all polls
router.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.find();
        res.send(polls);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});


module.exports = router;

const express = require('express');
const actionModel = require('../data/helpers/actionModel');
const router = express.Router()


router.get('/', async(req, res) => {
    try {
        const actions = await actionModel.get();
        res.status(200).json(actions)
    } catch (error) {
        res.status(500).json({
            errorMessage: error
        })
    }
})
module.exports = router;
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

router.get('/:id', validateActionId, async(req, res) => {
    res.status(200).send(req.action);
})







//middleware
async function validateActionId(req, res, next) {
    const id = req.params.id;
    if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
        return res.status(400).json({
            errorMessage: "Invalid action id supplied"
        });
    }
    try {
        const action = await actionModel.get(id);
        if (!id) {
           return res.status(404).json({
                errorMessage: "The action with the specified ID does not exist."
            })
        }
        req.action = action;
    } catch (error) {
        return res.status(500).json({
            error: 'yyyyyyy'
        })
    }
    return next();
};

module.exports = router;
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

router.delete('/:id', validateActionId, async(req, res) => {
    try {
        const action = await actionModel.remove(req.action.id);
        console.log(action)
        if (action) {
            return res.status(200).json({
                message: 'action successfully deleted'
            });
        } else {
            return res.status(404).json({
                message: "The action with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The action could not be removed"
        })
    }
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
        req.action = action;
    } catch (error) {
        return res.status(404).json({
            errorMessage: "The action with the specified ID does not exist."
        })
    }
    return next();
};

module.exports = router;
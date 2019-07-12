const express = require('express');
const projectModel = require('../data/helpers/projectModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const projects = await projectModel.get();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            errorMessage: error
        })
    }
});










function validateProject(req, res, next) {
    // if (!req.body.length) {
    //     return res.status(400).json({
    //         message: 'missing user data'
    //     })
    // }
    if (!req.body.name || !req.body.description || !req.body.completed) {
        return res.status(400).send({
          message: 'missing required name field',
        });
      }
      return next()

};

async function validateProjectId(req, res, next) {
    const id = req.params.id;
    if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
        return res.status(400).json({
            errorMessage: "Invalid user id supplied"
        });
    }
    try {
        const project = await projectModel.get(id);
        if (!id) {
            res.status(404).json({
                errorMessage: "The project with the specified ID does not exist."
            })
        }
        req.project = project;
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
    return next();
};
module.exports = router;
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

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id % 1 !== 0 || id < 0) {
        return res.status(400).json({
            errorMessage: "Invalid user id supplied"
        });
    }
    projectModel.get(id)
        .then(project => {
            if (!project) {
                return res.status(404).json({
                    status: 404,
                    message: "The project with the specified ID does not exist."
                })
            }
            return res.status(200).json({
                status: 200,
                project
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: 500,
                error: "The project information could not be retrieved."
            })
        })
        
});

router.delete('/:id', validateProjectId, async (req, res) => {
    //const id = parseInt(req.params.id, 10);
    try {
        const user = await projectModel.remove(id);
        if (user) {
            return res.status(200).json({
                message: 'project successfully deleted'
            });
        } else {
            return res.status(404).json({
                message: "The project with the specified ID does not exist."
            })
        }
    } catch (error) {
        res.status(500).json({
            error: "The project could not be removed"
        })
    }
});

// router.put('/:id', validateProjectId, async(req, res) => {

// })

router.post('/', validateProject, async (req, res) => {
        let { name, description} = req.body
        const newProject = {
           name,
           description,
        }
        try {
            const  newProjectId = await projectModel.insert(newProject);
            const newProjectData = await projectModel.get(newProjectId.id);
            return res.status(201).json(newProjectData);
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: 'There was an error while saving the user to the database',
            })
        }
    });











function validateProject(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'missing user data'
        })
    }
    if (!req.body.name || !req.body.description) {
        return res.status(400).send({
          message: 'missing required name or description field',
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
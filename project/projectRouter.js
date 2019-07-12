const express = require('express');
const projectModel = require('../data/helpers/projectModel');
const actionModel = require('../data/helpers/actionModel')
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
    try {
        const project = await projectModel.remove(id);
        if (project) {
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



router.put('/:id', validateProjectId, validateProject, async(req, res) => {
    const updatedProject = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed
    }
    try {
        const updateResponse = await projectModel.update(req.project.id, updatedProject);
        console.log(updateResponse)
        if (updateResponse === 1) {
            updatedProjectData = await projectModel.get(req.project.id);
            return res.status(200).json(updatedProjectData);
        }
        throw new Error;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'There was an error while saving the user to the database',
          });
    }
})


router.get('/:id/action', validateProjectId, async(req, res) => {
    try {
        const getProject = await projectModel.getProjectActions(req.project.id)
        console.log(getProject)
        if (getProject) {
            console.log(getProject.length)
            return res.status(200).json({
                data: getProject
            })
        }
        return res.status(200).json({
            message: 'The project has no post to display'
        })
    } catch (error) {
        return res.status(500).json({
            error: 'There was an error while getting the actions from the database',
          });
    }
})

router.post('/:id/action', validateProjectId, validateAction, async(req, res) => {
    const { project_id, description, notes} = req.body
    const newAction = { 
        project_id: req.project.id,
        description,
        notes,
    }
    try {
        const newActionId = await actionModel.insert(newAction)
        console.log(newActionId)
        const newActionData = await projectModel.get(newActionId);
        return res.status(201).json(newActionId)
    } catch (error) {
        return res.status(500).json({
            error: 'There was an error while saving the post to the database',
          });
    }
})





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



function validateAction(req, res, next) {
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: 'missing user data'
        })
    }
    if (!req.body.notes || !req.body.description) {
        return res.status(400).send({
          message: 'missing required notes or description field',
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
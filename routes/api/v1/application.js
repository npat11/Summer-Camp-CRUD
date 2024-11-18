const { ApplicationDB } = require("../../../database/applicationDB");
const applicationDB = new ApplicationDB();

const express = require('express');
const applicationRouter = express.Router();
applicationRouter.use(express.json());

applicationRouter.post('/application', async (req, res) => {
    const application = {
        "name": req.body.name,
        "email": req.body.email,
        "gpa": req.body.gpa,
        "background": req.body.background
    };
    try {
        await applicationDB.insertApplication(application);
        console.log(application);
        res.status(201).send('Application created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create application');
    }
});

applicationRouter.get('/application', async (req, res) => {
    const email = req.query.email;
    const gpa = parseFloat(req.query.gpa);
    const comparison = req.query.comparison;

    try {
        if (email) {
            const application = await applicationDB.lookUpApplication(email);
            if (application) {
                res.json(application);
            } else {
                res.status(404).send('Application not found');
            }
        } else if (!isNaN(gpa) && comparison) {
            let comparisonOperator;
            switch (comparison) {
                case "eq":
                    comparisonOperator = "$eq";
                    break;
                case "neq":
                    comparisonOperator = "$ne";
                    break;
                case "gt":
                    comparisonOperator = "$gt";
                    break;
                case "lt":
                    comparisonOperator = "$lt";
                    break;
                case "gte":
                    comparisonOperator = "$gte";
                    break;
                case "lte":
                    comparisonOperator = "$lte";
                    break;
                default:
                    res.status(400).send('Invalid comparison operator');
                    return;
            }
            const applications = await applicationDB.lookUpGPA(gpa, comparisonOperator);
            res.json(applications);
        } else {
            const applications = await applicationDB.listApplications();
            res.json(applications);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve applications');
    }
});

applicationRouter.get('/application/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const application = await applicationDB.getApplicationById(id);
        if (application) {
            res.json(application);
        } else {
            res.status(404).send('Application not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve application');
    }
});

applicationRouter.put('/application/:id', async (req, res) => {
    const id = req.params.id;
    const updatedApplication = req.body;
    try {
        const result = await applicationDB.updateApplication(id, updatedApplication);
        if (result.modifiedCount === 1) {
            res.status(200).send('Application updated successfully');
        } else {
            res.status(404).send('Application not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update application');
    }
});

applicationRouter.delete('/application/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await applicationDB.deleteApplication(id);
        if (result.deletedCount === 1) {
            res.status(200).send('Application deleted successfully');
        } else {
            res.status(404).send('Application not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete application');
    }
});

applicationRouter.use((request, response) => {
    response.status(404).send("Application Not Found");
});

module.exports = applicationRouter;

//checking to make sure the correct thing uploaded
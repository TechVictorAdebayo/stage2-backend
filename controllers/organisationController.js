const Organisation = require ('../models/organisation');
const { v4: uuidv4 } = require ('uuid');

const createOrganisation = async (req, res) => {
    const { name, description } = req.body;

    if (!name){
        return res.status(422).json({
            errors: [{field: 'name', message: "Name is required."}],
        });
    }

    try {
        const newOrganisation = await Organisation.create({
            orgId: uuidv4(),
            name,
            description,
        });

        return res.status(201).json({
            status: 'Success',
            message: 'Organisation created successfully',
            data: newOrganisation,
        });
    } catch(error){
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client Error'
        });
    }
};

const getOrganisations = async (req, res) => {
    try{
        const organisations = await Organisation.findAll({
            where: {
                userId: req.user.userId
            }
        });
        return res.status(200).json({
            status: 'Success',
            message: 'Organisations retrieved succesfully',
            data: { organisations },
        });
    }catch (error){
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400,
        });
    }
};


const getOrganisation = async (req, res) => {
    const { orgId } = req.params;

    try {
        const organisation = await Organisation.findOne({ where: { orgId } });

        if (!organisation) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Organisation not found',
                statusCode: 404
            });
        }
        return res.status(200).json({
            status: 'Success',
            message: 'Organisation retrieved successfully',
            data: organisation,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Client error',
            statusCode: 400,
        });
    }
};

module.exports = {createOrganisation, getOrganisations, getOrganisation};
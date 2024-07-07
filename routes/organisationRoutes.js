const express = require ('express');
const {createOrganisation, getOrganisations, getOrganisation} = require ('../controllers/organisationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrganisation);
router.get('/', authMiddleware, getOrganisations);
router.get('/:orgId', authMiddleware, getOrganisation);

module.exports = router;
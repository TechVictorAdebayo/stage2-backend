const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Organisation = require('../models/organisation');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

chai.use(chaiHttp);
const { expect } = chai;

describe('Organisation Controller', () => {
    let token;

    beforeEach(async () => {
        // Clear the database before each test
        await Organisation.destroy({ where: {} });

        const userId = uuidv4();
        token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('POST /organisations', () => {
        it('should create a new organisation', (done) => {
            const organisation = {
                name: 'Test Organisation',
                description: 'This is a test organisation',
            };

            chai.request(app)
                .post('/organisations')
                .set('Authorization', `Bearer ${token}`)
                .send(organisation)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('status', 'Success');
                    done();
                });
        });

        it('should return 422 if name is not provided', (done) => {
            const organisation = {
                description: 'This is a test organisation',
            };

            chai.request(app)
                .post('/organisations')
                .set('Authorization', `Bearer ${token}`)
                .send(organisation)
                .end((err, res) => {
                    expect(res).to.have.status(422);
                    done();
                });
        });
    });

    describe('GET /organisations', () => {
        it('should get all organisations', (done) => {
            chai.request(app)
                .get('/organisations')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('status', 'Success');
                    done();
                });
        });
    });

    describe('GET /organisations/:orgId', () => {
        it('should get a specific organisation by ID', (done) => {
            const orgId = uuidv4();
            Organisation.create({
                orgId,
                name: 'Test Organisation',
                description: 'This is a test organisation',
            }).then(() => {
                chai.request(app)
                    .get(`/organisations/${orgId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('status', 'Success');
                        done();
                    });
            });
        });

        it('should return 404 if organisation not found', (done) => {
            const orgId = uuidv4();
            chai.request(app)
                .get(`/organisations/${orgId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
    });
});

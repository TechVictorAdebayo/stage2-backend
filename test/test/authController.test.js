const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Make sure the app is correctly exported from your app.js file
const User = require('../models/user');
const Organisation = require('../models/organisation');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Controller', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await User.destroy({ where: {} });
        await Organisation.destroy({ where: {} });
    });

    describe('POST /register', () => {
        it('should register a new user and create a new organisation', (done) => {
            const user = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
            };

            chai.request(app)
                .post('/auth/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('status', 'Success');
                    expect(res.body.data).to.have.property('accessToken');
                    done();
                });
        });

        it('should return 409 if email is already taken', (done) => {
            const user = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
            };

            User.create({
                userId: uuidv4(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                phone: user.phone,
            }).then(() => {
                chai.request(app)
                    .post('/auth/register')
                    .send(user)
                    .end((err, res) => {
                        expect(res).to.have.status(409);
                        done();
                    });
            });
        });
    });

    describe('POST /login', () => {
        it('should login an existing user', (done) => {
            const user = {
                userId: uuidv4(),
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
            };

            User.create({
                ...user,
                password: bcrypt.hashSync(user.password, 10)
            }).then(() => {
                chai.request(app)
                    .post('/auth/login')
                    .send({ email: user.email, password: user.password })
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('status', 'Success');
                        expect(res.body.data).to.have.property('accessToken');
                        done();
                    });
            });
        });

        it('should return 401 for invalid credentials', (done) => {
            const user = {
                email: 'invalid@example.com',
                password: 'invalidpassword'
            };

            chai.request(app)
                .post('/auth/login')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    done();
                });
        });
    });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const sinon = require('sinon');

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis()
        };
        next = sinon.stub();
    });

    it('should return 401 if no token is provided', async () => {
        await authMiddleware(req, res, next);
        expect(res.status.calledWith(401)).to.be.true;
    });

    it('should return 403 if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalidtoken';
        await authMiddleware(req, res, next);
        expect(res.status.calledWith(403)).to.be.true;
    });

    it('should call next if token is valid', async () => {
        const userId = uuidv4();
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.headers.authorization = `Bearer ${token}`;

        sinon.stub(User, 'findOne').returns({ userId });

        await authMiddleware(req, res, next);
        expect(next.calledOnce).to.be.true;
        User.findOne.restore();
    });
});

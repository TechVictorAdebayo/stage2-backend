const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const User = require('../models/user');
const Organisation = require ('../models/organisation');
const { v4: uuidv4 } = require ('uuid');

const register =  async (req, res) => {
    const {firstName, lastName, email, password, phone } = req.body;

    //Validate input
    if (!firstName || !lastName || !email || !password) {
        return res.status (422).json({
            errors: [{field: 'all', message: 'All fields are required except phone.'}],
        });
    }

    try {
        const existingUser = await User.findOne({where: { email }});

        if (existingUser){
            return res.status(409).json({
                errors: [{field: 'email', message: 'Email already taken.'}],
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            userId: uuidv4(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });

        const newOrganisation = await Organisation.create({
            orgId: uuidv4(),
            firstName,
            name: `${firstName}'s Organisation`,
            description: '',
        });

        // Create JWT token
        const accessToken = jwt.sign({ userId: newUser.userId},
            process.env.JWT_SECRET,
            {expiresIn: '1h',}
        );

        return res.status(201).json({
            status: 'Success',
            message: 'Registeration Successful',
            data: {
                accessToken,
                user: {
                    userId: newUser.userId,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                },
            },
        });
    }catch (error){
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Registration Unsuccessful',
            statusCode: 400,
        });
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(422).json({
            errors: [{field: 'all', message: 'Email and password are required.'}]
        });
    }

    try {
        const user = await User.findOne({where: {email}});

        if (!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({
                status: 'Bad Request',
                message: 'Authentication Failed ',
                statusCode: 401,
            });
        }

        const accessToken = jwt.sign({userId: user.userId},
            process.env.JWT_SECRET, 
            {expiresIn: '1h'},
        );

        return res.status(200).json({
            status: 'Success',
            message: 'Login Successful',
            data: {
                accessToken,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    }catch (error){
        console.error('Login Error', error)
        
        return res.status(400).json({
            status: 'Bad Request',
            message: 'Authentication Failed',
            statusCode: 401,
        });
    }
};


module.exports = {register, login};
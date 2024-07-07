const express = require ('express');
const bodyParser  = require ('body-parser');
const sequelize = require ('./config/database');
const dotenv = require ('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({force: true}).then(() => {
    app.listen(PORT, () => {
        console.log(`Serveris running on ${PORT}`)
    });
});

console.log(process.env.DB_PASSWORD)
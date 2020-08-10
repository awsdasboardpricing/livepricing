

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const createUser = require('./create-user/create-user.js')
var axios = require('axios');

// QUERY TABLE
const sequelize = new Sequelize('hle', 'hle', 'vanmaibenem2829', {
    host: 'localhost',
    dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  }
);
// const AwsResource = sequelize.define('aws_resource', {
//     // Model attributes are defined here
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true
//     },
//     resource_id: {
//       type: DataTypes.STRING
//     }
//   }, {
//     timestamps: false
//   }
// );

// const firstModel = AwsResource.create({ id:1, resource_id: "resourceId1" })
// ===== END WRITING DATA ON A TABLE ======

const app = express();

const port = 3000

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

// ROUTES
app.get('/', (req, res) => res.json({ message: 'Hello World' }))
app.post('/signup', (req, res) => {
    createUser(req.body)
    res.json({ message: 'from signup' })
})

app.get('/login', (req, res) => res.sendStatus(200))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

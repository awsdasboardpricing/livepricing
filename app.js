

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const createUser = require('./create-user/create-user.js')
const axios = require('axios');
const aws = require('aws-sdk');
const zlib = require('zlib');


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

// AWS credentials
const credentials = {
  id: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY
}
// ================

const app = express();

const port = 3000

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

// REST ROUTES
app.get('/', (req, res) => res.json({ message: 'Hello World' }))
app.post('/signup', (req, res) => {
    createUser(req.body)
    res.json({ message: 'from signup' })
})

app.get('/login', (req, res) => res.sendStatus(200))


// ======Data ingestion from S3 to DB====
const s3Params = {
  accessKeyId: credentials.id,  /* required */ 
  secretAccessKey: credentials.secret, /* required */ 
  Bucket: 'hoang-le-personal-data-bucket'
}
const filePath = 'AWSLogs/261786166738/Config/us-east-2/2020/8/6/ConfigHistory/261786166738_Config_us-east-2_ConfigHistory_AWS::EC2::InternetGateway_20200806T183059Z_20200806T183059Z_1.json.gz'
const s3 = new aws.S3(s3Params)
const readStream = s3.getObject({
  Bucket: s3Params.Bucket,
  Key: filePath
}).createReadStream().pipe(zlib.createGunzip())
readStream.on('data', chunk => {
  console.log('found data here')

  console.log(chunk.toString('utf8'))
  console.log(chunk.length)
})

// Main app
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

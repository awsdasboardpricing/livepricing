

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const createUser = require('./create-user/create-user.js')
const aws = require('aws-sdk');
const zlib = require('zlib');


// QUERY TABLE
const sequelize = new Sequelize('hle', 'hle', 'vanmaibenem2829', {
    host: 'localhost',
    dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  }
);

// const firstModel = AwsResource.create({ id:1, resource_id: "resourceId1" })
// ===== END WRITING DATA ON A TABLE ======

// AWS credentials
const credentials = {
  id: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY
}// ======AWS credentials ====
const s3Params = {
  accessKeyId: credentials.id,  /* required */ 
  secretAccessKey: credentials.secret, /* required */ 
  Bucket: 'hoang-le-personal-data-bucket'
}
// ================

const app = express();

const port = 3000

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}));

// REST ROUTES
app.get('/', (req, res) => res.json({ message: 'health check' }))
app.post('/signup', (req, res) => {
    createUser(req.body)
    res.json({ message: 'from signup' })
})

app.get('/login', (req, res) => res.sendStatus(200))

app.post('/s3persist', (req, res) => {
  const filePath = req.body.filePath
  const parse = streamFromS3ToDB(filePath,s3Params)
  if (parse != null){
    return res.sendStatus(200)
  }
  return res.sendStatus(400)
})

// ======Data ingestion from S3 to DB====
// streamFromS3ToDB(filePath, s3Params)

function streamFromS3ToDB(s3Path, awsCredentials) {
  const s3 = new aws.S3(awsCredentials)
  const readStream = s3.getObject({
    Bucket: awsCredentials.Bucket,
    Key: s3Path
  }).createReadStream().pipe(zlib.createGunzip())
  readStream.on('data', chunk => {
    const json = decodeChunk(chunk);
    if(json != null) {
      json.configurationItems.map(item => writeAwsConfig({resourceId: item.resourceId}))
    }
    return console.log("Done with this chunk")
  })
}

// Json decoder
function decodeChunk(chunk) {
  try{
    return JSON.parse(chunk.toString('utf8'))
  } catch (error) {
    console.log("Json decode byte stream failed")
  }
}
// =================


// DAO stuff
const AwsResource = sequelize.define('aws_resource', {
  // Model attributes are defined here
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  resource_id: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false
}
);

// ALL DAO CALL NEEDS TO BE ASYNC AND IN A TRY/CATCH
async function writeAwsConfig(configItem){
  try{
    return AwsResource.create({resource_id: configItem.resourceId })
  } catch (error){
    return console.log("Failed to write Aws configItem")
  }
}
//==============================

// Main app
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

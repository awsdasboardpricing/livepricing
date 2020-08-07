const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// QUERY TABLE
const sequelize = new Sequelize('hle', 'hle', 'vanmaibenem2829', {
    host: 'localhost',
    dialect: 'postgres' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  }
);
const AwsResource = sequelize.define('aws_resource', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    resource_id: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  }
);

const firstModel = AwsResource.create({ id:1, resource_id: "resourceId1" })
// ===== END WRITING DATA ON A TABLE ======

const app = express();

const port = 3000

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => res.json({ message: 'Hello World' }))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

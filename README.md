Spin up local postgres with docker
`docker run --name test_user -p 5432:5432 -e POSTGRES_PASSWORD=vanmaibenem2829 -e POSTGRES_USER=hle -d postgres`

Create dev migration
`db-migrate create {name_of_migration_version}`
Run all migrations
`db-migrate up`

To run the app
`node app.js`

To send a request: 
![alt text](https://github.com//awsdashboardpricing/livepricing/readmeMaterials/Screen Shot 2020-08-09 at 9.49.45 AM.png)


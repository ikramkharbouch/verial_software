
# Verial Software

This is a software that manages a tire portal system and it's clients and providers, it's created using Electron, React Forge, Expressjs and Postgresql and it uses a bunch of npm packages and libraries.

## Run Locally

Clone the project

```bash
git clone https://github.com/ikramkharbouch/verial_software.git
```
Go to the project server, install dependecies then run the server
```bash
cd server && npm install && npm run start
```

Go to the project directory, install dependecies then run the app
```bash
npm install && npm run start
```


### Make sure to install Postgresql using brew and run this command to generate a database using ./server/db.js

#### Run Postgres locally:
```bash
brew update
brew doctor
brew install postgres
postgres -D /usr/local/var/postgres
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_URI`

`DB_USER`

`DB_HOST`

`DB_DATABASE`

`DB_PASSWORD`

`DB_PORT`


## License

[MIT](https://choosealicense.com/licenses/mit/)

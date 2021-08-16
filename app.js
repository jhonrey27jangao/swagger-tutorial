const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const low = require('lowdb');
const booksRouter = require('./routes/books')
const swaggerUI = require('swagger-ui-express')
const swaggerJSdoc = require('swagger-jsdoc')

const PORT =  process.env.PORT || 4000
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new  FileSync("db.json")
const db = low(adapter)

db.defaults({ books: [] }).write();

const options = {
    apis: ["./routes/*.js"],
    definition: {
        openapi: "3.0.0", 
        info: {
            title: "Books API",
            version: "1.0.0",
            description: "A simple libraryu book api"
        },
        servers: [
            {
                url: 'http://localhost:4000'
            }
        ],
    }
}  

const specs = swaggerJSdoc(options);

const app = express();

app.db = db;

app.use(cors());
app.use(express.json())
app.use(morgan("dev"))
app.use('/books', booksRouter)
app.use('/api-docs/', swaggerUI.serve, swaggerUI.setup(specs))

app.listen(PORT, () => console.log(`Server running in port ${PORT}`))
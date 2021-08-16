const express = require('express');
const router = express.Router()
const { nanoid } = require('nanoid')
const idlength = 8;

/**
*  @swagger
*   components:
*     schemas:
*       Book:
*         type: object
*         required:
*           - title
*           - author
*         properties:
*           id:
*             type: string
*             description: Auto generated id for the book
*         example:
*             id: sx1asda2DdasDsw23
*             title: Bahay Bugahan
*             description: Sa ilalim ng puting hikaw
*/

/**
 * @swagger
 * tags: 
 *  name: Books
 *  description: The API for managing Books
*/


/**
 * @swagger
 * /books:
 *  get:
 *      summary: Returns the list of all the books
 *      tags: [Books]
 *      responses:
 *          200:
 *             description: List of all books.
 *             content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 */

router.get('/', (req, res) => {
    const books = req.app.db.get('books')
    res.send(books)
})

/**
 * @swagger
 * /books/{id}:
 *      get:
 *          summary: Get the book by id
 *          tags: [Books]
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                  type: string
 *                  required: true
 *                  description: The book id
 *          responses:
 *              200:     
 *                  description: The book desc by id
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Book'
 *              404:     
 *                  description: The book was not found              
 */

router.get('/:id', (req, res) => {
    const books = req.app.db.get('books')
    const book = books.find((item) => item.id === req.params.id)
    if(!book) res.sendStatus(404)
    res.send(book)
})

/**
 * @swagger
 * /books:
 *      post:
 *          summary: Create new book
 *          tags: [Books]
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Book'
 *          responses:
 *              200:
 *                  description: The book was created successfully
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Book'
 *              500:
 *                  description: Some error comes up
 *          
 */

router.post('/', (req, res) => {
    try {
        const books = req.app.db.get('books')
        const book = {
            id: nanoid(idlength),
            ...req.body
        }
        books.push(book).write()
        res.send(book)
    }
    catch(e) {
        return res.status(500).send(e)
    }
})

/**
 * @swagger
 * /books/{id}:
 *  put:
 *      summary: Update your book
 *      tags: [Books]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The Book ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Book'
 *      responses:
 *          200:
 *              description: The book has been updated successfully
 *          404:
 *              description: Ooops! Can't find the book lods!
 *          500:
 *              description: Some error comes up!
 */

router.put("/:id", (req, res) => {
    const books = req.app.db.get('books')
    try {
        books.get("books").find({id: req.params.id}).assign(req.body).write()
        res.send(books.find({id: req.params.id}))
    } catch(e) {
        return res.status(500).send(e)
    }
})

router.delete('/:id', (req, res) => {
    const books = req.app.db.get('books')
    books.remove({id: req.params.id}).write();
    res.sendStatus(200);
})


module.exports = router
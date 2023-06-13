const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Article = require('../models/article')
const helper = require('./test_helper')

const api = supertest(app)

//4.13
test('delete a single post resource', async () => {
   const articles = await Article.find({})
   const response = await articles[0].deleteOne()
   const articlesAtEnd = await helper.articlesInDB()
   expect(articles).toHaveLength(articlesAtEnd.length + 1)
})


afterAll(async () => {
  await mongoose.connection.close()
})
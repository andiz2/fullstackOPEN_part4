const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Article = require('../models/article')
const helper = require('./test_helper')

const api = supertest(app)

//4.8
//test without async/await, but with promises
test('articles are returned as json with promises', () => {
	 api
		.get('/api/articles')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

//test with async/await, not with promises
test('articles are returned as json with async', async () => {
	 await  api
		.get('/api/articles')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

//4.9
//test with async/await, not with promises
test('verifies that the unique identifier property of the blog posts is named id', async () => {
	  let articles = await helper.articlesInDB()
   	  console.log(articles)
   	  expect(articles[0].id).toBeDefined();
   	  expect(articles[0].id).toEqual('64882d1c0f959853a2aa7381')
})

//4.10 with async/await, not promises
test('a valid article can be added with async', async () => {
	  let articlesAtStart = await helper.articlesInDB()
   	  const newArticle = {
   	  	title: "ani si HODL",
   	  	author: "Andrei Dr",
   	  	likes: 222,
   	  	id: '64993d1c0f934853a2aa1255'
   	  }

   	  await api
   	  	.post('/api/articles')
   	  	.send(newArticle)
   	  	.expect(201)
   	  	.expect('Content-Type', /application\/json/)
   	  let articlesAtEnd = await helper.articlesInDB()
   	  expect(articlesAtEnd).toHaveLength(articlesAtStart.length + 1);
})

//4.10 with promises, not async/await 
//I'll be back


afterAll(async () => {
  await mongoose.connection.close()
})
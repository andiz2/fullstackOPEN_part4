const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Article = require('../models/article')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Article.deleteMany({})
  let articleObject = new Article(helper.initialArticles[0])
  await articleObject.save()

  articleObject = new Article(helper.initialArticles[1])
  await articleObject.save()
})

test('a valid article can be added', async () => {
  const newArticle = {
    title: 'timpul si marea',
    author: 'Thimony Fetch',
    url: 'http://www.nuam.com',
    likes: 21,
  }

  await api
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const articlesAtEnd = await helper.articlesInDb()
  expect(articlesAtEnd).toHaveLength(helper.initialArticles.length + 1)

  const titles = articlesAtEnd.map(n => n.title)

  expect(titles).toContain(
    'timpul si marea'
  )
})

test('article without title is not added', async () => {
  const newArticle = {
  	author: 'Fulesiz Fetch',
    url: 'http://www.facem.com',
    likes: 12,
  }

  await api
    .post('/api/articles')
    .send(newArticle)
    .expect(400)

  const articlesAtEnd = await helper.articlesInDb()

  expect(articlesAtEnd).toHaveLength(helper.initialArticles.length)

})

test('all articles are returned', async () => {
  const response = await api.get('/api/articles')

  expect(response.body).toHaveLength(helper.initialArticles.length)
})

test('a specific article is within the returned articles', async () => {
  const response = await api.get('/api/articles')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'Hai sa fa'
  )
})

test('a specific article can be viewed', async () => {
  const articlesAtStart = await helper.articlesInDb()

  const articleToView = articlesAtStart[0]

  const resultArticle = await api
    .get(`/api/articles/${articleToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultArticle.body).toEqual(articleToView)
})

test('an article can be deleted', async () => {
  const articlesAtStart = await helper.articlesInDb()
  const articleToDelete = articlesAtStart[0]

  await api
    .delete(`/api/articles/${articleToDelete.id}`)
    .expect(204)

  const articlesAtEnd = await helper.articlesInDb()

  expect(articlesAtEnd).toHaveLength(
    helper.initialArticles.length - 1
  )

  const titles = articlesAtEnd.map(r => r.title)

  expect(titles).not.toContain(articleToDelete.titles)
})

test('articles are returned as json', async () => {
  await api
    .get('/api/articles')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two articles', async () => {
  const response = await api.get('/api/articles')

  expect(response.body).toHaveLength(2)
})

test('the first article is timpul si marea', async () => {
  const response = await api.get('/api/articles')

  expect(response.body[0].title).toBe('timpul si marea')
})


afterAll(async () => {
  await mongoose.connection.close()
})
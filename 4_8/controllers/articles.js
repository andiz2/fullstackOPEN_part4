const articlesRouter = require('express').Router()
const Article = require('../models/article')

articlesRouter.get('/', (request, response) => {
  Article.find({}).then(articles => {
    response.json(articles)
  })
})

articlesRouter.get('/:id', async (request, response, next) => {
    const article = await Article.findById(request.params.id)
      if (article) {
        response.json(article)
      } else {
        response.status(404).end()
      }
})

articlesRouter.post('/', async (request, response) => {
  const body = request.body

  const article = new Article({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
    const savedArticle = await article.save()
    response.status(201).json(savedArticle)
})

articlesRouter.delete('/:id', async (request, response) => {
    await Article.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

articlesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const article = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Article.findByIdAndUpdate(request.params.id, article, { new: true })
    .then(updatedArticle=> {
      response.json(updatedArticle)
    })
    .catch(error => next(error))
})

module.exports = articlesRouter
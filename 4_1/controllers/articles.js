const articlesRouter = require('express').Router()
const Article = require('../models/article')

articlesRouter.get('/', (request, response) => {
  Article.find({}).then(articles => {
    response.json(articles)
  })
})

articlesRouter.get('/:id', (request, response, next) => {
  Article.findById(request.params.id)
    .then(article => {
      if (article) {
        response.json(article)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

articlesRouter.post('/', (request, response, next) => {
  const body = request.body

  const article = new Article({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  article.save()
    .then(savedArticle => {
      response.json(savedArticle)
    })
    .catch(error => next(error))
})

articlesRouter.delete('/:id', (request, response, next) => {
  Article.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
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
const articlesRouter = require('express').Router()
const Article = require('../models/article')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

articlesRouter.get('/', async (request, response) => {
  const articles = await Article.find({}).populate('user', {username: 1, name: 1})
  response.json(articles)
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

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const article = new Article({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
    const savedArticle = await article.save()
    user.articles = user.articles.concat(savedArticle._id)
    await user.save()
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
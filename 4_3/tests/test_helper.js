const Article = require('../models/article')

const initialArticles = [
  {
    title: 'timpul si marea',
    author: 'Thimony Fetch',
    url: 'http://www.nuam.com',
    likes: 21,
  },
  {
    title: 'Hai sa fa',
    author: 'You and me',
    url: 'http://www.facem.com',
    likes: 31,
  }
]

const nonExistingId = async () => {
  const article = new Article({ content: 'willremovethissoon' })
  await article.save()
  await article.deleteOne()

  return article._id.toString()
}

const articlesInDb = async () => {
  const articles = await Article.find({})
  return articles.map(article => article.toJSON())
}

module.exports = {
  initialArticles, nonExistingId, articlesInDb
}
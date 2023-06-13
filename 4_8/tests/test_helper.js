const Article = require('../models/article')

const articlesInDB = async () => {
  const articles = await Article.find({})
  return articles.map(article => article.toJSON())
}

module.exports = {
   articlesInDB
}
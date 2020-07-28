const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const userLanguage = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.language.id
    )
    const userWords = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    )
    const userWord = userWords[0]
    res.send({
      nextWord: userWord.original,
      totalScore: userLanguage.total_score,
      wordCorrectCount: userWord.correct_count ,
      wordIncorrectCount: userWord.incorrect_count,
    })
    } catch (error) {
      next(error)
    }

  })

languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })

module.exports = languageRouter

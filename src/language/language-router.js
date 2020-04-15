const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const jsonBodyParser = express.json()
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
     const head = await LanguageService.getLanguageHead(
      req.app.get('db'),
      req.language.head,
     )
     res.json(head)
   } catch (error) {
     next (error)
   }
  })


languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    // implement me
    // res.send('implement me!')

    try {
      let userAnswer = req.body.guess
      console.log(userAnswer)

      if(!userAnswer) {
        return res.status(400).json({ error: `Missing 'guess' in request body` })
      }

      res.status(204)

    } catch(error) {
      next(error)
    }
  })

module.exports = languageRouter

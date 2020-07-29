const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('../LinkedList')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

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

      const head = await LanguageService.getWord(
        req.app.get('db'),
        userLanguage.head
      )
      console.log(head.memory_value)
      res.send({
        nextWord: head.original,
        totalScore: userLanguage.total_score,
        wordCorrectCount: head.correct_count,
        wordIncorrectCount: head.incorrect_count,
      })
    } catch (error) {
      next(error)
    }

  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      const { guess } = req.body

      for (const field of ['guess'])
        if (!req.body[field])
          return res.status(400).json({
            error: `Missing '${field}' in request body`
          })
      let userLanguage = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.language.id
      )
      let userWords = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )
      let head = await LanguageService.getWord(
        req.app.get('db'),
        userLanguage.head
      )
      let nextWord = await LanguageService.getWord(
        req.app.get('db'),
        head.next
      )
      let isCorrect = false
      let correct_count = head.correct_count
      let incorrect_count = head.incorrect_count
      let total_score = userLanguage.total_score
      let memVal = head.memory_value
      let currentWord = head

      if (head.translation != guess) {
        incorrect_count++
        memVal = 1
        // Update the head.next to point at the head. Should only happen if the guess is incorrect
        await LanguageService.updateWord(
          req.app.get('db'),
          nextWord.id,
          {
            next: head.id
          }
        )
      } else if (head.translation = guess) {
        isCorrect = true
        correct_count++
        total_score++
        memVal = memVal * 2
      }
      for (let i = 0; i < head.memVal; i++) {
        
        currentWord = await LanguageService.getWord(
            req.app.get('db'),
            currentWord.next
          )
      }
      // console.log(memVal)
      // Update the head values and point it forward m place. Wont update memory_value
      await LanguageService.updateWord(
        req.app.get('db'),
        head.id,
        {
          memory_value: memVal,
          correct_count: correct_count,
          incorrect_count: incorrect_count,
          next: currentWord.next
        }
      )
      // Updates the head.next to be the new head 
      await LanguageService.updateHead(
        req.app.get('db'),
        nextWord.id,
        req.language.id
      )
      // Update the total score for the language
      await LanguageService.updateLanguage(
        req.app.get('db'),
        req.language.id,
        { 
          total_score: total_score,
          head: head.next
        }
      )

      // console.log(head.memory_value)
      // console.log(userLanguage)
      res.send({
        nextWord: nextWord.original,
        totalScore: total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        answer: head.translation,
        isCorrect: isCorrect
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter

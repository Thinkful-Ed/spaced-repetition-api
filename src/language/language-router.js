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
      const userLanguage = req.language
      const head = await LanguageService.getWord(
        req.app.get('db'),
        userLanguage.head
      )
      // sends the total score and information on the current head
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
      // Verifys that guess in included in the request body and sends 400 if not. Set up to be expandable if needed
      for (const field of ['guess'])
        if (!req.body[field])
          return res.status(400).json({
            error: `Missing '${field}' in request body`
          })
      // initialize variables to modify during update algorithm
      let userLanguage = req.language
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

      // If incorrect we want the mem value to reset to one so we see it sooner. Otherwise we want to double it so it moves further down the line 
      if (head.translation.toLowerCase() != guess.toLowerCase()) {
        incorrect_count++
        memVal = 1        
      } else {
        isCorrect = true
        correct_count++
        total_score++
        memVal = memVal * 2
      }
      // Loops through the words to move the head forward a number of places equal to mem value
      for (let i = 0; i < memVal && currentWord.next != null; i++) {
        currentWord = await LanguageService.getWord(
          req.app.get('db'),
          currentWord.next
        )

      }
      // set the next value of the word before the new position of the answered question. This is one step of moving the head to a new position
      await LanguageService.updateWord(
        req.app.get('db'),
        currentWord.id,
        {
          next: head.id
        }
      )
      // Update the head values and point it forward m place. The is the second step in moving the position of the head
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
      // Updates the next word in line to be the new head when the head moves
      await LanguageService.updateHead(
        req.app.get('db'),
        userLanguage.id,
        nextWord.id
      )
      // Update the total score for the language
      await LanguageService.updateLanguage(
        req.app.get('db'),
        userLanguage.id,
        {
          total_score: total_score,
        }
      )

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

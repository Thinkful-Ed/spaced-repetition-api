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

    res.send({
      nextWord: head.original,
      totalScore: userLanguage.total_score,
      wordCorrectCount: head.correct_count ,
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

    for (const field of [ 'guess' ])
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
    // console.log('words list before', userWords)
    // console.log('head id before', userLanguage.head)
    // console.log('head before', head)
    if (head.translation != guess) {
      incorrect_count++
    }
    console.log(head)
    console.log(userLanguage)
    res.send({
      nextWord: nextWord.original,
      totalScore: userLanguage.total_score,
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
// const wordsList = new LinkedList()
    // for (let i = 0; i < userWords.length; i++) {
    //   wordsList.insertLast(userWords[i])
    // }
    // const currentNode = wordsList.head
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
    try {
      let userAnswer = req.body.guess
      let isCorrect

      if(!userAnswer) {
        return res.status(400).json({ error: `Missing 'guess' in request body` })
      }

      const head = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.head,
      )

      if(head.translation !== userAnswer) {
        isCorrect = false

        await LanguageService.updateMemoryValue(
          req.app.get('db'),
          head.id,
          (head.memory_value = 1)
        )

        await LanguageService.updateIncorrectScore(
          req.app.get('db'),
          head.id,
          (head.wordIncorrectCount += 1)
        )

        await LanguageService.updateHead(
          req.app.get('db'),
          head
        )

        let next = await LanguageService.nextWord(
          req.app.get('db'),
          head
        )

        let updateWord = await findMSpacesBack(
          req.app.get('db'), 
          head, 
          head.memory_value)

        await LanguageService.updateNextValue(
          req.app.get('db'), 
          head, 
          updateWord)

        let foundWordUpdate = await findMSpacesBack(
          req.app.get('db'), 
          head, 
          head.memory_value - 1)

        await LanguageService.updateNextValue(
          req.app.get('db'), 
          foundWordUpdate, 
          head)

        res.status(200).json({
          nextWord: next.original,
          totalScore: req.language.total_score,
          wordCorrectCount: head.wordCorrectCount,
          wordIncorrectCount: head.wordIncorrectCount,
          answer: head.translation,
          isCorrect: isCorrect
        })
      }

      if(head.translation === userAnswer) {
        isCorrect = true

        await LanguageService.updateMemoryValue(
          req.app.get('db'),
          head.id,
          (head.memory_value * 2)
        )
        await LanguageService.updateTotalScore(
          req.app.get('db'),
          req.language.id,
          (req.language.total_score += 1)
        )
        await LanguageService.updateCorrectScore(
          req.app.get('db'),
          head.id,
          (head.wordCorrectCount += 1)
        )
        await LanguageService.updateHead(
          req.app.get('db'),
          head
        )
        
        // added
        let next = await LanguageService.nextWord(
          req.app.get('db'),
          head
        )

        let updateWord = await findMSpacesBack(
          req.app.get('db'), 
          head, 
          head.memory_value)

        await LanguageService.updateNextValue(
          req.app.get('db'), 
          head, 
          updateWord)

        let foundWordUpdate = await findMSpacesBack(
          req.app.get('db'), 
          head, 
          head.memory_value - 1)

        await LanguageService.updateNextValue(
          req.app.get('db'), 
          foundWordUpdate, 
          head
          )

        res.status(200).json({
          nextWord: next.original,
          totalScore: req.language.total_score,
          wordCorrectCount: head.wordCorrectCount,
          wordIncorrectCount: head.wordIncorrectCount,
          answer: head.translation,
          isCorrect: isCorrect
        })
      }

    } catch(error) {
      next(error)
    }
  })

  async function findMSpacesBack(db, head, memory_value) {
    if(memory_value < 0 || head.next === null) {
      return head
    }
    let num = memory_value - 1;
    let nextWord = await LanguageService.nextWord(db, head)
    return await findMSpacesBack(db, nextWord, num)
  }

  // async function findMSpacesBack (db, head, memory_value) {
  //   if(memory_value < 0 || head.next === null) {
  //     return head
  //   }

  //   let start = memory_value - 1
  //   let nextWord = await LanguageService.nextWord(db, head)

  //   for(let i=0; i < start; start--) {

  //   }
  // }


module.exports = languageRouter


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


// languageRouter
//   .post('/guess', jsonBodyParser, async (req, res, next) => {
    // const correctAnswer = await LanguageService.getLanguageHead(
    //   req.app.get('db'),
    //   req.language.head,
    //  )

  //   try {
  //     let userAnswer = req.body.guess
  //     const correctAnswer = await LanguageService.getLanguageHead(
  //       req.app.get('db'),
  //       req.language.head,
  //      )
  //     console.log(userAnswer)

  //     if(!userAnswer) {
  //       return res.status(400).json({ error: `Missing 'guess' in request body` })
  //     }

  //     if(userAnswer !== correctAnswer.translation) {
  //       return res.status(200).json(correctAnswer)
  //     } else if(userAnswer === correctAnswer.translation) {
  //       LanguageService.updateCorrectWord(
  //         req.app.get('db'),
  //         correctAnswer.id,
  //         (correctAnswer.memory_value * 2)
  //       )

  //       return res.status(200).json(req.language.head)
  //     }

  //     res.status(204)
  //   } catch(error) {
  //     next(error)
  //   }
  // })

  languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      let userAnswer = req.body.guess

      if(!userAnswer) {
        return res.status(400).json({ error: `Missing 'guess' in request body` })
      }

      const head = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.head,
      )

      if(head.translation !== userAnswer) {
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
        res.json(head)
      }

      if(head.translation === userAnswer) {
        const correctWord = await LanguageService.updateMemoryValue(
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
        // insertWordAt(req.app.get('db'), head, head.memory_value)

        res.json(correctWord)
      }

    } catch(error) {
      next(error)
    }
  })

  // async function insertWordAt(db, item, memory_value) {
  //   try {
  //   if(memory_value === null || memory_value < 0) {
  //       return item
  //   }
  
  //   const head = await LanguageService.getLanguageHead(
  //     req.app.get('db'),
  //     req.language.head,
  //   )
  
  //   let currWord = head
  //   let prevWord = head
  //   let count = 0
  
  //   while(currWord.next !== null) {
  //       prevWord = currWord
  //       currWord = await LanguageService.nextWord(
  //         db,
  //         head
  //       )
  //       count++
  
  //       if(count === position) {
  //           prevWord.next = item
  //           item.next = currWord.next
  //           return
  //       }
  //   }
  // } catch(error) {
  //   console.log(error)
  // }
  // }
  
  // give item the value of currWord.next

module.exports = languageRouter


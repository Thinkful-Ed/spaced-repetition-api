const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  // getLanguageHead(db, word_id) { 
  //   return db 
  //   .from('language') 
  //   .innerJoin('word', 'language.head', 'word.id') 
  //   .select( 'word.original as nextWord', 
  //   'language.total_score as totalScore', 
  //   'word.correct_count as wordCorrectCount', 
  //   'word.incorrect_count as wordIncorrectCount',
  //   'word.translation as translation',
  //   'word.memory_value', 'word.next as nextWordIdValue', 'word.id') 
  //   .where('language.head', word_id) 
  //   .first() 
  // },

  getLanguageHead(db, word_id) { 
    return db 
    .from('language') 
    .innerJoin('word', 'language.head', 'word.id') 
    .select( 
      'word.original as nextWord', 
      'language.total_score as totalScore', 
      'word.correct_count as wordCorrectCount', 
      'word.incorrect_count as wordIncorrectCount',
      'word.translation',
      'word.next',
      'word.memory_value',
      'word.id'
    ) 
    .where('language.head', word_id) 
    .first() 
  },
  updateCorrectWord(db, word_id, doubled_value) {
    return db
      .from('word')
      .select('*')
      .update('memory_value', doubled_value)
      .where('id', word_id)
  }

  // updateCorrectWord(db, word_id, doubled_value) {
  //   return db
  //   .from('word')
  //   .update('memory_value', doubled_value)
  //   .where('word.id', word_id)
  // },

  // updateIncorrectWord(db, word_id, newValue, newNext, newCorrectCount) {
  //   return db
  //   .from('language') 
  //   .innerJoin('word', 'language.head', 'word.id')
  //   .update({
  //     next: newNext,
  //     memory_value: newValue,
  //     incorrect_count: newCorrectCount
  //   })
  //   .where('language.head', word_id)
  //   .first()
  // },
  // updateHead(db, word_id) {
  //   return db
  //   .from('language') 
  //   .innerJoin('word', 'language.head', 'word.id')
  //   .update('language.head', 'word.next')
  //   .where('language.head', word_id)
  // },
  // updateMemoryValue(db, )

}

module.exports = LanguageService

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
  updateMemoryValue(db, word_id, doubled_value) {
    return db
      .from('word')
      .select('*')
      .update('memory_value', doubled_value)
      .where('id', word_id)
  },
  updateTotalScore(db, language_id, newScore) {
    return db
    .from('language')
    .update('total_score', newScore)
    .where('id', language_id)
  },
  updateIncorrectScore(db, word_id, newValue) {
    return db
    .from('word')
    .update('incorrect_count', newValue)
    .where('id', word_id)
  },
  updateCorrectScore(db, word_id, newValue) {
    return db
    .from('word')
    .update('correct_count', newValue)
    .where('id', word_id)
  },
  updateHead(db, word) {
    return db
    .from('language') 
    .innerJoin('word', 'language.head', 'word.id')
    .update('head', word.next)
    .where('language.head', word.id)
  },
  nextWord(db, word) {
    return db
      .from('word')
      .select('*')
      .where('word.id', word.next)
      .first()  
  },

}

module.exports = LanguageService

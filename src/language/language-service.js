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
    .select( 'word.original as nextWord', 
    'language.total_score as totalScore', 
    'word.correct_count as wordCorrectCount', 
    'word.incorrect_count as wordIncorrectCount', ) 
    .where('language.head', word_id) 
    .first() 
  },

}

module.exports = LanguageService

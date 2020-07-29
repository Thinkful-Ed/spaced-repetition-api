const { head } = require("../app")

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
  updateHead(db, id, language_id) {
    return db
      .from('language')
      .where({ id: language_id })
      .update({ head: id })
  },
  // getFirstWord(db, language_id) {
  //   return db
  //     .from('word')
  //     .join('language', 'language.head', 'word.id')
  //     .where({ 'language.id': language_id })
  //     .select('*')
  //     .first()
  // },
  getWord(db, id) {
    return db
      .from('word')
      .select('*')
      .where({ id })
      .then(rows => {
        return rows[0];
      })
  },
  updateWord(db, id, newData) {
    return db('word')
      .where({ id })
      .update(newData)
  }
}

module.exports = LanguageService

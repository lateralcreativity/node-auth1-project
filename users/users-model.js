const db = require('../data/connection');

module.exports = {
    get,
    getById,
    getBy,
    add
}

function get() {
    return db('users').select('id', 'username').orderBy('id');
}

function getById(id) {
    return db('users')
    .where({ id: id })
    .first()
}

function getBy(filter) {
    return db('users')
    .where(filter)
    .orderBy('id')
} 

async function add(user) {
    try {
      const [id] = await db('users').insert(user, 'id');
  
      return getById(id);
    } catch (error) {
      throw error;
    }
  }
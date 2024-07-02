const argon2 = require('argon2');
const AbstractRepository = require("./AbstractRepository");

class UserRepository extends AbstractRepository {
  constructor() {
    super({ table: "user" });
  }

  async create(item) {
    const [result] = await this.database.query(
      "INSERT INTO user(email, username, password, is_admin) VALUES(?, ?, ?, 0)",
      [item.email, item.username, await argon2.hash(item.password)]
    );

    if(result.insertId){
      return true
    }
    return false;
  }

  async login(item) {
    const [result] = await this.database.query(
      "SELECT password FROM user WHERE username=?",
      [item.username]
    );

    if(result[0] && result[0].password){
      if(await argon2.verify(result[0].password, item.password)){
        return true
      }
    }

    return false
  }

  async getById(id) {
    const [result] = await this.database.query(
      "SELECT * FROM user WHERE id=?",
      [id]
    );

    return result;
  }
}

module.exports = UserRepository;

const collection = "products";

class Command {
  constructor(db) {
    this.db = db;
  }

  async insertOne(document) {
    return this.db.insertOne(document, collection);
  }

  async updateOne(parameter, document) {
    return this.db.updateOne(parameter, document, collection);
  }

  async deleteOne(parameter) {
    return this.db.deleteOne(parameter, collection);
  }
}

module.exports = Command;

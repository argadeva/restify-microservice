const collection = 'products';

class Query {

  constructor(db) {
    this.db = db;
  }

  async findOne(parameter, projection) {
    return this.db.findOne(parameter, projection, collection);
  }

  async findAll(projection, sort, page, limit) {
    return this.db.findAll(projection, sort, page, limit, collection);
  }
}

module.exports = Query;

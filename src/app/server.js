const restify = require('restify');
const cors = require('../utils/cors');
const project = require('../../package.json');
const redis = require('../database/redis/connection');
const postgres = require('../database/postgres/connection');
const routes = require('../routes');

class Server {
  constructor() {
    this.server = restify.createServer({ name: `${project.name}`, version: project.version });
    this.server.use(restify.plugins.acceptParser(this.server.acceptable));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());
    this.server.use(restify.plugins.authorizationParser());

    //CORS configuration
    this.server.pre(cors.preflight);
    this.server.use(cors.actual);

    routes(this.server);

    postgres.init();
    redis.init();
  }
}

module.exports = Server;

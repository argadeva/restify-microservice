const AppServer = require('../../src/app/server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('App', () => {
  let appServer = '';

  beforeEach(function () {
    appServer = new AppServer();
    this.server = appServer.server;
  });

  afterEach(function () {
    this.server.close();
  });

  it('server run', (done) => {
    chai.request(appServer.server)
      .get('/v1/products')
      .end((err, res) => {
        expect(res.status).to.equals(200);
        expect(err).to.equals(null);
        done();
      });
  });

});

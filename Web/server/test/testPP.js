const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); //c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');
//const { get } = require('cypress/types/lodash');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API PP", () => {
    mocha.it("user", (done) => {
        var agent = chai.request.agent(app.default)
        const log = {
            login : "CrooZ",
            password : "crooz"
        }
        const pp = {pp:3}
        agent
            .post('/api/user/login')
            .send(log)
            .then((res) => {
                return Promise.all([
                    agent
                        .post('/api/pp/user')
                        .send(pp)
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body.message, 3)
                        }),
                    agent
                        .get('/api/pp/get/CrooZ')
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body.pp, 3)
                        })
                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                agent.close()
            })
    })
})
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../api/index');
const User = require('../src/models/User');
const CryptoJS = require("crypto-js");

chai.use(chaiHttp);
const expect = chai.expect;

let mongoServer;

before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User API', () => {
    let testEmail = "testuser@example.com";
    beforeEach(async () => {
         if (process.env.NODE_ENV === 'test') {
             await User.deleteMany({ email: testEmail });
        }
    });


    it('should register a new user successfully', async () => {
        const res = await chai.request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: '123456',
        });
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('username', 'testuser');
        expect(res.body).to.have.property('email', 'testuser@example.com');


        // Kiểm tra password đã được mã hoá đúng
        const savedUser = await User.findOne({ email: 'testuser@example.com' });
        expect(savedUser).to.not.be.null;
        const decrypted = CryptoJS.AES.decrypt(savedUser.password, process.env.SECRET_KEY);
        const originalPassword = decrypted.toString(CryptoJS.enc.Utf8);
        expect(originalPassword).to.equal('123456');
    });

    it('should return 400 if missing fields', async () => {
        const res = await chai.request(app).post('/api/auth/register').send({
            email: 'missing@field.com',
            password: '123456',
            // thiếu 'name'
        });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('message', 'All fields are required');
    });

    it('should login successfully and return access token', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: '123456' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken');
                expect(res.body).to.have.property('email', 'testuser@example.com');
                expect(res.body).to.have.property('username', 'testuser');
                done();
            });
    });

    it('should return 404 with wrong password', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'wrongpassword' })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.equal("Wrong password or username!");
                done();
            });
    });

    it('should return 404 for non-existent user', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@example.com', password: '123456' })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.equal("Wrong password or username!");
                done();
            });
    });
    after(async () => {
        await User.deleteMany({ email: testEmail }); // Xóa tài khoản sau khi test xong
    });
});



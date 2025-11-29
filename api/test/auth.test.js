// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require('../../api/index'); // Thay bằng đường dẫn đến ứng dụng của bạn
// const User = require("../src/models/User");
// const should = chai.should();
//
// chai.use(chaiHttp);
//
// describe("Auth API", () => {
//     describe("POST /api/auth/register", () => {
//         it("should register a new user successfully", (done) => {
//             const user = {
//                 username: "testUser",
//                 email: "test@example.com",
//                 password: "testPassword"
//             };
//
//             chai.request(app)
//                 .post("/api/auth/register")
//                 .send(user)
//                 .end((err, res) => {
//                     res.should.have.status(201);
//                     res.body.should.have.property("_id");
//                     res.body.should.have.property("username").eql("testUser");
//                     res.body.should.have.property("email").eql("test@example.com");
//                     done();
//                 });
//         });
//
//         it("should return 400 if missing fields", (done) => {
//             const user = {
//                 email: "test@example.com",
//                 password: "testPassword"
//             };
//
//             chai.request(app)
//                 .post("/api/auth/register")
//                 .send(user)
//                 .end((err, res) => {
//                     res.should.have.status(400);
//                     res.body.should.have.property("message").eql("All fields are required");
//                     done();
//                 });
//         });
//     });
//
//     // Test đăng nhập
//     describe("POST /api/auth/login", () => {
//         it("should login successfully and return access token", (done) => {
//             const user = {
//                 email: "test@example.com",
//                 password: "testPassword"
//             };
//
//             chai.request(app)
//                 .post("/api/auth/login")
//                 .send(user)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.have.property("accessToken");
//                     res.body.should.have.property("username").eql("testUser");
//                     res.body.should.have.property("email").eql("test@example.com");
//                     done();
//                 });
//         });
//
//         it("should return 404 with wrong password", (done) => {
//             const user = {
//                 email: "test@example.com",
//                 password: "wrongPassword"
//             };
//
//             chai.request(app)
//                 .post("/api/auth/login")
//                 .send(user)
//                 .end((err, res) => {
//                     res.should.have.status(404);
//                     res.body.should.eql("Wrong password or username!");
//                     done();
//                 });
//         });
//
//         it("should return 404 for non-existent user", (done) => {
//             const user = {
//                 email: "nonexistent@example.com",
//                 password: "testPassword"
//             };
//
//             chai.request(app)
//                 .post("/api/auth/login")
//                 .send(user)
//                 .end((err, res) => {
//                     res.should.have.status(404);
//                     res.body.should.eql("Wrong password or username!");
//                     done();
//                 });
//         });
//     });
// });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require('../../api/index');
const mongoose = require("mongoose");
const User = require("../src/models/User");
const CryptoJS = require("crypto-js");
require("dotenv").config();
chai.use(chaiHttp);
const expect = chai.expect;

before(async () => {
    await mongoose.connect(process.env.MONGO_URL);

});

describe("Auth Controller", () => {
    // it("should register a new user", async () => {
    //     const res = await chai.request(app)
    //         .post("/api/auth/register")
    //         .send({ username: "testuser2005", email: "testuser2005@example.com", password: "123456" });
    //
    //     expect(res).to.have.status(201);
    //     expect(res.body).to.have.property("email", "testuser2005@example.com");
    // });
    it("should register a new user successfully", (done) => {
        const user = {
            username: "tttUser",
            email: "ttjjj@example.com",
            password: "testPassword"
        };

        chai.request(app)
            .post("/api/auth/register")
            .send(user)
            .end((err, res) => {
                expect(err).to.be.null; // Không có lỗi xảy ra
                expect(res).to.have.status(201); // Mã trạng thái 201
                expect(res.body).to.have.property("_id"); // Kiểm tra _id có tồn tại trong body
                expect(res.body).to.have.property("username").eql("tttUser"); // Kiểm tra username
                expect(res.body).to.have.property("email").eql("ttjjj@example.com"); // Kiểm tra email
                done();
            });
    });
    it("should fail register with missing fields", async () => {
        const res = await chai.request(app)
            .post("/api/auth/register")
            .send({ email: "missing@example.com" });

        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message", "All fields are required");
    });

    it("should login successfully", async () => {
        const res = await chai.request(app)
            .post("/api/auth/login")
            .send({ email: "testuser@example.com", password: "123456" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("accessToken");
        expect(res.body).to.have.property("email");
    });

    it("should fail login with wrong password", async () => {
        const res = await chai.request(app)
            .post("/api/auth/login")
            .send({ email: "testuser@example.com", password: "wrongpass" });

        expect(res).to.have.status(404);
    });

    it("should fail login with nonexistent user", async () => {
        const res = await chai.request(app)
            .post("/api/auth/login")
            .send({ email: "noone@example.com", password: "123456" });

        expect(res).to.have.status(404);
    });
});

after(async () => {

    await mongoose.disconnect();
});

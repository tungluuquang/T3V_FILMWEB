const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require('../../api/index');
const Movie = require("../src/models/Movie");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");
chai.use(chaiHttp);
const { expect } = chai;

describe("Movies API", () => {
    let adminToken;
    let userToken;

    // Tạo tài khoản admin và user để kiểm tra quyền
    before(async () => {
            mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

        // Tạo token admin
        const adminUser = await User.create({ username: 'admin',    email: 'admin@example.com',  // Thêm email
            password: 'password', isAdmin: true });
        adminToken = jwt.sign({ id: adminUser._id, isAdmin: adminUser.isAdmin }, process.env.SECRET_KEY);

        // Tạo token user
        const normalUser = await User.create({ username: 'user',  email: 'user@example.com',
            password: 'password', isAdmin: false });
        userToken = jwt.sign({ id: normalUser._id, isAdmin: normalUser.isAdmin }, process.env.SECRET_KEY);
    });

    after(async () => {
        await mongoose.connection.close();
    });

    // Test tạo movie - admin
    it("should create a new movie", async () => {
        const res = await chai
            .request(app)
            .post("/api/movies")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "New Movie",
                genre: "Action",
                year: 2023
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id");
    });

    // Test tạo movie - không phải admin
    it("should return 403 if user is not an admin", async () => {
        const res = await chai
            .request(app)
            .post("/api/movies")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "New Movie",
                genre: "Action",
                year: 2023
            });

        expect(res).to.have.status(403);
        expect(res.body).to.equal("You are not allowed to create movie!");
    });

    // Test cập nhật movie - admin
    it("should update a movie", async () => {
        const movie = new Movie({
            title: "Old Movie",
            genre: "Drama",
            year: 2021
        });
        await movie.save();

        const res = await chai
            .request(app)
            .put(`/api/movies/${movie._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Updated Movie",
                genre: "Action",
                year: 2023
            });

        expect(res).to.have.status(200);
        expect(res.body.title).to.equal("Updated Movie");
    });

    // Test xóa movie - admin
    it("should delete a movie", async () => {
        const movie = new Movie({
            title: "Movie to Delete",
            genre: "Comedy",
            year: 2022
        });
        await movie.save();

        const res = await chai
            .request(app)
            .delete(`/api/movies/${movie._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.equal("Delete movie successfully");
    });


    it("should get a random movie", async () => {
        const res = await chai
            .request(app)
            .get("/api/movies/random")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body.length).to.be.greaterThan(0);
    });

    it("should get top 10 movies", async () => {
        const res = await chai
            .request(app)
            .get("/api/movies/top")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf.at.most(10);
    });

    it("should get a movie by ID", async () => {
        const movie = new Movie({
            title: "Test Movie",
            genre: "Sci-Fi",
            year: 2023
        });
        await movie.save();

        const res = await chai
            .request(app)
            .get(`/api/movies/${movie._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res).to.have.status(200);
        expect(res.body.title).to.equal("Test Movie");
    });
});


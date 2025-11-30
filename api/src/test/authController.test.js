const AuthController = require('../controller/auth.controller');
const User = require('../models/User');
const axios = require('axios');
const CryptoJS = require('crypto-js');

// --- MOCKING DEPENDENCIES ---
jest.mock('../models/User');
jest.mock('axios');

process.env.SECRET_KEY = "test_secret_key";

describe('AuthController Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // ==========================================
    // TESTING REGISTER (ĐĂNG KÝ)
    // ==========================================
    describe('Register Function', () => {

        // TC_REG_01: Happy Path (Thành công)
        it('should register a user successfully (Status 201)', async () => {
            req.body = { username: "user1", email: "u1@test.com", password: "123456" };

            // Giả lập User.save() thành công
            const mockSave = jest.fn().mockResolvedValue(req.body);
            User.mockImplementation(() => ({ save: mockSave }));

            // Giả lập Axios gọi thành công
            axios.post.mockResolvedValue({ data: "ok" });

            await AuthController.Register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalled(); // Kiểm tra xem có gọi Recommender service không
        });

        // TC_REG_02: Thiếu Username (Rỗng - BVA/EP)
        it('should return 400 if username is missing', async () => {
            req.body = { username: "", email: "u1@test.com", password: "123456" };
            await AuthController.Register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "All fields are required" });
        });

        // TC_REG_04: Thiếu Email (Null/Undefined - EP)
        it('should return 400 if email is missing', async () => {
            req.body = { username: "user1", password: "123456" }; // Không có email
            await AuthController.Register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        // TC_REG_06: DB Error (Ví dụ: Trùng email)
        it('should return 500 if database throws an error', async () => {
            req.body = { username: "user1", email: "u1@test.com", password: "123456" };

            // Giả lập lỗi khi save
            const mockSave = jest.fn().mockRejectedValue(new Error("Duplicate Key Error"));
            User.mockImplementation(() => ({ save: mockSave }));

            await AuthController.Register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });

        // TC_REG_07: Recommender Service lỗi nhưng vẫn tạo User thành công
        it('should return 201 even if Recommender service fails', async () => {
            req.body = { username: "user1", email: "u1@test.com", password: "123456" };

            const mockSave = jest.fn().mockResolvedValue(req.body);
            User.mockImplementation(() => ({ save: mockSave }));

            // Giả lập Axios bị lỗi
            axios.post.mockRejectedValue(new Error("Service Down"));

            // Spy console.log để đảm bảo lỗi được log ra (optional)
            const logSpy = jest.spyOn(console, 'log');

            await AuthController.Register(req, res);

            expect(axios.post).toHaveBeenCalled();
            expect(logSpy).toHaveBeenCalledWith("Cannot Populate Recommender service data");
            expect(res.status).toHaveBeenCalledWith(201); // Vẫn phải trả về thành công
        });
    });

    // ==========================================
    // TESTING LOGIN (ĐĂNG NHẬP)
    // ==========================================
    describe('Login Function', () => {

        // TC_LOG_01: Đăng nhập thành công
        it('should login successfully with correct credentials (Status 200)', async () => {
            req.body = { email: "u1@test.com", password: "123456" };

            // Cần tạo password đã mã hóa giống logic trong DB
            const encryptedPass = CryptoJS.AES.encrypt("123456", process.env.SECRET_KEY).toString();

            const mockUser = {
                _id: "123",
                isAdmin: false,
                email: "u1@test.com",
                password: encryptedPass,
                _doc: { username: "user1", email: "u1@test.com", password: encryptedPass }
            };

            // Giả lập tìm thấy user trong DB
            User.findOne.mockResolvedValue(mockUser);

            await AuthController.Login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            // Kiểm tra kết quả trả về có accessToken không
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                username: "user1",
                accessToken: expect.any(String)
            }));
        });

        // TC_LOG_02: Email không tồn tại
        it('should return 404 if user is not found', async () => {
            req.body = { email: "wrong@test.com", password: "123456" };

            // Giả lập không tìm thấy user
            User.findOne.mockResolvedValue(null);

            await AuthController.Login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith("Wrong password or username!");
        });

        // TC_LOG_03: Sai Password
        it('should return 404 if password is wrong', async () => {
            req.body = { email: "u1@test.com", password: "wrongpassword" };

            // Password gốc trong DB là "123456"
            const encryptedPass = CryptoJS.AES.encrypt("123456", process.env.SECRET_KEY).toString();
            const mockUser = {
                email: "u1@test.com",
                password: encryptedPass
            };

            User.findOne.mockResolvedValue(mockUser);

            await AuthController.Login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith("Wrong password or username!");
        });

        // TC_LOG_05: Lỗi Server/DB
        it('should return 500 if database fails', async () => {
            req.body = { email: "u1@test.com", password: "123" };
            User.findOne.mockRejectedValue(new Error("DB Connection Failed"));

            await AuthController.Login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
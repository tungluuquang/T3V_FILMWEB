const UsersController = require('../controller/users.controller');
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const axios = require('axios');

jest.mock('../models/User');
jest.mock('axios');
jest.mock('crypto-js', () => ({
    AES: {
        encrypt: jest.fn().mockReturnValue({ toString: () => "encrypted_pass" })
    }
}));

describe('UsersController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: {},
            params: {},
            body: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('Update', () => {
        // TC_UPD_01
        it('should allow user to update their own account', async () => {
            req.user.id = "123";
            req.params.id = "123";
            req.body = { username: "new_name" };

            User.findByIdAndUpdate.mockResolvedValue(req.body);

            await UsersController.Update(req, res);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", { $set: req.body }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_UPD_02
        it('should allow admin to update any account', async () => {
            req.user.id = "admin_id";
            req.user.isAdmin = true;
            req.params.id = "other_user_id";

            User.findByIdAndUpdate.mockResolvedValue({});

            await UsersController.Update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_UPD_03
        it('should return 403 if user tries to update another account', async () => {
            req.user.id = "user1";
            req.user.isAdmin = false;
            req.params.id = "user2";

            await UsersController.Update(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith("You can update only your account!");
        });

        // TC_UPD_04
        it('should encrypt password if provided in body', async () => {
            req.user.id = "123";
            req.params.id = "123";
            req.body = { password: "raw_password" };

            User.findByIdAndUpdate.mockResolvedValue({});

            await UsersController.Update(req, res);

            expect(CryptoJS.AES.encrypt).toHaveBeenCalled();
            expect(req.body.password).toBe("encrypted_pass");
            expect(User.findByIdAndUpdate).toHaveBeenCalledWith("123", { $set: req.body }, { new: true });
        });

        // TC_UPD_05
        it('should return 200 even if axios fails', async () => {
            req.user.id = "123";
            req.params.id = "123";
            User.findByIdAndUpdate.mockResolvedValue({});

            axios.post.mockRejectedValue(new Error("Service Down"));

            await UsersController.Update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_UPD_06
        it('should return 500 on DB error', async () => {
            req.user.id = "123";
            req.params.id = "123";
            User.findByIdAndUpdate.mockRejectedValue(new Error("DB Error"));

            await UsersController.Update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('Delete', () => {
        // TC_DEL_01
        it('should allow user to delete their own account', async () => {
            req.user.id = "123";
            req.params.id = "123";
            User.findByIdAndDelete.mockResolvedValue({});

            await UsersController.Delete(req, res);

            expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("User has been deleted...");
        });

        // TC_DEL_02
        it('should allow admin to delete any account', async () => {
            req.user.isAdmin = true;
            req.params.id = "other_id";
            User.findByIdAndDelete.mockResolvedValue({});

            await UsersController.Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_DEL_03
        it('should return 403 if unauthorized', async () => {
            req.user.id = "123";
            req.user.isAdmin = false;
            req.params.id = "456";

            await UsersController.Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        // TC_DEL_04
        it('should return 500 on DB error', async () => {
            req.user.id = "123";
            req.params.id = "123";
            User.findByIdAndDelete.mockRejectedValue(new Error("DB Error"));

            await UsersController.Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('GetById', () => {
        // TC_GET_01
        it('should return user info without password', async () => {
            req.params.id = "123";
            const mockUser = {
                _doc: { username: "test", password: "secret_pass", email: "e@e.com" }
            };
            User.findById.mockResolvedValue(mockUser);

            await UsersController.GetById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ username: "test", email: "e@e.com" });
        });

        // TC_GET_02
        it('should return 500 if user is null (crash case)', async () => {
            req.params.id = "unknown";
            User.findById.mockResolvedValue(null);

            await UsersController.GetById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });

        // TC_GET_03
        it('should return 500 on DB error', async () => {
            req.params.id = "123";
            User.findById.mockRejectedValue(new Error("DB Error"));
            await UsersController.GetById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('GetAll', () => {
        // TC_ALL_01
        it('should return top 5 new users if query "new" is true', async () => {
            req.user.isAdmin = true;
            req.query.new = "true";

            const mockChain = {
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(["u1", "u2"])
            };
            User.find.mockReturnValue(mockChain);

            await UsersController.GetAll(req, res);

            expect(mockChain.sort).toHaveBeenCalledWith({ _id: -1 });
            expect(mockChain.limit).toHaveBeenCalledWith(5);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_ALL_02
        it('should return all users if no query param', async () => {
            req.user.isAdmin = true;
            User.find.mockResolvedValue(["u1", "u2", "u3"]);

            await UsersController.GetAll(req, res);

            expect(User.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_ALL_03
        it('should return 403 if not admin', async () => {
            req.user.isAdmin = false;
            await UsersController.GetAll(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('GetStats', () => {
        // TC_STA_01
        it('should return stats data', async () => {
            const mockData = [{ _id: 1, total: 5 }];
            User.aggregate.mockResolvedValue(mockData);

            await UsersController.GetStats(req, res);

            expect(User.aggregate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        // TC_STA_02
        it('should return 500 on aggregate error', async () => {
            User.aggregate.mockRejectedValue(new Error("DB Error"));
            await UsersController.GetStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
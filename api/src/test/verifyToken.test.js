const verify = require('../middleware/verifyToken');
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe('Verify Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.SECRET_KEY = "test_secret";
        jest.clearAllMocks();
    });

    // TC_VER_01
    it('should return 401 if auth header is missing', () => {
        req.headers = {};

        verify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith("You are not authenticated");
        expect(next).not.toHaveBeenCalled();
    });

    // TC_VER_02
    it('should call next() and set req.user if token is valid', () => {
        req.headers.token = "Bearer valid_token";
        const mockUser = { id: 1, isAdmin: false };

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockUser);
        });

        verify(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test_secret", expect.any(Function));
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });

    // TC_VER_03
    it('should return 403 if token is invalid', () => {
        req.headers.token = "Bearer invalid_token";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error("Invalid token"), null);
        });

        verify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith("Token is invalid");
        expect(next).not.toHaveBeenCalled();
    });

    // TC_VER_04
    it('should return 403 if header format is incorrect (no space)', () => {
        req.headers.token = "NoBearerToken";

        jwt.verify.mockImplementation((token, secret, callback) => {
            if (!token) callback(new Error("Token undefined"), null);
        });

        verify(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});
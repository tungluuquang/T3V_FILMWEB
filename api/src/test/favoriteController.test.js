const FavoriteController = require('../controller/favorite.controller');
const User = require('../models/User');

jest.mock('../models/User');

describe('FavoriteController', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('Get', () => {
        // TC_GET_01
        it('should return favorites list when user exists', async () => {
            req.params.id = "user_valid";
            const mockFavorites = ["m1", "m2"];
            User.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue({ favorites: mockFavorites })
            });

            await FavoriteController.Get(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockFavorites);
        });

        // TC_GET_02
        it('should return 404 when user not found', async () => {
            req.params.id = "user_invalid";
            User.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            await FavoriteController.Get(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ "Error": "User not found" });
        });

        // TC_GET_03
        it('should return 500 on database error', async () => {
            req.params.id = "user_error";
            User.findById.mockImplementation(() => { throw new Error("DB Error") });

            await FavoriteController.Get(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('Toggle', () => {
        // TC_TOG_01
        it('should add movie if not in favorites', async () => {
            req.params.id = "u1";
            req.body.movieId = "new_movie";

            User.findById.mockResolvedValue({
                favorites: ["old_movie"]
            });

            const updatedUser = { favorites: ["old_movie", "new_movie"] };
            User.findByIdAndUpdate.mockResolvedValue(updatedUser);

            await FavoriteController.Toggle(req, res);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                "u1",
                { $addToSet: { favorites: "new_movie" } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        // TC_TOG_02
        it('should remove movie if already in favorites', async () => {
            req.params.id = "u1";
            req.body.movieId = "existing_movie";

            User.findById.mockResolvedValue({
                favorites: ["existing_movie", "other_movie"]
            });

            const updatedUser = { favorites: ["other_movie"] };
            User.findByIdAndUpdate.mockResolvedValue(updatedUser);

            await FavoriteController.Toggle(req, res);

            expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
                "u1",
                { $pull: { favorites: "existing_movie" } },
                { new: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        // TC_TOG_03
        it('should return 500 if user not found (crash handling)', async () => {
            req.params.id = "u_null";
            req.body.movieId = "m1";

            User.findById.mockResolvedValue(null);

            await FavoriteController.Toggle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });

        // TC_TOG_04
        it('should return 500 on update error', async () => {
            req.params.id = "u1";
            req.body.movieId = "m1";

            User.findById.mockRejectedValue(new Error("DB Connection Error"));

            await FavoriteController.Toggle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
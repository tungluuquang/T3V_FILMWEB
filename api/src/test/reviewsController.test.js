const ReviewsController = require('../controller/reviews.controller');
const Movie = require('../models/Movie');

jest.mock('../models/Movie');

describe('ReviewsController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('Create', () => {
        // TC_REV_01
        it('should create a new review successfully', async () => {
            req.params.id = "movie123";
            req.body = { user: "user1", rating: 5, text: "Great" };

            const mockUpdatedMovie = {
                _id: "movie123",
                reviews: [req.body]
            };

            Movie.findByIdAndUpdate
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce(mockUpdatedMovie);

            await ReviewsController.Create(req, res);

            expect(Movie.findByIdAndUpdate).toHaveBeenNthCalledWith(1,
                "movie123",
                { $pull: { reviews: { user: "user1" } } }
            );
            expect(Movie.findByIdAndUpdate).toHaveBeenNthCalledWith(2,
                "movie123",
                { $push: { reviews: req.body } },
                { new: true, runValidators: true }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedMovie);
        });

        // TC_REV_02
        it('should update existing review (pull then push)', async () => {
            req.params.id = "movie123";
            req.body = { user: "user1", rating: 4 };

            Movie.findByIdAndUpdate
                .mockResolvedValueOnce({})
                .mockResolvedValueOnce({ _id: "movie123", reviews: [req.body] });

            await ReviewsController.Create(req, res);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_REV_03
        it('should return null (200 OK) if movie ID not found', async () => {
            req.params.id = "nonexistent_id";
            req.body = { user: "user1" };

            Movie.findByIdAndUpdate.mockResolvedValue(null);

            await ReviewsController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(null);
        });

        // TC_REV_04
        it('should return 500 if validation fails', async () => {
            req.params.id = "movie123";
            req.body = { user: "user1" };

            Movie.findByIdAndUpdate
                .mockResolvedValueOnce({})
                .mockRejectedValueOnce(new Error("Validation Error"));

            await ReviewsController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.any(Error));
        });

        // TC_REV_05
        it('should return 500 on database connection error', async () => {
            req.params.id = "movie123";

            Movie.findByIdAndUpdate.mockRejectedValue(new Error("DB Error"));

            await ReviewsController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});
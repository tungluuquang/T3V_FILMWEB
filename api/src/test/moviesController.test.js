const MoviesController = require('../controller/movies.controller');
const Movie = require('../models/Movie');

jest.mock('../models/Movie');

describe('MoviesController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: {},
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('Create', () => {
        // TC_CRT_01
        it('should create movie if user is admin', async () => {
            req.user.isAdmin = true;
            req.body = { title: "New Movie" };

            Movie.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(req.body)
            }));

            await MoviesController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        // TC_CRT_02
        it('should return 403 if user is not admin', async () => {
            req.user.isAdmin = false;
            await MoviesController.Create(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        // TC_ERR_01 (Sample for Create)
        it('should return 500 on DB error', async () => {
            req.user.isAdmin = true;
            Movie.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error("DB Error"))
            }));
            await MoviesController.Create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('Update', () => {
        // TC_UPD_01
        it('should update movie if user is admin', async () => {
            req.user.isAdmin = true;
            req.params.id = "123";
            req.body = { title: "Updated" };

            Movie.findByIdAndUpdate.mockResolvedValue(req.body);

            await MoviesController.Update(req, res);

            expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith("123", { $set: req.body }, { new: true });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_UPD_02
        it('should return 403 if user is not admin', async () => {
            req.user.isAdmin = false;
            await MoviesController.Update(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('Delete', () => {
        // TC_DEL_01
        it('should delete movie if user is admin', async () => {
            req.user.isAdmin = true;
            req.params.id = "123";
            Movie.findByIdAndDelete.mockResolvedValue({});

            await MoviesController.Delete(req, res);

            expect(Movie.findByIdAndDelete).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_DEL_02
        it('should return 403 if user is not admin', async () => {
            req.user.isAdmin = false;
            await MoviesController.Delete(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('GetRandom', () => {
        // TC_RND_01
        it('should get random series', async () => {
            req.query.type = 'series';
            Movie.aggregate.mockResolvedValue([]);

            await MoviesController.GetRandom(req, res);

            expect(Movie.aggregate).toHaveBeenCalledWith([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_RND_02
        it('should get random movie', async () => {
            req.query.type = 'movie';
            Movie.aggregate.mockResolvedValue([]);

            await MoviesController.GetRandom(req, res);

            expect(Movie.aggregate).toHaveBeenCalledWith([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_RND_03
        it('should get random content (default)', async () => {
            req.query.type = undefined;
            Movie.aggregate.mockResolvedValue([]);

            await MoviesController.GetRandom(req, res);

            expect(Movie.aggregate).toHaveBeenCalledWith([
                { $sample: { size: 1 } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('GetTop', () => {
        // TC_TOP_01
        it('should get top movies', async () => {
            Movie.aggregate.mockResolvedValue([]);
            await MoviesController.GetTop(req, res);

            expect(Movie.aggregate).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ $sort: { avgRating: -1 } }),
                expect.objectContaining({ $limit: 10 })
            ]));
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('GetStats', () => {
        // TC_STA_01
        it('should get stats', async () => {
            Movie.aggregate.mockResolvedValue([]);
            await MoviesController.GetStats(req, res);

            expect(Movie.aggregate).toHaveBeenCalledWith([
                { $group: { _id: '$genre', total: { $sum: 1 } } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('GetById', () => {
        // TC_ID_01
        it('should get movie by id and populate reviews', async () => {
            req.params.id = "123";
            const mockMovie = { title: "Test" };

            Movie.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockMovie)
            });

            await MoviesController.GetById(req, res);

            expect(Movie.findById).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMovie);
        });
    });

    describe('GetAll', () => {
        let mockQuery;

        beforeEach(() => {
            mockQuery = {
                sort: jest.fn().mockReturnThis(),
                populate: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                then: function(resolve) { resolve([]); }
            };
            Movie.find.mockReturnValue(mockQuery);
        });

        // TC_ALL_01
        it('should get all movies with no filters', async () => {
            await MoviesController.GetAll(req, res);

            expect(Movie.find).toHaveBeenCalledWith({});
            expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(mockQuery.populate).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });

        // TC_ALL_02
        it('should apply filters (genre, title, year)', async () => {
            req.query = { genre: "Action", title: "Man", year: "2023" };

            await MoviesController.GetAll(req, res);

            expect(Movie.find).toHaveBeenCalledWith({
                genre: "Action",
                title: { $regex: "Man", $options: "i" },
                year: "2023"
            });
        });

        // TC_ALL_03
        it('should apply limit if provided and valid', async () => {
            req.query.limit = "5";

            await MoviesController.GetAll(req, res);

            expect(mockQuery.limit).toHaveBeenCalledWith(5);
        });

        // TC_ALL_04
        it('should NOT apply limit if invalid (NaN)', async () => {
            req.query.limit = "invalid";

            await MoviesController.GetAll(req, res);

            expect(mockQuery.limit).not.toHaveBeenCalled();
        });
    });
});
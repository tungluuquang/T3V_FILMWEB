const ListController = require('../controller/list.controller');
const List = require('../models/List');

jest.mock('../models/List');

describe('ListController', () => {
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
        it('should create a new list if user is admin', async () => {
            req.user.isAdmin = true;
            req.body = { title: "New List" };

            const mockSavedList = { _id: "1", title: "New List" };
            List.mockImplementation(() => ({
                save: jest.fn().mockResolvedValue(mockSavedList)
            }));

            await ListController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSavedList);
        });

        // TC_CRT_02
        it('should return 403 if user is not admin', async () => {
            req.user.isAdmin = false;

            await ListController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith("You are not allowed to create list!");
        });

        // TC_CRT_03
        it('should return 500 on database save error', async () => {
            req.user.isAdmin = true;
            List.mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(new Error("DB Error"))
            }));

            await ListController.Create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('Delete', () => {
        // TC_DEL_01
        it('should delete list if user is admin', async () => {
            req.user.isAdmin = true;
            req.params.id = "list_id";
            List.findByIdAndDelete.mockResolvedValue({});

            await ListController.Delete(req, res);

            expect(List.findByIdAndDelete).toHaveBeenCalledWith("list_id");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith("Delete list successfully");
        });

        // TC_DEL_02
        it('should return 403 if user is not admin', async () => {
            req.user.isAdmin = false;

            await ListController.Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith("You are not allowed to delete list!");
        });

        // TC_DEL_03
        it('should return 500 on database delete error', async () => {
            req.user.isAdmin = true;
            req.params.id = "list_id";
            List.findByIdAndDelete.mockRejectedValue(new Error("DB Error"));

            await ListController.Delete(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('Get', () => {
        // TC_GET_01
        it('should filter by type and genre when both provided', async () => {
            req.query.type = "movie";
            req.query.genre = "action";
            const mockResult = [{ title: "Action Movie" }];
            List.aggregate.mockResolvedValue(mockResult);

            await ListController.Get(req, res);

            expect(List.aggregate).toHaveBeenCalledWith([
                { $sample: { size: 10 } },
                { $match: { type: "movie", genre: "action" } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_GET_02
        it('should filter only by type when genre is missing', async () => {
            req.query.type = "series";
            // req.query.genre is undefined
            const mockResult = [{ title: "Series" }];
            List.aggregate.mockResolvedValue(mockResult);

            await ListController.Get(req, res);

            expect(List.aggregate).toHaveBeenCalledWith([
                { $sample: { size: 10 } },
                { $match: { type: "series" } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_GET_03
        it('should return random sample when type is missing', async () => {
            // req.query.type is undefined
            const mockResult = [{ title: "Random" }];
            List.aggregate.mockResolvedValue(mockResult);

            await ListController.Get(req, res);

            expect(List.aggregate).toHaveBeenCalledWith([
                { $sample: { size: 10 } }
            ]);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        // TC_GET_04
        it('should return 500 on aggregate error', async () => {
            List.aggregate.mockRejectedValue(new Error("Aggregate Error"));

            await ListController.Get(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
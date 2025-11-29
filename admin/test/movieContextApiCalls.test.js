import * as chai from "chai";
const expect = chai.expect;
import chaiHttp from "chai-http";
//import app from '../../api/index';
import sinon from "sinon";
import {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie
} from "../src/context/movieContext/apiCalls.js";
import axios from "axios";

chai.should();
chai.use(chaiHttp);

// Giả lập localStorage
const mockToken = "mockedaccesstoken";
global.localStorage = {
    getItem: (key) => JSON.stringify({ accessToken: mockToken })
};

describe("Movie Actions API", () => {
    let dispatch;

    beforeEach(() => {
        dispatch = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("getMovies", () => {
        it("should dispatch getMoviesSuccess on success", async () => {
            const mockData = [{ title: "Movie 1" }];
            sinon.stub(axios, "get").resolves({ data: mockData });

            await getMovies(dispatch);
            expect(dispatch.calledWithMatch({ type: "GET_MOVIES_START" })).to.be.true;
            expect(dispatch.calledWithMatch({ type: "GET_MOVIES_SUCCESS", payload: mockData })).to.be.true;
        });

        it("should dispatch getMoviesFailure on error", async () => {
            sinon.stub(axios, "get").rejects();

            await getMovies(dispatch);

            expect(dispatch.calledWithMatch({ type: "GET_MOVIES_FAILURE" })).to.be.true;
        });
    });

    describe("createMovie", () => {
        it("should dispatch createMovieSuccess on success", async () => {
            const movie = { title: "New Movie" };
            sinon.stub(axios, "post").resolves({ data: movie });

            await createMovie(movie, dispatch);

            expect(dispatch.calledWithMatch({ type: "CREATE_MOVIE_START" })).to.be.true;
            expect(dispatch.calledWithMatch({ type: "CREATE_MOVIE_SUCCESS", payload: movie })).to.be.true;
        });

        it("should dispatch createMovieFailure on error", async () => {
            sinon.stub(axios, "post").rejects();

            await createMovie({}, dispatch);

            expect(dispatch.calledWithMatch({ type: "CREATE_MOVIE_FAILURE" })).to.be.true;
        });
    });

    describe("updateMovie", () => {
        it("should dispatch updateMovieSuccess on success", async () => {
            const movie = { _id: "1", title: "Updated Movie" };
            sinon.stub(axios, "put").resolves({ data: movie });

            await updateMovie(movie, dispatch);

            expect(dispatch.calledWithMatch({ type: "UPDATE_MOVIE_START" })).to.be.true;
            expect(dispatch.calledWithMatch({ type: "UPDATE_MOVIE_SUCCESS", payload: movie })).to.be.true;
        });

        it("should dispatch updateMovieFailure on error", async () => {
            const movie = { _id: "1" };
            sinon.stub(axios, "put").rejects();

            await updateMovie(movie, dispatch);

            expect(dispatch.calledWithMatch({ type: "UPDATE_MOVIE_FAILURE" })).to.be.true;
        });
    });

    describe("deleteMovie", () => {
        it("should dispatch deleteMovieSuccess on success", async () => {
            sinon.stub(axios, "delete").resolves();

            await deleteMovie("1", dispatch);

            expect(dispatch.calledWithMatch({ type: "DELETE_MOVIE_START" })).to.be.true;
            expect(dispatch.calledWithMatch({ type: "DELETE_MOVIE_SUCCESS", payload: "1" })).to.be.true;
        });

        it("should dispatch deleteMovieFailure on error", async () => {
            sinon.stub(axios, "delete").rejects();

            await deleteMovie("1", dispatch);

            expect(dispatch.calledWithMatch({ type: "DELETE_MOVIE_FAILURE" })).to.be.true;
        });
    });
});
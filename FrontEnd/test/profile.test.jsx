import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../src/pages/profile/Profile";
import { AuthContext } from "../src/authContext/AuthContext";
import axios from "axios";
import sinon from "sinon";
import { expect } from "chai";

const mockUser = {
    _id: "123",
    username: "testuser",
    email: "test@example.com",
    profilePic: "http://example.com/image.jpg",
    accessToken: "mockedaccesstoken",
    gender: "male",
    age: 25,
    favoriteGenre: "action"
};

describe("Profile Component", () => {
    let putStub;

    beforeEach(() => {
        putStub = sinon.stub(axios, "put").resolves({ data: mockUser });
        global.localStorage = {
            getItem: (key) => JSON.stringify({ accessToken: mockUser.accessToken }),
            setItem: sinon.spy(),
        };
    });

    afterEach(() => {
        putStub.restore();
    });

    it("renders profile form with user data", () => {
        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Profile />
            </AuthContext.Provider>
        );

        expect(screen.getByDisplayValue("testuser")).to.exist;
        expect(screen.getByDisplayValue("test@example.com")).to.exist;
    });

    it("updates user info and submits", async () => {
        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <Profile />
            </AuthContext.Provider>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        fireEvent.change(usernameInput, { target: { value: "newname" } });

        const submitButton = screen.getByText(/submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(putStub.calledOnce).to.be.true;
            expect(putStub.firstCall.args[1].username).to.equal("newname");
        });
    });
});

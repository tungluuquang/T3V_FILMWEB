import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../src/pages/register/Register";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock Typical to prevent animation issues in test
vi.mock("react-typical", () => ({
    default: ({ steps }) => <span>{steps[0]}</span>
}));

describe("Register Component", () => {
    let postStub;

    beforeEach(() => {
        postStub = vi.spyOn(axios, "post").mockResolvedValue({ data: {} });
    });

    afterEach(() => {
        postStub.mockRestore();
    });

    it("shows email input initially and switches to password/username form", () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText("Email address");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        const getStartedBtn = screen.getByText("Get Started");
        fireEvent.click(getStartedBtn);

        expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    });

    it("submits the form with user data", async () => {
        render(
            <BrowserRouter>
                <Register />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Email address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.click(screen.getByText("Get Started"));

        fireEvent.change(screen.getByPlaceholderText("username"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByPlaceholderText("password"), {
            target: { value: "123456" },
        });
        fireEvent.click(screen.getByText("Start"));

        await waitFor(() => {
            expect(postStub).toHaveBeenCalledOnce();
            expect(postStub).toHaveBeenCalledWith("/api/auth/register", {
                email: "test@example.com",
                username: "testuser",
                password: "123456",
            });
        });
    });
});

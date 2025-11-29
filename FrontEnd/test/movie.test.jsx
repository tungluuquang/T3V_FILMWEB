// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import Movie from "../src/pages/movie/Movie";
// import { BrowserRouter } from "react-router-dom";
// import { vi } from "vitest";
// import axios from "axios";
// import { AuthContext } from "../src/authContext/AuthContext";
// import { act } from 'react-dom/test-utils';
// global.scrollTo = vi.fn();
// // Mock các icon từ MUI
// vi.mock("@mui/icons-material", () => ({
//     FavoriteBorder: () => <div>FavoriteBorder Icon</div>,
//     Favorite: () => <div>Favorite Icon</div>,
//     PlayArrow: () => <div>PlayArrow Icon</div>,
//     Add: () => <div>Add Icon</div>,
//     Share: () => <div>Share Icon</div>,
//     Stars: () => <div>Stars Icon</div>,
//     Comment: () => <div>Comment Icon</div>,
//     Notes: () => <div>Notes Icon</div>,
// }));
//
// // Mock axios
// vi.mock("axios", () => ({
//     default: {
//         get: vi.fn(),
//         put: vi.fn(),
//     },
// }));
//
// describe("Movie Component", () => {
//     const mockUser = {
//         _id: "123",
//         favorites: ["1"],
//         accessToken: "mockAccessToken",
//     };
//
//     const mockMovie = {
//         _id: "1",
//         title: "Test Movie",
//         genre: "Action",
//         year: "2022",
//         img: "testImage.jpg",
//         imgSm: "testImageSmall.jpg",
//         limit: "18",
//         desc: "Test movie description",
//         duration: "120 mins",
//         episodes: [{ id: "1", title: "Episode 1" }],
//         reviews: [
//             {
//                 user: { username: "user1", profilePic: "testPic.jpg" },
//                 comment: "Great movie!",
//                 rating: 4,
//                 createdAt: "2022-10-10T10:00:00Z",
//             },
//         ],
//     };
//
//     // Mock AuthContext Provider để cung cấp thông tin người dùng
//     const renderWithAuthContext = (ui) => {
//         return render(
//             <AuthContext.Provider value={{ user: mockUser }}>
//                 {ui}
//             </AuthContext.Provider>
//         );
//     };
//
//     it("should render movie details correctly", async () => {
//         axios.get.mockResolvedValueOnce({ data: mockMovie });
//
//         renderWithAuthContext(
//             <BrowserRouter>
//                 <Movie />
//             </BrowserRouter>
//         );
//
//         // Kiểm tra xem các chi tiết phim có hiển thị không
//         expect(screen.getByText("Test Movie")).toBeInTheDocument();
//         expect(screen.getByText("Action")).toBeInTheDocument();
//         expect(screen.getByText("2022")).toBeInTheDocument();
//         expect(screen.getByText("Test movie description")).toBeInTheDocument();
//         expect(screen.getByText("Duration: 120 mins")).toBeInTheDocument();
//     });
//
//     it("should toggle favorite status", async () => {
//         axios.get.mockResolvedValueOnce({ data: mockMovie });
//         axios.put.mockResolvedValueOnce({ data: { ...mockUser, favorites: [] } });
//
//         renderWithAuthContext(
//             <BrowserRouter>
//                 <Movie />
//             </BrowserRouter>
//         );
//
//         const favoriteButton = screen.getByText("FavoriteBorder Icon");
//         act(() => {
//             // Thực hiện hành động thay đổi trạng thái, ví dụ:
//             fireEvent.click(favoriteButton);
//         });
//
//         await waitFor(() => {
//             expect(axios.put).toHaveBeenCalled();
//             expect(screen.getByText("Favorite Icon")).toBeInTheDocument();
//         });
//     });
//
//     it("should open review panel and submit review", async () => {
//         axios.get.mockResolvedValueOnce({ data: mockMovie });
//         axios.put.mockResolvedValueOnce({ data: mockMovie });
//
//         renderWithAuthContext(
//             <BrowserRouter>
//                 <Movie />
//             </BrowserRouter>
//         );
//
//         // Mở review panel
//         act(() => {
//             // Thực hiện hành động thay đổi trạng thái, ví dụ:
//             fireEvent.click(screen.getByText("Rate Now"));
//         });
//         // Kiểm tra xem ReviewPanel có hiển thị không
//         expect(screen.getByText("Rate Now")).toBeInTheDocument();
//
//         // Submit review
//         const commentInput = screen.getByPlaceholderText("Write a comment...");
//         fireEvent.change(commentInput, { target: { value: "Great movie!" } });
//
//         const submitButton = screen.getByText("Submit Review");
//         fireEvent.click(submitButton);
//         act(() => {
//             // Thực hiện hành động thay đổi trạng thái, ví dụ:
//             fireEvent.click(submitButton);
//         });
//         await waitFor(() => {
//             expect(axios.put).toHaveBeenCalled();
//         });
//     });
//
//     it("should scroll to comments section when comment button clicked", async () => {
//         axios.get.mockResolvedValueOnce({ data: mockMovie });
//
//         // Mock window.scrollTo
//         global.scrollTo = vi.fn();
//
//         renderWithAuthContext(
//             <BrowserRouter>
//                 <Movie />
//             </BrowserRouter>
//         );
//
//         const commentButton = screen.getByText("Comment Icon");
//         act(() => {
//             // Thực hiện hành động thay đổi trạng thái, ví dụ:
//             fireEvent.click(commentButton);
//         });
//
//         await waitFor(() => {
//             expect(global.scrollTo).toHaveBeenCalled();
//         });
//
//         const commentSection = screen.getByText("Comments (1)");
//         expect(commentSection).toBeInTheDocument();
//     });
// });

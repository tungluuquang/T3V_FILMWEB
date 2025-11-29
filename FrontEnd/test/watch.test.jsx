vi.mock('@mui/icons-material/ArrowBackOutlined', () => ({
    default: () => <div data-testid="mock-arrow-icon" />,
}));

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Watch from '../src/pages/watch/Watch';

describe('Watch Component', () => {
    const mockMovie = {
        video: 'https://vip.opstream16.com/share/7362b26d78069dd38f4b45743fddc7ee',
    };

    test('renders video and back link correctly', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/watch', state: { movie: mockMovie } }]}>
                <Routes>
                    <Route path="/watch" element={<Watch />} />
                </Routes>
            </MemoryRouter>
        );

        const iframe = screen.getByTitle('video');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', mockMovie.video);

        // Kiểm tra nút back về home
        expect(screen.getByText(/home/i)).toBeInTheDocument();
    });
});

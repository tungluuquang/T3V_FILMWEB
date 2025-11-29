import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './context/authContext/AuthContext.jsx'
import { MovieContextProvider } from './context/movieContext/MovieContext.jsx'
import { ListContextProvider } from './context/listContext/ListContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <MovieContextProvider>
        <ListContextProvider>
          <App />
        </ListContextProvider>
      </MovieContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)

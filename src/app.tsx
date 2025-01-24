import 'src/global.css';

import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';
import { BrowserRouter ,Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";

import Login from './Auth/Login/Login';
import Students from './Auth/Student/StudentPage';
import Page from './pages/sign-in'
import { auth } from "./Firebase";

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated on page load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        navigate("/students"); // Redirect to students page when authenticated
      } else {
        setIsAuthenticated(false);
        navigate("/"); // Redirect to login page if not authenticated
      }
    });
    return unsubscribe; // Cleanup on unmount
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut(); // Log out the user
    setIsAuthenticated(false); // Update the state
    alert('Logged out')
    navigate("/"); // Redirect to login page
  };

  return (

    <ThemeProvider>
      {/* <Router /> */}
      {/* {githubButton} */}

      <div
      style={{ display: "flex" }}
      >
      {isAuthenticated && (
        <nav style={{ width: "200px", padding: "20px", borderRight: "1px solid #ddd" }}>
          <ul>
              <>
                <li>
                  <Link to="/students">Students Page</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </li>
              </>

          </ul>
        </nav>
           )}

        <div
         style={{ padding: "20px", flex: 1 }}
         >
          <Routes>
            {/* <Route path="/" element={<Page />} /> */}
            <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/students" />} />

            <Route path="/students" element={isAuthenticated ? <Students /> : <Login />} />
          </Routes>
        </div>
      </div>

    </ThemeProvider>

  );
}

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import LoadingScreen from './pages/loadingScreen';

// Lazy load the components
const Home = lazy(() => import('./pages/home'));
const Profile = lazy(() => import('./pages/profile'));
const Signup = lazy(() => import('./pages/signup'));
const StatsPage = lazy(() => import('./pages/statsPage'));

function App() {
  const [loading, setLoading] = useState(!localStorage.getItem("visited"));

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
        localStorage.setItem("visited", "true");
      }, 4300);
    }
  }, [loading]);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user/:username" element={<Profile />} />
            <Route path="/statsPage/:gamertag" element={<StatsPage />} />
          </Routes>
        </Suspense>
      )}a
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
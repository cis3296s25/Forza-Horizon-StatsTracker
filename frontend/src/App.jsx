import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import LoadingScreen from './pages/loadingScreen';

// Lazy load the components
const Home = lazy(() => import('./pages/home'));
const Profile = lazy(() => import('./pages/profile'));
const Signup = lazy(() => import('./pages/signup'));
const StatsPage = lazy(() => import('./pages/statsPage'));
const SignupForm = lazy(() => import('./pages/signUpForm'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
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
            <Route path="/signup-stats" element={<SignupForm />} />
            <Route path="/user/:username" element={<StatsPage />} />
          </Routes>
        </Suspense>
      )}
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
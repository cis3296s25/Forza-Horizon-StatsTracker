import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './pages/loadingScreen';
import './App.css';
import RouteProtection from './components/routeProtection';

// Lazy load the components
const Home = lazy(() => import('./pages/home'));
const Profile = lazy(() => import('./pages/profile'));
const Signup = lazy(() => import('./pages/signup'));
const StatsPage = lazy(() => import('./pages/statsPage'));
const SignupForm = lazy(() => import('./pages/signUpForm'));
const NotFound = lazy(() => import('./components/notFound'));
const ComparePage = lazy(() => import('./pages/compareStats'));
const DeletePage = lazy(() => import('./pages/deleteProfile'));

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
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup-stats" element={<SignupForm />} />
            <Route path="/compare-page" element={<ComparePage />}/>
            <Route path="/delete" element={<RouteProtection element={<DeletePage />} />}/>
            
            <Route
              path="/user/:username"
              element={
           <RouteProtection element={<StatsPage />} />
            }
            />

            <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
          </Routes>
        </Suspense>
      )}
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;

import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import LoadingScreen from './pages/loadingScreen';
import Profile from './pages/profile';
import Signup from './pages/signup';


// Lazy load the Home and About components
const Home = lazy(() => import('./pages/home'));
//const About = lazy(() => import('./pages/About'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4300);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          </Routes>
      )}
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
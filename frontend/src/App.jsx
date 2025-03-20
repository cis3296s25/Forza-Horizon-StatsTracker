import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingScreen from './pages/loadingScreen';

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
          </Routes>
      )}
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import Home from './components/pages/Home';
import Projects from './components/pages/Projects';
import Services from './components/pages/Services';
import Volunteers from './components/pages/Volunteers';
import SignIn from './components/pages/Auth/SignIn';
import SignUp from './components/pages/Auth/SignUp';
import Suggest from './components/pages/Suggest';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/suggest" element={<Suggest />} />
            </Routes>
        <Footer />
      </div>
    </Router>
  );
}

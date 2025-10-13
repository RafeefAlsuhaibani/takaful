import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Projects from './components/pages/Projects';
import Services from './components/pages/Services';
import Volunteers from './components/pages/Volunteers';
import SignIn from './components/pages/Auth/SignIn';
import SignUp from './components/pages/Auth/SignUp';
import AdminSignIn from './components/pages/admin/AdminSignIn';
import Suggest from './components/pages/Suggest';
import About from './components/pages/About';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
                  <Route path="/admin/signin" element={<AdminSignIn />} />
                  <Route path="/suggest" element={<Suggest />} />
                  <Route path="/about" element={<About />} />
                </Routes>
            <Footer />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

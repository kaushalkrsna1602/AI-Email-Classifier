import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Emails from "./pages/Emails";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emails" element={<Emails/>} />

      </Routes>
    </Router>
  );
}

export default App;

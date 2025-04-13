import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtctedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route path='*' element={"error 404, page not found"}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

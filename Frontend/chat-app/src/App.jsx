import { Routes, Route } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import ProtectedRoute from "./Utils/ProtectedRoute";
import './App.css'
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
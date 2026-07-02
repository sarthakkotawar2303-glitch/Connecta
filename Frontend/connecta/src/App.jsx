import { Routes, Route } from "react-router-dom";
import Landing from "./features/landing/pages/Landing";
import AuthPage from "./features/auth/pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./features/chat/pages/ChatPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthPage />} />
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

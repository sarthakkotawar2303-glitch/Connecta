import { Navigate, useLocation } from "react-router-dom";
import { useChat } from "../Context/ChatProvider";

const ProtectedRoute = ({ children }) => {
  const { user } = useChat();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
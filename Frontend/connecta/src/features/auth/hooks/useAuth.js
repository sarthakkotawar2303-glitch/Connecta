import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuthContext } from "../../../context/AuthContext";

const useAuth = () => {
  const { loginUser } = useAuthContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    pic: null,
  });

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pic") {
      const file = files?.[0];
      setFormData((prev) => ({ ...prev, pic: file }));
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res?.data) {
        loginUser(res.data);
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setError("");
      setLoading(true);
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.pic) data.append("pic", formData.pic);
      const res = await api.post("/user/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data) {
        loginUser(res.data);
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  return {
    formData,
    loading,
    error,
    preview,
    handleChange,
    handleLogin,
    handleSignup,
    clearError,
  };
};

export default useAuth;

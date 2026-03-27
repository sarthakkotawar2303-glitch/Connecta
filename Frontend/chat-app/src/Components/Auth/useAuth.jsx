import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useChat } from "../../Context/ChatProvider";

axios.defaults.withCredentials = true;

const useAuth = () => {
  const { setUser } = useChat();
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
      const res = await axios.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });
      if (res?.data) {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setUser(res.data);
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
      const res = await axios.post("/api/user/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data) {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        setUser(res.data);
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
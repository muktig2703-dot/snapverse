import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [emojiIntensity, setEmojiIntensity] = useState("medium");
  const [captionLength, setCaptionLength] = useState("medium");
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("aesthetic");
  const [caption, setCaption] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedInUser] = useState(
  localStorage.getItem("username") || ""
);
  const [lastImage, setLastImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

const captionsPerPage = 5;
  function handleImageUpload(event) {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);
      setLastImage(uploadedFile);
      setSelectedImage(URL.createObjectURL(uploadedFile));
    }
  }

  async function handleAuth() {
  try {

    if (isLogin) {

      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          username,
          password,
        }
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.access_token);
localStorage.setItem("username", username);

setToken(res.data.access_token);

      toast.success("Logged in successfully");

    } else {

      await axios.post(
        "http://127.0.0.1:8000/signup",
        {
          username,
          password,
        }
      );

      toast.success("Signup successful! Please login.");
      setIsLogin(true);

    }

  } catch (err) {
    toast.error("Authentication failed");
    console.log(err);
  }
}

  async function generateCaption() {

    if (!token) {
  toast.error("Please login first");
  return;
}

    if (!file) {

      toast.error("Please upload an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("style", style);
    formData.append("emoji_intensity", emojiIntensity);
    formData.append("caption_length", captionLength);

    try {
  const res = await axios.post(
    "http://127.0.0.1:8000/generate-caption",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  setCaption(
  res.data.caption
    .split("---")
    .map((c) => c.trim())
    .filter((c) => c !== "")
);
  loadHistory(); 
} catch (error) {
  console.log(error);
  toast.error("Something went wrong");
}

    setLoading(false);
  }

  async function loadHistory() {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHistory(res.data);

  } catch (err) {
    console.log(err);
  }
}

async function deleteCaption(id) {
  try {
    await axios.delete(
      `http://127.0.0.1:8000/history/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Caption deleted!");

    loadHistory();

  } catch (err) {
    console.log(err);
    toast.error("Couldn't delete caption");
  }
}

useEffect(() => {
  if (token) {
    loadHistory();
  }
}, [token]);

async function regenerateCaption() {
  if (!lastImage) {
    toast.error("Upload an image first");
    return;
  }

  setRegenerating(true);

  const formData = new FormData();

  formData.append("file", lastImage);
  formData.append("style", style);
  formData.append("emoji_intensity", emojiIntensity);
  formData.append("caption_length", captionLength);

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/generate-caption",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCaption(
  res.data.caption
    .split("---")
    .map((c) => c.trim())
    .filter((c) => c !== "")
);

    loadHistory();

    toast.success("New caption generated!");
  } catch (err) {
    console.log(err);
    toast.error("Couldn't regenerate");
  }

  setRegenerating(false);
}
const filteredHistory = history.filter((item) =>
  item.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.style.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.image_name.toLowerCase().includes(searchTerm.toLowerCase())
);
const indexOfLastCaption = currentPage * captionsPerPage;
const indexOfFirstCaption = indexOfLastCaption - captionsPerPage;

const currentCaptions = filteredHistory.slice(
  indexOfFirstCaption,
  indexOfLastCaption
);
const totalPages = Math.ceil(
  filteredHistory.length / captionsPerPage
);

  return (
  <>
    <Toaster position="top-right" />

    <Routes>

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  </>
);
}

export default App;
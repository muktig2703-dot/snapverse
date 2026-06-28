import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("aesthetic");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loggedInUser] = useState(
  localStorage.getItem("username") || ""
);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

const captionsPerPage = 5;
  function handleImageUpload(event) {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);
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

  setCaption(res.data.caption);
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
    <div className="container">
      <Toaster position="top-right" />
      {!token ? (
  <div className="auth-box">

    <h2>{isLogin ? "Login" : "Signup"}</h2>

    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={handleAuth}>
      {isLogin ? "Login" : "Signup"}
    </button>

    <p
      style={{ cursor: "pointer", color: "blue" }}
      onClick={() => setIsLogin(!isLogin)}
    >
      {isLogin
        ? "Don't have an account? Signup"
        : "Already have an account? Login"}
    </p>

  </div>
) : (
  <>

      <h1>Snapverse ✨</h1>

      <p className="subtitle">
        AI Instagram Caption Generator
      </p>
      <p>Welcome, {loggedInUser} 👋</p>
      <button
  onClick={() => {
    localStorage.removeItem("token");
localStorage.removeItem("username");
    setToken("");
    setCaption("");
    setSelectedImage(null);
    setFile(null);
  }}
>
  Logout
</button>

      <label className="upload-btn">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          hidden
        />
      </label>

      {selectedImage && (
        <img src={selectedImage} className="preview" />
      )}

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      >
        <option value="aesthetic">Aesthetic 🌸</option>
        <option value="funny">Funny 😂</option>
        <option value="savage">Savage 🔥</option>
        <option value="poetic">Poetic 🌙</option>
        <option value="minimal">Minimal ✨</option>
      </select>

      <button
  onClick={generateCaption}
  disabled={loading}
>
  {loading ? "✨ Generating Caption..." : "Generate Caption"}
</button>

      <div className="output">
  {caption || "Your caption will appear here..."}
</div>
{caption && (
  <button
    onClick={() => {
      navigator.clipboard.writeText(caption);
      toast.success("Caption copied!");
    }}
  >
    Copy Caption
  </button>
)}
{caption && (
  <button
    onClick={() => {
      const blob = new Blob([caption], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "caption.txt";

      a.click();

      URL.revokeObjectURL(url);
    }}
  >
    Download Caption
  </button>
)}
<input
  type="text"
  placeholder="🔍 Search history..."
  value={searchTerm}
  onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
<h2>My Caption History</h2>

{currentCaptions.map((item) => (
  <div
    key={item.id}
    style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginTop: "10px",
      borderRadius: "8px",
    }}
  >
    <p><strong>Image:</strong> {item.image_name}</p>
    <p><strong>Style:</strong> {item.style}</p>
    <p>{item.caption}</p>

    <button
  onClick={() => deleteCaption(item.id)}
  style={{
    marginTop: "10px",
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  🗑 Delete
</button>
  </div>
))}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
  >
    Next
  </button>
</div>
</>
)}

</div>
  );
}

export default App;
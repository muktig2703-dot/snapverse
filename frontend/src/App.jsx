import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("aesthetic");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

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

      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);

      alert("Logged in successfully");

    } else {

      await axios.post(
        "http://127.0.0.1:8000/signup",
        {
          username,
          password,
        }
      );

      alert("Signup successful! Please login.");
      setIsLogin(true);

    }

  } catch (err) {
    alert("Authentication failed");
    console.log(err);
  }
}

  async function generateCaption() {

    if (!token) {
  alert("Please login first");
  return;
}

    if (!file) {

      alert("Please upload an image first");
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
} catch (error) {
  console.log(error);
  alert("Something went wrong");
}

    setLoading(false);
  }

  return (
    <div className="container">
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

      <button onClick={generateCaption}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      <div className="output">
  {caption || "Your caption will appear here..."}
</div>

</>
)}

</div>
  );
}

export default App;
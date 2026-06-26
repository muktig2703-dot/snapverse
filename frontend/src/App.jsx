import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [style, setStyle] = useState("aesthetic");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageUpload(event) {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);
      setSelectedImage(URL.createObjectURL(uploadedFile));
    }
  }

  async function generateCaption() {
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
        formData
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

    </div>
  );
}

export default App;
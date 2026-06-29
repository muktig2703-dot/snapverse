import { Link } from "react-router-dom";
import "../styles/Landing.css";

function Landing() {
  return (
    <>
      <section className="hero">

        <nav className="navbar">
          <h2>✨ Snapverse</h2>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </nav>

        <div className="hero-content">

          <h1>Create Amazing Instagram Captions with AI</h1>

          <p>
            Upload an image, choose your style, and let AI generate
            creative captions with hashtags in seconds.
          </p>

          <Link to="/login">
            <button className="hero-btn">
              Get Started
            </button>
          </Link>

        </div>

      </section>

      <section className="features">

        <h2>Why Snapverse?</h2>

        <div className="feature-grid">

          <div className="card">
            <h3>📸 AI Image Understanding</h3>
            <p>
              Understands your uploaded image before writing captions.
            </p>
          </div>

          <div className="card">
            <h3>✨ Multiple Caption Styles</h3>
            <p>
              Funny, Aesthetic, Savage, Poetic and Minimal.
            </p>
          </div>

          <div className="card">
            <h3>🚀 Instant Generation</h3>
            <p>
              Generate three captions within seconds.
            </p>
          </div>

        </div>

      </section>

      <footer>

        <h3>Snapverse</h3>

        <p>
          AI Powered Instagram Caption Generator
        </p>

        <p>
          Built with React + FastAPI + Google Gemini
        </p>

      </footer>
    </>
  );
}

export default Landing;
import { Link } from "react-router-dom";
import "../styles/Landing.css";
import Background from "../components/Background";
import Slideshow from "../components/Slideshow";

function Landing() {
  return (
    <>
      <section className="hero">
        <Background />

        <nav className="navbar">
          <h2 className="logo">Snapverse ✨</h2>

          <Link to="/login">
            <button className="nav-btn">Login</button>
          </Link>
        </nav>

        <div className="hero-content">

          <div className="hero-left">

            <span className="badge">
              AI Powered Instagram Caption Generator
            </span>

            <h1>
              Create Stunning Instagram Captions
              in Seconds.
            </h1>

            <p>
              Upload any image and let AI instantly generate
              aesthetic, funny, poetic, savage or minimal captions
              complete with hashtags, emoji control and multiple
              creative suggestions.
            </p>

            <div className="hero-buttons">

              <Link to="/login">
                <button className="hero-btn">
                  Get Started →
                </button>
              </Link>

            </div>

          </div>

          <div className="hero-right">

            <Slideshow />

          </div>

        </div>

      </section>

      <section className="features">

        <h2>Everything You Need</h2>

        <div className="feature-grid">

          <div className="card">
            <h3>📸 AI Vision</h3>
            <p>
              Understands your image before writing captions.
            </p>
          </div>

          <div className="card">
            <h3>✨ Multiple Styles</h3>
            <p>
              Funny, Minimal, Poetic, Aesthetic and Savage.
            </p>
          </div>

          <div className="card">
            <h3>🚀 Instant Results</h3>
            <p>
              Generate multiple captions in just seconds.
            </p>
          </div>

        </div>

      </section>

      <footer>

        <h2>Snapverse</h2>

        <p>
          AI Powered Instagram Caption Generator
        </p>

        <p>
          Built using React • FastAPI • Google Gemini
        </p>

      </footer>

    </>
  );
}

export default Landing;
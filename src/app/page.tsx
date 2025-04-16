'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-start justify-start px-4 md:px-20 py-20">
      {/* Welcome Section (Left-Aligned, Unchanged) */}
      <div className="w-full max-w-md md:max-w-lg">
        <h1 className="text-7xl md:text-9xl font-sans font-bold text-[#1de9b6] mb-8">
          Welcome to APIVerse
        </h1>
        <p className="text-base md:text-lg font-inter text-white/80 max-w-md mb-8 line-clamp-3">
          Manage, store, and predict with your API keys—securely and efficiently.
          Click the button below to access your dashboard and explore more features.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 bg-white hover:bg-[#1de9b6] text-black font-roboto font-semibold py-3 px-6 text-lg transition"
        >
          Go to Dashboard
        </Link>
      </div>

      {/* How to Get Started Section */}
      <section className="w-full max-w-6xl mt-35">
        <h2 className="text-4xl md:text-8xl font-sans font-bold text-[#1de9b6] mb-12 text-center">
          How to Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Sign Up in Seconds</h3>
            <p className="text-lg text-white/80">
              Create your account with Google or email. Your APIVerse profile is your gateway to predictive power.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Upload Your API Keys</h3>
            <p className="text-lg text-white/80">
              Securely store your machine learning API keys—like that Ames model on Render—and manage them with ease.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Predict with Ease</h3>
            <p className="text-lg text-white/80">
              Upload datasets, select an API key, and download predictions. It’s ML magic, simplified.
            </p>
          </div>
        </div>
      </section>

      {/* Why APIVerse Section */}
      <section className="w-full max-w-6xl mt-35">
        <h2 className="text-6xl md:text-8xl font-sans font-bold text-[#1de9b6] mb-12 text-center">
          Why APIVerse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Seamless API Management</h3>
            <p className="text-lg text-white/80">
              Store and switch between multiple API keys effortlessly. Whether it’s one model or ten, we’ve got you covered.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Predict Like a Pro</h3>
            <p className="text-lg text-white/80">
              Upload JSON datasets and get predictions in a snap. Download results with original data plus a shiny new prediction column.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-5xl font-sans font-bold text-white mb-4">Secure & User-Friendly</h3>
            <p className="text-lg text-white/80">
              Your keys are locked tight, and our intuitive interface makes ML accessible to everyone—no PhD required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with Border */}
      <footer className="w-full mt-35 pt-12 border-t border-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div>
            <h3 className="text-base font-bold text-[#1de9b6] mb-2">Contact Us</h3>
            <p className="text-base text-white/80">Email: support@apiverse.ai</p>
            <p className="text-base text-white/80">Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1de9b6] mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/apiverse" className="text-white/80 hover:text-[#1de9b6] text-base">
                X/Twitter
              </a>
              <a href="https://linkedin.com/company/apiverse" className="text-white/80 hover:text-[#1de9b6] text-base">
                LinkedIn
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1de9b6] mb-2">Visit Us</h3>
            <p className="text-base text-white/80">123 Innovation Drive</p>
            <p className="text-base text-white/80">Tech City, TC 54321</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
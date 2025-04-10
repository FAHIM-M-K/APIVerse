"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user); // Send verification email
        const token = await userCredential.user.getIdToken(true); // Force refresh
        console.log("Generated Token:", token); // Debug log
        localStorage.setItem("token", token);
        alert("Signed up successfully! Please verify your email before logging in.");
        setIsSignUp(false); // Switch back to login view
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Please verify your email before logging in.");
          return;
        }
        const token = await userCredential.user.getIdToken(true); // Force refresh
        console.log("Generated Token:", token); // Debug log
        localStorage.setItem("token", token);
        alert("Logged in successfully! Redirecting to profile...");
        window.location.href = "/profile";
      }
    } catch (error) {
      alert("Auth failed: " + (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken(true); // Force refresh
      console.log("Generated Token:", token); // Debug log
      localStorage.setItem("token", token);
      alert("Logged in with Google! Redirecting to profile...");
      window.location.href = "/profile";
    } catch (error) {
      alert("Google login failed: " + (error as Error).message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false); // Hide forgot password form
    } catch (error) {
      alert("Failed to send reset email: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-2xl mb-4">{isSignUp ? "Sign Up" : "Login"} to Apiverse</h1>
        {showForgotPassword ? (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-2 rounded w-full text-black"
            />
            <button
              onClick={handleForgotPassword}
              className="bg-white text-purple-600 p-2 rounded w-full"
            >
              Send Reset Email
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(false);
              }}
              className="underline"
            >
              Back to Login
            </a>
          </div>
        ) : (
          <>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 rounded w-full text-black"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-2 rounded w-full text-black"
              />
              <button
                type="submit"
                className="bg-white text-purple-600 p-2 rounded w-full"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>
            <button
              onClick={handleGoogleLogin}
              className="mt-4 bg-white text-purple-600 p-2 rounded w-full"
            >
              {isSignUp ? "Sign Up with Google" : "Login with Google"}
            </button>
            {!isSignUp && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
                className="mt-2 underline block text-center"
              >
                Forgot Password?
              </a>
            )}
            <p className="mt-2 text-center">
              {isSignUp ? "Already have an account? " : "No account? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignUp(!isSignUp);
                }}
                className="underline"
              >
                {isSignUp ? "Login" : "Sign up"}
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
"use client"; // Marks this as a client component
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Logged in successfully!");
      window.location.href = "/profile"; // Redirect to profile
    } catch (error) {
      alert("Login failed: " + (error as Error).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      alert("Logged in with Google!");
      window.location.href = "/profile";
    } catch (error) {
      alert("Google login failed: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h1 className="text-2xl mb-4">Apiverse Login</h1>
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="mt-4 bg-white text-purple-600 p-2 rounded w-full"
        >
          Login with Google
        </button>
        <p className="mt-2">
          No account?{" "}
          <a href="#" className="underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
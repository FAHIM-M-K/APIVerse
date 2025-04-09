import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white text-center">
        <h1 className="text-3xl mb-4">Welcome to Apiverse</h1>
        <p className="mb-4">Simplify your ML predictions with ease.</p>
        <a href="/auth" className="bg-white text-purple-600 p-2 rounded">
          Get Started
        </a>
      </div>
    </div>
  );
}
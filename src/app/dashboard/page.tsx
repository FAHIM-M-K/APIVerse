"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-[#40E0D0] text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl text-[#40E0D0] font-bold mb-4">
        Welcome, {user?.email}!
      </h1>
      <p className="text-white">This is your dashboard.</p>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null); // Temporary any type; refine later
  const token = localStorage.getItem("token"); // Assume token is stored here after login

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error: any) => {
          console.error("Error:", error.message);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white">
        {userData ? (
          <p>{userData.message}</p>
        ) : (
          <p>Please log in to see your profile.</p>
        )}
      </div>
    </div>
  );
}
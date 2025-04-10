"use client";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; // Corrected import

// Define interfaces for API responses
interface ProtectedResponse {
  message: string;
}

interface ApiKeyResponse {
  api_key: string;
  message?: string; // Optional for /generate-api-key
}

interface PredictionResponse {
  user_id: string;
  prediction: number;
  timestamp: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<ProtectedResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [inputData, setInputData] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored Token:", storedToken);
    setToken(storedToken);
    setError(null);
    if (storedToken) {
      // Fetch protected data
      axios
        .get<ProtectedResponse>("http://127.0.0.1:8000/protected", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response: AxiosResponse<ProtectedResponse>) => {
          console.log("Response:", response.data);
          setUserData(response.data);
        })
        .catch((error: any) => {
          console.error("Error:", error.message);
          setError(error.message);
        });

      // Fetch API key
      axios
        .get<ApiKeyResponse>("http://127.0.0.1:8000/get-api-key", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response: AxiosResponse<ApiKeyResponse>) => {
          console.log("API Key Response:", response.data);
          setApiKey(response.data.api_key);
        })
        .catch((error: any) => {
          console.error("API Key Error:", error.message);
        });
    } else {
      console.log("No token found in localStorage");
      setError("No token available");
    }
  }, []);

  const generateApiKey = async () => {
    if (token) {
      try {
        const response = await axios.post<ApiKeyResponse>(
          "http://127.0.0.1:8000/generate-api-key",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApiKey(response.data.api_key);
        alert("API key generated successfully!");
      } catch (error: any) {
        console.error("Generate API Key Error:", error.message);
        alert("Failed to generate API key: " + error.message);
      }
    }
  };

  const getPrediction = async () => {
    if (apiKey && inputData) {
      try {
        const response = await axios.post<PredictionResponse>(
          "http://127.0.0.1:8000/predict",
          { data: inputData },
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        setPrediction(response.data.prediction);
        alert("Prediction received: " + response.data.prediction);
      } catch (error: any) {
        console.error("Prediction Error:", error.message);
        alert("Failed to get prediction: " + error.message);
      }
    } else {
      alert("Please generate an API key and enter data first!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-purple-600 p-6 rounded-lg shadow-lg text-white">
        {error ? (
          <p>Error: {error}</p>
        ) : userData ? (
          <>
            <p>{userData.message}</p>
            <div className="mt-4">
              <p>API Key: {apiKey || "Not generated yet"}</p>
              <button
                onClick={generateApiKey}
                className="bg-white text-purple-600 p-2 rounded mt-2"
              >
                Generate API Key
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter data for prediction"
                className="p-2 rounded w-full text-black mt-2"
              />
              <button
                onClick={getPrediction}
                className="bg-white text-purple-600 p-2 rounded mt-2"
              >
                Get Prediction
              </button>
              {prediction !== null && (
                <p className="mt-2">Prediction: {prediction}</p>
              )}
            </div>
          </>
        ) : (
          <p>Please log in to see your profile.</p>
        )}
      </div>
    </div>
  );
}
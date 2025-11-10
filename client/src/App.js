// src/App.js
import React, { useState } from "react";
import "./App.css";
import SearchBar from "./components/Searchbar";
import ResultBox from "./components/ResultBox" ;

export default function App() {
  const [result, setResult] = useState(null);

  // This function sends the email to your backend (port 5000)
  const handleSearch = async (email) => {
    try {
      const res = await fetch("http://localhost:5000/api/mail/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Email Checker</h2>
      <SearchBar onSearch={handleSearch} />
      <ResultBox result={result} />
    </div>
  );
}

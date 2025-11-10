// src/components/SearchBar.js
import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      onSearch(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email address"
      />
      <button type="submit">Check</button>
    </form>
  );
}

export default SearchBar;

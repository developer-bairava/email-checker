// src/components/ResultBox.js
import React from "react";

function ResultBox({ result }) {
  if (!result) return null;

  const ok = (condition) =>
    condition ? "status-ok" : "status-fail";

  return (
    <div className="result-box">
      <p className="result-line">
        <strong>Email:</strong> {result.email}
      </p>
      <p className={`result-line ${ok(result.formatValid)}`}>
        <strong>Format:</strong> {result.formatValid ? "Valid ✅" : "Invalid ❌"}
      </p>
      <p className={`result-line ${ok(result.domainValid)}`}>
        <strong>Domain:</strong> {result.domainValid ? "Valid ✅" : "Invalid ❌"}
      </p>
      <p className={`result-line ${ok(result.smtpStatus === "ok")}`}>
        <strong>SMTP:</strong>{" "}
        {result.smtpStatus === "ok" ? "Reachable ✅" : "Failed ❌"}
      </p>
      <p className={`result-line ${ok(result.relatedFound)}`}>
        <strong>Related Data:</strong>{" "}
        {result.relatedFound ? "Found 🔍" : "None"}
      </p>

      {result.relatedData && result.relatedData.length > 0 && (
        <ul className="result-links">
          {result.relatedData.map((item, i) => (
            <li key={i}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResultBox;

// src/services/mailService.js
import dns from "dns";
import { SMTPClient } from "smtp-client";
import googleIt from "google-it";
import { validateEmailFormat } from "../utils/validateEmail.js";
import  duckSearch from "duckduckgo-search";

/**
 * Verify email address with multiple checks:
 * - Format validation
 * - MX record (domain) validation
 * - SMTP handshake
 * - Search engine related data
 */
export const verifyEmail = async (email) => {
  const result = {
    email,
    formatValid: false,
    domainValid: false,
    smtpStatus: "unknown",
    smtpResponse: null,
    relatedFound: false,
    relatedData: [],
    finalStatus: "unknown",
  };

  try {
    // 1️⃣ Validate format
    if (!validateEmailFormat(email)) {
      result.finalStatus = "invalid_format";
      return result;
    }
    result.formatValid = true;

    // 2️⃣ Check MX records
    const domain = email.split("@")[1];
    const mxRecords = await new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err || !addresses.length) return reject("No MX records found");
        resolve(addresses.sort((a, b) => a.priority - b.priority));
      });
    }).catch(() => null);

    if (!mxRecords) {
      result.finalStatus = "invalid_domain";
      return result;
    }

    result.domainValid = true;
    const mxHost = mxRecords[0].exchange;

    // 3️⃣ SMTP handshake check (no email sent)
    try {
      const client = new SMTPClient({ host: mxHost, port: 25, timeout: 4000 });
      await client.connect();
      await client.greet({ hostname: "mail-checker.local" });
      await client.mail({ from: "noreply@mail-checker.local" });
      const smtpResponse = await client.rcpt({ to: email });
      await client.quit();

      result.smtpStatus = "ok";
      result.smtpResponse = smtpResponse;
    } catch (error) {
      result.smtpStatus = "unknown";
      result.smtpResponse = error.message;
    }

    // 4️⃣ Search engine related data check (Google)
    // 4️⃣ Search engine related data check (Google)
try {
  const searchQueries = [
    email,
    `${email} site:linkedin.com`,
    `${email} site:github.com`,
    `${email} site:twitter.com`,
    `${email} site:instagram.com`,
  ];

  let combinedResults = [];

  // Try Google first
  for (const q of searchQueries) {
    try {
      const results = await googleIt({ query: q });
      combinedResults = [...combinedResults, ...results];
    } catch {
      console.warn(`Google search failed for query: ${q}`);
    }
  }

  // Fallback to DuckDuckGo if Google gives no results
  if (combinedResults.length === 0) {
    console.log("🔁 Falling back to DuckDuckGo...");
    for (const q of searchQueries) {
      const results = await duckSearch(q);
      combinedResults = [...combinedResults, ...results];
    }
  }

  // Deduplicate by link
  const uniqueResults = Array.from(
    new Map(combinedResults.map((r) => [r.link, r])).values()
  );

  result.relatedData = uniqueResults.map((r) => ({
    title: r.title || r.heading || "",
    snippet: r.snippet || r.description || "",
    link: r.link || r.url || "",
  }));

  result.relatedFound = result.relatedData.length > 0;
} catch (error) {
  result.relatedFound = false;
  result.relatedData = [];
}


    // 5️⃣ Final decision
    if (result.smtpStatus === "ok" || result.relatedFound) {
      result.finalStatus = "likely_valid";
    } else if (!result.domainValid) {
      result.finalStatus = "invalid_domain";
    } else {
      result.finalStatus = "unknown";
    }

    return result;
  } catch (error) {
    result.finalStatus = "error";
    result.smtpResponse = error.message;
    return result;
  }
};

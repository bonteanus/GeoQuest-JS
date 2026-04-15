// src/services/api.js

const BASE_URL = "https://mark0s.com/geoquest/v1/api ";
// Using the public key from the assignment brief
const API_KEY = "16gv8f";

export async function geoquestFetch(endpoint, options = {}) {
  // Automatically append the key to every request
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error; // Let the screen handle the error UI
  }
}

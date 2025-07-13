export function padLeft(num: number, size: number): string {
  let s = String(num);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

import axios from "axios";
/**
 * Checks for internet connectivity by attempting to fetch from a well-known URL.
 * Requires 'axios' package: npm install axios
 * @returns {Promise<boolean>} A promise that resolves to true if connected, false otherwise.
 */
export async function isConnectedToInternetViaHttp() {
  try {
    const response = await axios.head("https://www.google.com/generate_204", {
      timeout: 5000,
    });
    // Google's generate_204 endpoint is specifically for connectivity checks.
    // It returns a 204 No Content response, which is perfect for this.
    return response.status === 204;
  } catch (error: any) {
    console.error("HTTP connectivity check error:", error.message);
    return false;
  }
}

export function isConnectedToInternet(): boolean {
  return navigator.onLine;
}

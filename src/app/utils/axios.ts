import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://ai-agent-376570701279.asia-southeast1.run.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
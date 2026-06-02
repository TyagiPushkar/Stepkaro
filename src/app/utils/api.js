import axios from "axios";

// 1. Apni API ka base URL set karo
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Apne backend ka URL yahan dalo
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Har request bhejne se pehle automatic Access Token jod dega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: Agar backend ne 401 (Token Expired) diya, toh yeh handle karega
api.interceptors.response.use(
  (response) => response, // Agar sab sahi hai, toh data aage bhej do
  async (error) => {
    const originalRequest = error.config;

    // Agar error 401 hai aur humne is request ko pehle retry nahi kiya hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Isko true mark karo taaki loop na bane

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        // Backend ke refresh endpoint par request bhejo (Yahan normal 'axios' use karna hai, 'api' nahi)
        const response = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {
            token: refreshToken,
          },
        );

        if (response.status === 200) {
          const { accessToken: newAccessToken } = response.data;

          // Naya token save karo
          localStorage.setItem("accessToken", newAccessToken);

          // Purani request ka header naye token se update karo
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Use fir se run kar do! User ko pata bhi nahi chalega aur kaam ho jayega
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token bhi expire ho gaya bahi!", refreshError);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export default api;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { username, password });

    try {
      console.log("Sending request to backend...");
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        username,
        password,
      });
      console.log("Response received:", res.data);

      if (res.data.token) {
        // Store the token
        localStorage.setItem("token", res.data.token);
        // Navigate to dashboard or home
        navigate("/planner");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Login failed: " + err.message);
      }
    }
  };

  return (
    <div className="bg-zinc-800 w-screen h-screen flex items-center justify-center py-10 px-10 ">
      <div className="bg-zinc-600 w-full h-full rounded-2xl drop-shadow-2xl shadow-2xl shadow-zinc-700">
        <div>
          <img
            src="/src/imgs/landingPageLogo.png"
            alt="Digital Diary Logo"
            className="w-64 h-32 object-contain mx-10 my-4 drop-shadow-lg"
          />
        </div>
        <div className="flex items-center justify-center h-4/5 w-full">
          <div className="bg-zinc-800 w-1/2 h-1/2 max-h-1/2 max-w-[600px] min-h-[500px] rounded-2xl ">
            <h1 className="text-white font-semibold text-6xl mt-7 uppercase text-center">
              Login
            </h1>
            <form
              className="flex flex-col items-center justify-center w-3/4 mx-auto gap-6 mt-20"
              onSubmit={handleLogin}
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-white rounded-md px-4 py-2 w-full max-w-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-white rounded-md px-4 py-2 w-full max-w-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button
                type="submit"
                className="mt-4 bg-zinc-700 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-zinc-400 transition-colors w-full max-w-xs"
              >
                Login
              </button>
              <div className="mt-4 text-center">
                <span className="text-zinc-300">New User? </span>
                <button
                  type="button"
                  className="text-blue-400 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Click here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

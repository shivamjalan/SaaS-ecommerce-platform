import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../store/authContext";
import { API_URL } from "../utils/api";

const Login = () => {

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/users/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        login(data);

        alert("Login successful");

        navigate("/");

      } else {

        alert(data.message || "Invalid credentials");
      }

    } catch (error) {

      console.log(error);

      alert("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-4"
      >

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
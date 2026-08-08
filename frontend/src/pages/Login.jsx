import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

import { AuthContext } from "../store/authContext";
import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

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
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-6">

            <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent">

              <FaUser className="text-white" size={26} />

            </div>

          </div>

          <SectionLabel>

            Welcome Back

          </SectionLabel>

          <h1 className="mt-5 text-4xl font-display text-foreground">

            Login to{" "}

            <span className="gradient-text">

              Vistaar

            </span>

          </h1>

        </div>

        <Card className="p-8">

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Email

              </label>

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Password

              </label>

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <div className="flex justify-end -mt-2">

              <Link
                to="/forgot-password"
                className="text-sm text-accent font-semibold hover:underline"
              >

                Forgot password?

              </Link>

            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >

              <FaLock />

              Login

            </Button>

          </form>

        </Card>

        <p className="text-center text-muted-foreground mt-6 text-sm">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-accent font-semibold hover:underline"
          >

            Register

          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;

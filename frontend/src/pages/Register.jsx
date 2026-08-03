import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      await response.json();

      if (response.ok) {
        alert("Registration Successful");

        navigate("/login");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-6">

            <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent">

              <FaUserPlus className="text-white" size={26} />

            </div>

          </div>

          <SectionLabel>

            Join Us

          </SectionLabel>

          <h1 className="mt-5 text-4xl font-display text-foreground">

            Create your{" "}

            <span className="gradient-text">

              Account

            </span>

          </h1>

        </div>

        <Card className="p-8">

          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-5"
          >

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Name

              </label>

              <Input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-foreground mb-2">

                Email

              </label>

              <Input
                type="email"
                placeholder="Enter Email"
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
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >

              Register

            </Button>

          </form>

        </Card>

        <p className="text-center text-muted-foreground mt-6 text-sm">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-accent font-semibold hover:underline"
          >

            Login

          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;

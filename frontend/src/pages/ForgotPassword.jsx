import { useState } from "react";
import { Link } from "react-router-dom";
import { FaKey, FaEnvelope } from "react-icons/fa";

import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

import usePageMeta from "../hooks/usePageMeta";

const ForgotPassword = () => {

  usePageMeta(
    "Forgot Password | Vendora",
    "Reset your Vendora account password."
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {

    e.preventDefault();

    setLoading(true);

    setMessage("");

    setError("");

    try {

      const response = await fetch(
        `${API_URL}/users/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage(
          data.message ||
            "If an account exists for that email, a reset link has been sent."
        );

      } else {

        setError(
          data.error || "Something went wrong"
        );

      }

    } catch (error) {

      console.log(error);

      setError("Server error");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-6">

            <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent">

              <FaKey className="text-white" size={26} />

            </div>

          </div>

          <SectionLabel>

            Account Recovery

          </SectionLabel>

          <h1 className="mt-5 text-4xl font-display text-foreground">

            Forgot{" "}

            <span className="gradient-text">

              Password

            </span>

          </h1>

          <p className="mt-3 text-muted-foreground">

            Enter your email and we'll send you a reset link.

          </p>

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

            {message && (
              <p className="text-emerald-600 font-medium text-sm bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">

                {message}

              </p>
            )}

            {error && (
              <p className="text-red-600 font-medium text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">

                {error}

              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >

              <FaEnvelope />

              {loading ? "Sending..." : "Send Reset Link"}

            </Button>

          </form>

        </Card>

        <p className="text-center text-muted-foreground mt-6 text-sm">

          Remembered your password?{" "}

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

export default ForgotPassword;

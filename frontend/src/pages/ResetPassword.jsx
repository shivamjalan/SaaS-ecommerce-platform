import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaLock, FaCheckCircle } from "react-icons/fa";

import { API_URL } from "../utils/api";

import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

import usePageMeta from "../hooks/usePageMeta";

const ResetPassword = () => {

  usePageMeta(
    "Reset Password | Vistaar",
    "Set a new password for your Vistaar account."
  );

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitHandler = async (e) => {

    e.preventDefault();

    setMessage("");

    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/users/reset-password/${token}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage(
          data.message || "Password reset successful."
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

              <FaLock className="text-white" size={26} />

            </div>

          </div>

          <SectionLabel>

            New Password

          </SectionLabel>

          <h1 className="mt-5 text-4xl font-display text-foreground">

            Reset{" "}

            <span className="gradient-text">

              Password

            </span>

          </h1>

        </div>

        <Card className="p-8">

          {message ? (

            <div className="text-center">

              <div className="flex justify-center mb-6">

                <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent">

                  <FaCheckCircle className="text-white" size={26} />

                </div>

              </div>

              <p className="text-emerald-600 font-medium mb-6">

                {message}

              </p>

              <Link
                to="/login"
                className="gradient-bg text-white w-full inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl text-base font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200"
              >

                Go to Login

              </Link>

            </div>

          ) : (

            <form
              onSubmit={submitHandler}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-foreground mb-2">

                  New Password

                </label>

                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-2">

                  Confirm Password

                </label>

                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />

              </div>

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

                <FaLock />

                {loading ? "Resetting..." : "Reset Password"}

              </Button>

            </form>

          )}

        </Card>

      </div>

    </div>
  );
};

export default ResetPassword;

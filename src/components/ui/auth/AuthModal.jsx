import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { X, Mail, GithubIcon, ExternalLink } from "lucide-react";

export default function AuthModal({ isOpen, onClose, quizAnswers, quizTags }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulating login - in a real app, this would be an API call
    setTimeout(() => {
      // Store auth token in local storage
      localStorage.setItem("auth_token", "sample_token_" + Math.random());
      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
        })
      );
      // Store quiz answers
      localStorage.setItem("quiz_answers", JSON.stringify(quizAnswers));

      // Note: quiz_tags is already stored in localStorage by the Quiz component

      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    // Simulating signup - in a real app, this would be an API call
    setTimeout(() => {
      // Store auth token in local storage
      localStorage.setItem("auth_token", "sample_token_" + Math.random());
      // Store user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name,
        })
      );
      // Store quiz answers
      localStorage.setItem("quiz_answers", JSON.stringify(quizAnswers));

      // Note: quiz_tags is already stored in localStorage by the Quiz component

      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSkip = () => {
    // Note: quiz_tags is already stored in localStorage by the Quiz component

    // Still save quiz answers
    localStorage.setItem("quiz_answers", JSON.stringify(quizAnswers));
    navigate("/dashboard");
  };

  // Always render the modal when called, isOpen check is done by parent
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 to-white flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-[#00DDB3] opacity-5 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute inset-0 bg-dots-white/[0.2] pointer-events-none"></div>

      <Card className="w-full max-w-md border-none shadow-2xl bg-white">
        <CardHeader className="relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create your account
          </CardTitle>
          <CardDescription className="text-base">
            Save your quiz results and personalize your learning journey
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signup">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-[#00DDB3] data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-[#00DDB3] data-[state=active]:text-white"
              >
                Log In
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#00DDB3] hover:bg-teal-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
                <div className="relative flex items-center w-full">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <GithubIcon className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="login-password">Password</Label>
                    <a
                      href="#"
                      className="text-xs text-[#00DDB3] hover:text-teal-600"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[#00DDB3] hover:bg-teal-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
                <div className="relative flex items-center w-full">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <GithubIcon className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        <div className="p-6 pt-2 text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now
          </button>
        </div>
      </Card>
    </div>
  );
}

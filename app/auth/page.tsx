"use client";

import { useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { User, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const { dispatch } = useContext(UserContext)!;
  const router = useRouter();

  const [regNo, setRegNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setRegNo("");
    setUsername("");
    setPassword("");
  };

  // LOGIN: Only regno and password
  const handleLogin = async () => {
    if (!regNo || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const loginPayload = { regno: regNo, password };
      const data = await apiService.login(loginPayload);
      const userData = {
        userId: data.userid,
        username: data.username,
        regno: data.regno,
        token: data.token
      };
      dispatch({ type: "LOGIN", payload: userData });
      resetForm();
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // SIGNUP: Capitalize username before sending
  function capitalizeName(name: string) {
    return name
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const handleSignup = async () => {
    if (!regNo || !username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const formattedUsername = capitalizeName(username);
      const data = await apiService.register({ regno: regNo.toLowerCase(), username: formattedUsername, password });
      const userData = {
        userId: data.userid,
        username: data.username,
        regno: data.regno,
        token: data.token
      };
      dispatch({ type: "LOGIN", payload: userData });
      resetForm();
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err.message || "Signup failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to PlacementLog</h2>
          <p className="mt-2 text-sm text-gray-600">
            Share your placement journey with fellow students
          </p>
        </div>

        {/* Auth Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="login-regno" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="login-regno"
                    type="text"
                    placeholder="Enter your registration number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-regno" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="signup-regno"
                    type="text"
                    placeholder="Enter your registration number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Enter your full name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Formal Notice about username and regno */}
        <div className="mt-6 text-center">
          <div className="inline-block p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-900 text-sm max-w-md">
            <strong>Friendly Reminder:</strong><br />
            Please use your real name and registration number, and avoid any inappropriate or funny entries. Your information is safely hashed and stored. Using proper details helps everyone have a better experience on PlacementLog!
          </div>
        </div>
      </div>
    </div>
  );
}

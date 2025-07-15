import { useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/user-context";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { User, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export function AuthTab() {
  const { dispatch } = useContext(UserContext)!;
  const navigate = useNavigate();

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
      navigate("/");
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
      const data = await apiService.register({ regno: regNo, username: formattedUsername, password });
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
      navigate("/");
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>

        {/* Auth Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-sm font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-reg" className="text-sm font-medium text-gray-700">
                    Registration Number
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="login-reg" 
                      placeholder="22BIT0001" 
                      value={regNo} 
                      onChange={(e) => setRegNo(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="login-pass" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="login-pass" 
                      type="password" 
                      placeholder="Your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-reg" className="text-sm font-medium text-gray-700">
                    Registration Number
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signup-reg" 
                      placeholder="22BIT0001" 
                      value={regNo} 
                      onChange={(e) => setRegNo(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-username" className="text-sm font-medium text-gray-700">
                    Username
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signup-username" 
                      placeholder="Your username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="signup-pass" className="text-sm font-medium text-gray-700">
                    Create Password
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="signup-pass" 
                      type="password" 
                      placeholder="Create a password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3"
                onClick={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Admin Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Admin?{" "}
                <button 
                  onClick={() => navigate("/admin-auth")}
                  className="text-gray-900 hover:text-gray-700 underline font-medium"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
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

export const AuthPage = () => {
  return <AuthTab />;
};


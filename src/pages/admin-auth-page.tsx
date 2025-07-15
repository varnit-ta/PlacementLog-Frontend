import { useState, useContext } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Lock } from "lucide-react";
import { UserContext } from "@/context/user-context";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { toast } from "sonner";

export const AdminAuthPage = () => {
  const { dispatch } = useContext(UserContext)!;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleAdminLogin = async () => {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiService.adminLogin(username.toLowerCase(), password);
      
      // Store user data with userId (from userid field)
      const userData = {
        userId: data.userid,
        username: data.username,
        regno: data.regno,
        token: data.token
      };
      
      dispatch({ type: "LOGIN", payload: userData });
      resetForm();

      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Admin login successful!");

      navigate("/admin");
    } catch (err: any) {
      console.error("Admin login error:", err);
      toast.error(err.message || "Admin login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Shield className="h-8 w-8 text-gray-700" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Access the admin dashboard to review and manage placement posts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-username">Username</Label>
              <Input 
                id="admin-username" 
                placeholder="admin" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                placeholder="Admin password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-black hover:bg-gray-800" 
              onClick={handleAdminLogin}
              disabled={isLoading}
            >
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Logging in..." : "Admin Login"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Regular user?{" "}
            <button 
              onClick={() => navigate("/auth")}
              className="text-gray-900 hover:text-gray-700 underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}; 
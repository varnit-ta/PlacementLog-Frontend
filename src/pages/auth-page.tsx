import { useState, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AppWindowIcon } from "lucide-react";
import { UserContext } from "@/context/user-context";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL;

export function AuthTab() {
  const { dispatch } = useContext(UserContext)!;
  const navigate = useNavigate();

  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setRegNo("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: regNo.toLowerCase(), password: password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      dispatch({ type: "LOGIN", payload: { userId: data.data.username, token: data.data.token } });
      resetForm();

      localStorage.setItem("user", JSON.stringify({
        userId: data.data.username,
        token: data.data.token
      }));

      navigate("/")
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check credentials.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: regNo, password: password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");

      dispatch({ type: "LOGIN", payload: { userId: data.data.username, token: data.data.token } });
      resetForm();

      localStorage.setItem("user", JSON.stringify({
        userId: data.data.username,
        token: data.data.token
      }));

      navigate("/")
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="login">
        <TabsList className="gap-1 justify-center">
          <AppWindowIcon />
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Log in to your account to manage your posts — track, create, and delete entries related to your placement journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login-reg">Registration No</Label>
                <Input id="login-reg" placeholder="22BIT0001" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-pass">Password</Label>
                <Input id="login-pass" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin}>Log In</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Sign up to manage your posts — track, create, and delete entries related to your placement journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-reg">Registration No</Label>
                <Input id="signup-reg" placeholder="22BIT0001" value={regNo} onChange={(e) => setRegNo(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-pass">Password</Label>
                <Input id="signup-pass" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSignup}>Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}



export const AuthPage = () => {
  return (
    <div className="flex items-center justify-center">
      <AuthTab />
    </div>
  );
};


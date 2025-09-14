"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export default function AdminLoginPage() {
  const { login, isLoggedIn } = useAdminAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ redirect hanya di client, bukan di render server
  useEffect(() => {
    if (isLoggedIn()) {
      router.push("/admin/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (username === "admin" && password === "rt14admin") {
      login();
      router.push("/admin/dashboard");
    } else {
      setError("Username atau password salah");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-950 p-4">
      <Card className="w-full max-w-md bg-background dark:bg-gray-800 border border-border dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground dark:text-white">
            Admin RT 14
          </CardTitle>
          <p className="text-muted-foreground dark:text-gray-300">
            Masuk untuk mengelola website
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="dark:text-gray-200">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="password" className="dark:text-gray-200">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Back to Beranda */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center mx-auto"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

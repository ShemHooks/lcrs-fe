"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Mail, Lock, EyeOff } from "lucide-react";
import { FloatingInput } from "@/components/reusable/FloatingInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLogin } from "@/server/hooks/authHooks";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (response) => {
          sessionStorage.setItem("token", response.data.token);

          if (response.data.user.role === "Admin") {
            router.push("/admin");
          } else if (response.data.user.role === "Staff") {
            router.push("/clerk");
          } else {
            router.push("/");
          }
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-[#F7E8E8] flex items-center justify-center p-6">
      <Card
        className={`relative w-full max-w-6xl flex flex-row overflow-hidden rounded-md shadow-md border-0 ${
          loginMutation.isPending ? "animate-pulse" : ""
        }`}
      >
        {loginMutation.isPending && (
          <div className="absolute top-0 left-0 h-1 w-full overflow-hidden bg-gray-200">
            <div className="h-full w-1/3 bg-blue-500 animate-loading-bar" />
          </div>
        )}
        {/* Left Side */}
        <div className="w-1/2 flex flex-col items-center justify-center p-16">
          <Image
            src="/assets/logo.png"
            alt="Aim Higher Kabankalan"
            width={450}
            height={450}
            className="object-contain"
            priority
          />
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-bold text-2xl text-gray-950/80">
              City Civil Registry System
            </h2>
            <h5 className="font-bold text-lg text-gray-400">
              Kabankalan City, Negros Occidental
            </h5>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex items-center">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h1 className="text-3xl  font-normal text-black">
                Hello, Welcome Back!
              </h1>

              <p className="mt-2 text-lg text-gray-700">
                Please sign in to your account to continue.
              </p>
            </div>

            <div className="w-full max-w-md p-6 space-y-6">
              <FloatingInput
                label="Email Address"
                icon={<Mail size={24} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                iconPosition="left"
              />

              <FloatingInput
                label="Password"
                type="password"
                icon={<Lock size={24} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                iconPosition="left"
              />
            </div>
            <div>
              {loginMutation.isError && (
                <p className="text-red-500">{loginMutation.error?.message}</p>
              )}
            </div>

            <div className="w-full flex flex-col items-center ">
              <Button
                className="w-3/4 h-10 bg-red-600 hover:bg-red-800 font-bold text-xl"
                onClick={handleLogin}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="mt-4 text-blue-500 font-bold hover:bg-transparent hover:text-blue-700"
                  >
                    Forgot Password?
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Password Recovery
                    </DialogTitle>

                    <DialogDescription className="pt-2">
                      If you have forgotten your password, please contact the
                      City Civil Registry System Administrator. They will verify
                      your identity and issue a temporary password for your
                      account.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-end">
                    <DialogClose asChild>
                      <Button>Understood</Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <hr />
            <div className="flex justify-center">
              <p>Don't have an account yet? Please contact administrator.</p>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}

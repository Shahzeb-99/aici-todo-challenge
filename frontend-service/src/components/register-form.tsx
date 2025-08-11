import React, {useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Loader2Icon} from "lucide-react";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";


const baseUrl = "http://localhost:8080";

export function RegisterForm({
                                 className,
                                 ...props
                             }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        setError(null);
        setPasswordError(null);

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/user/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    user_email: email,
                    user_pwd: password,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Registration successful! Please log in.');
                navigate("/login");
                // Optionally redirect or show success
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to register an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                {passwordError && (
                                    <div className="text-red-500 text-sm mt-1">{passwordError}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2Icon className="animate-spin mr-2"/>}
                                    {loading ? "Please wait..." : "Register"}
                                </Button>
                                {error && (
                                    <div className="text-red-500 text-sm text-center">{error}</div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
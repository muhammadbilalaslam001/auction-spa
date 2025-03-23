import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data.name, data.email, data.password);
      toast.success("Account created! Please log in.");
      setLocation("/login");
    } catch (error:any) {
      if (error?.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Request failed with status code 400";
        setError("email", { type: "manual", message: errorMessage });
        toast.error(errorMessage);
      } else {
        toast.error(error.message || "Error creating account");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 shadow-lg rounded-lg p-6 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div>
              <Input {...formRegister("name")} placeholder="Full Name" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Input {...formRegister("email")} placeholder="Email" type="email" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Input {...formRegister("password")} placeholder="Password" type="password" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full  text-white py-2 rounded-md" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setLocation("/login")}>Login</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;

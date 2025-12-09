import { SignIn } from "@clerk/clerk-react";
import { Lock } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-full mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
      </div>
      <SignIn />
    </div>
  );
};

export default Login;

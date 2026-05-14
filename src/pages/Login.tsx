import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      addToast(`Welcome back to TaskVerify!`, 'success');
      navigate('/');
    } catch (error: any) {
      addToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-50 opacity-60 blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50 opacity-50 blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Access your national economic identity</p>
        </div>

        <Card className="border-none shadow-2xl shadow-navy-100/50 rounded-3xl overflow-hidden">
          <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-bold text-navy-900 text-center">Ecosystem Login</CardTitle>
              <CardDescription className="text-sm font-medium text-center">Enter your credentials to access your secure hub.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-navy-900 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-emerald-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="font-bold text-navy-900">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-emerald-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link to="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-500">Forgot Password?</Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-base shadow-lg shadow-navy-200"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
              
              <p className="text-center text-sm text-slate-500 mt-4 font-medium">
                Don't have an account? <Link to="/signup" className="text-navy-900 font-black hover:underline underline-offset-4">Create an Identity</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

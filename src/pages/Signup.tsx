import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Briefcase,
  Store,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useApp } from '../context/AppContext';

export default function Signup() {
  const [role, setRole] = useState<'worker' | 'buyer'>('worker');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addToast } = useApp();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password || !formData.phone) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: role
      });
      addToast(`Account created! Welcome to TaskVerify.`, 'success');
      navigate('/');
    } catch (error: any) {
      addToast(error.message || 'Account creation failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-50 opacity-60 blur-3xl -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-50 opacity-50 blur-3xl translate-x-1/4 translate-y-1/4" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-navy-100/50 rounded-[2.5rem] overflow-hidden">
          <div className="grid md:grid-cols-5 h-full">
            {/* Left Info Panel */}
            <div className="md:col-span-2 bg-navy-950 p-8 text-white hidden md:flex flex-col justify-between">
              <div>
                <Link to="/" className="inline-flex items-center gap-2 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-black tracking-tight">TASKVERIFY</span>
                </Link>
                <h2 className="text-2xl font-bold leading-tight mb-6">Start your journey to economic formalization.</h2>
                <ul className="space-y-4">
                  {[
                    'AI-powered matching',
                    'Verifiable trust score',
                    'Squad-secured escrow',
                    'Alternative credit access'
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-3 text-slate-300 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-10 border-t border-white/10">
                <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                  "TaskVerify has changed how I access work. My trust score is now my most valuable asset."
                </p>
                <p className="text-[10px] text-emerald-400 font-bold mt-2">— Musa K., Verified Artisan</p>
              </div>
            </div>

            {/* Right Signup Form */}
            <div className="md:col-span-3 p-8 md:p-10 bg-white">
              <div className="mb-8">
                <h1 className="text-2xl font-black text-navy-900 tracking-tight">Create Identity</h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">Join the national economic ecosystem.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    role === 'worker' 
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Briefcase className={`w-6 h-6 ${role === 'worker' ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">I'm a Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    role === 'buyer' 
                    ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  <Store className={`w-6 h-6 ${role === 'buyer' ? 'text-blue-500' : 'text-slate-300'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider">I'm a Buyer</span>
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-bold text-navy-900 ml-1">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      id="full_name" 
                      placeholder="John Doe" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-navy-900 ml-1">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-navy-900 ml-1">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="phone" 
                        placeholder="+234..." 
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-navy-900 ml-1">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="password" 
                        type="password" 
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-navy-900 ml-1">Confirm</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        className="pl-10 h-11 rounded-xl border-slate-200"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className={`w-full h-12 rounded-xl text-white font-bold text-base shadow-lg transition-all ${
                      role === 'worker' 
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-6 font-medium px-4">
                  By signing up, you agree to our <span className="text-navy-900 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-navy-900 font-bold underline cursor-pointer">Privacy Policy</span>.
                </p>

                <div className="text-center pt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Already part of the ecosystem? <Link to="/login" className="text-navy-900 font-black hover:underline underline-offset-4">Log in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

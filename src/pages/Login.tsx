import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await login(identifier, password);

    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
      navigate('/');
    } else {
      toast({
        title: 'Login failed',
        description: result.message || 'Invalid credentials.',
        variant: 'destructive'
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse" />

      <div className="w-full max-w-[450px] relative z-10 px-4">
        {/* Curved Header Section - Blue Theme */}
        <div className="bg-[#2563EB] rounded-t-[40px] pt-12 pb-24 relative overflow-hidden flex flex-col items-center">
          {/* Shapes inside header */}
          <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-white/10 rounded-full" />

          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-6 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-12 mb-4">
            <Link to="/signup" className="text-white/50 hover:text-white/80 transition-colors font-bold text-lg">Sign Up</Link>
            <div className="relative">
              <span className="text-white font-bold text-lg">Sign In</span>
              <div className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[40px] px-8 pt-10 pb-8 mt-[-60px] shadow-2xl shadow-blue-900/10">
          <h2 className="text-2xl font-black text-[#2563EB] text-center mb-8">Welcome Back !</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl focus-within:border-[#2563EB] transition-all h-14 px-4 shadow-sm">
                <User className="h-5 w-5 text-[#2563EB] mr-3" />
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="w-full h-full bg-transparent outline-none text-[#2563EB] font-medium placeholder:text-slate-400"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl focus-within:border-[#2563EB] transition-all h-14 px-4 shadow-sm">
                <Lock className="h-5 w-5 text-[#2563EB] mr-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full h-full bg-transparent outline-none text-[#2563EB] font-medium placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-[#2563EB]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 border-2 border-slate-300 rounded group-hover:border-[#2563EB] transition-colors" />
                <span className="text-xs font-bold text-slate-500">Remember Password</span>
              </label>
              <Link to="#" className="text-xs font-bold text-red-500 hover:text-red-600">Forgot Password?</Link>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        {/* Footer Curve Decoration */}
        <div className="mt-8 flex justify-center">
          <div className="w-[120px] h-[6px] bg-[#2563EB]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;

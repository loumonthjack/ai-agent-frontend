import React, { useState } from 'react';
import { useAuth } from '../contexts/Auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-2xl rotate-12 blur-sm"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-20 right-16 w-40 h-40 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-3xl -rotate-12 blur-sm"></div>
        <div className="absolute bottom-32 right-32 w-28 h-28 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-2xl rotate-45 blur-sm"></div>
        
        {/* Linear gradient lines */}
        <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-transparent via-blue-200/40 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-purple-200/40 to-transparent"></div>
        <div className="absolute left-0 top-1/3 w-full h-1 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent"></div>
        <div className="absolute left-0 bottom-1/4 w-full h-1 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent"></div>
        
        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px, 80px 80px'
        }}></div>
        
        {/* Mesh gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent via-purple-50/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-50/20 via-transparent via-cyan-50/20 to-transparent"></div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative z-10 ring-1 ring-white/20">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-3xl font-light text-slate-800 tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-500 text-lg font-light">
              Sign in to continue
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 tracking-wide">
                  Email address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-0 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 tracking-wide">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-0 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl text-slate-800 placeholder:text-slate-400 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50/80 border border-red-100 rounded-xl p-4 backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:transform-none group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;

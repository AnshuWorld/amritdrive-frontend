import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HardDrive, 
  Shield, 
  Share2, 
  FolderSync, 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg transform transition-transform hover:rotate-12">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">File-Store</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md active:scale-95">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white -z-10" />
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
            <Zap className="w-4 h-4" />
            <span>Now with lightning-fast uploads</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            The secure home for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              all your data
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
            Securely store, organize, and share your files from anywhere. Experience lightning-fast speeds with peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center group">
              Start for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md">
              Sign into account
            </Link>
          </div>
        </div>

        {/* Mockup Image Area */}
        <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white p-2 rounded-2xl md:rounded-[2rem] shadow-2xl border border-gray-200/50 transform tilt-in">
            <div className="w-full bg-gray-50 rounded-xl md:rounded-[1.5rem] border border-gray-100 overflow-hidden flex flex-col h-[400px] md:h-[600px] relative">
              {/* Mockup header */}
              <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              {/* Mockup content */}
              <div className="flex flex-1 p-6 gap-6">
                 <div className="hidden md:block w-48 bg-gray-100/50 rounded-lg p-4 space-y-3">
                   <div className="h-8 bg-blue-100 rounded-md w-full" />
                   <div className="h-8 bg-gray-200/50 rounded-md w-3/4" />
                   <div className="h-8 bg-gray-200/50 rounded-md w-5/6" />
                 </div>
                 <div className="flex-1 space-y-4">
                   <div className="flex justify-between items-center mb-6">
                     <div className="h-6 w-32 bg-gray-200 rounded-md" />
                     <div className="h-8 w-24 bg-blue-600 rounded-lg" />
                   </div>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="aspect-square bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                           <div className="w-12 h-12 bg-blue-100 rounded-lg" />
                           <div className="h-3 w-16 bg-gray-200 rounded-full" />
                        </div>
                     ))}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need to work efficiently</h2>
            <p className="text-lg text-gray-600">Built to provide a seamless file management experience from top to bottom.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Bank-level Security',
                desc: 'Your files are encrypted in transit and at rest. Rest easy knowing your digital life is secure.'
              },
              {
                icon: Share2,
                title: 'Seamless Sharing',
                desc: 'Create secure sharing links for files and folders. Revoke access at any time with a single click.'
              },
              {
                icon: FolderSync,
                title: 'Stay Organized',
                desc: 'Deeply nested folders, intelligent search, and an intuitive UI to keep your workspace tidy.'
              },
              {
                icon: Globe,
                title: 'Access Anywhere',
                desc: 'Access your files across all your devices. Responsive design ensures it works beautifully on mobile.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Optimized infrastructure guarantees fast uploads and instantaneous downloads of your files.'
              },
              {
                icon: CheckCircle2,
                title: 'Easy to Use',
                desc: 'Familiar operating-system like controls mean zero learning curve for you or your team.'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white border text-left border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gray-50 border-t border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Designed for <br/> <span className="text-blue-600">maximum productivity</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stop wrestling with bloated software. File-Store is relentlessly focused on speed and simplicity, giving you back time to focus on what matters.
              </p>
              <ul className="space-y-5">
                {[
                  'Zero learning curve with native-feeling interfaces',
                  'Frictionless drag & drop file uploads',
                  'Granular control over public sharing links'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-gray-700 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link to="/register" className="inline-flex text-blue-600 font-bold text-lg items-center hover:text-blue-800 transition-colors group">
                  See how it works 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] transform rotate-3 scale-105 opacity-10" />
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative z-10">
                <div className="space-y-6">
                   {/* Abstracted List of Files */}
                   {[1,2,3,4].map(i => (
                     <div key={i} className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/50 transition-all cursor-pointer">
                       <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                         {i % 2 === 0 ? <HardDrive className="text-blue-600 w-6 h-6" /> : <FolderSync className="text-blue-600 w-6 h-6" />}
                       </div>
                       <div className="flex-1">
                         <div className="h-4 bg-gray-200 rounded text-sm w-1/3 mb-2" />
                         <div className="h-3 bg-gray-100 rounded text-xs w-1/4" />
                       </div>
                       <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                         <Share2 className="w-4 h-4 text-gray-400" />
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Bottom CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600" />
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-blue-600 to-blue-900" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)' }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to declutter your digital life?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join today and experience the easiest way to store, organize, and share your files online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:shadow-xl hover:scale-105 transition-all w-full sm:w-auto shadow-lg">
              Create Free Account
            </Link>
            <Link to="/login" className="bg-blue-700 border border-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center flex-col md:flex-row gap-6">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">File-Store</span>
            </div>
            <p className="text-gray-400 text-sm border-t border-gray-800 md:border-none pt-4 md:pt-0">
              © {new Date().getFullYear()} File-Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

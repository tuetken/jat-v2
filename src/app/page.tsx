import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'JAT - Job Application Tracker',
  description: 'Track your job applications efficiently and land your dream job.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="border-b border-zinc-200 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="font-bold text-xl text-zinc-900">JAT</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[100vh] flex flex-col justify-end pb-32 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/hero.jpeg" 
              alt="Background" 
              fill 
              className="object-cover object-top" 
              priority
            />
            
            {/* Seamless Bottom Gradient Fade to White */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
                Your job search, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  organized & simplified.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Stop using spreadsheets. Track applications, manage interviews, and analyze your progress with the tool designed for modern job seekers.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started for Free
                </Link>
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 bg-white px-8 text-base font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 text-zinc-900"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white border-t border-transparent relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Everything you need to succeed</h2>
              <p className="text-zinc-600 max-w-2xl mx-auto">
                Built to replace your messy spreadsheet with a purpose-built application tracker.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-4"/><path d="M8 18v-2"/><path d="M16 18v-6"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">Centralized Tracking</h3>
                <p className="text-zinc-600">
                  Keep all your applications, contacts, and job descriptions in one searchable, organized dashboard.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
                <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">Status Management</h3>
                <p className="text-zinc-600">
                  Visualize your pipeline. Know exactly which applications are active, interviewing, or require follow-up.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">Secure & Private</h3>
                <p className="text-zinc-600">
                  Your data is yours. Enterprise-grade security ensures your job search activity stays private.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-zinc-200 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-zinc-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">J</span>
            </div>
            <span className="font-semibold text-zinc-900">JAT</span>
          </div>
          
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Job Application Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

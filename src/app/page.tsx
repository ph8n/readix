import { Button } from "@/components/ui/button"
import Link from 'next/link';

export default function HomePage() {

  return (
    <main className="min-h-screen paper-texture flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Hero Section with generous whitespace */}
          <div className="space-y-8">
            {/* App Name - Large serif heading */}
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-light tracking-wide text-balance">
              Readix
            </h1>

            {/* Function Description - Clean sans-serif */}
            <p className="font-sans text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
              read better
            </p>

            {/* Optional feature list - minimal */}
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground font-light">
              <span>Upload</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span>Read</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span>Ask</span>
            </div>
          </div>

          {/* CTA Button - Ghost style with soft hover */}
          <div className="pt-8">
            <Link href="/dashboard" passHref>
              <Button
                variant="ghost"
                size="lg"
                className="font-sans text-lg px-12 py-6 border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-lg shadow-sm hover:shadow-md"
              >
                Enter Library
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="pb-6 text-center">
        <p className="font-sans text-xs text-muted-foreground/60 font-light tracking-wider">by phong do</p>
      </footer>
    </main>
  )
}
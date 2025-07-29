'use client';


export function DemoVideo() {

  return (
    <section className="py-16 sm:py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin mb-6 tracking-tight">
            See SandPix in Action
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
            The fastest way to create landing pages. 
            <br className="hidden sm:block" />
            Swipe through designs, customize instantly, publish immediately.
          </p>
        </div>

        {/* Video Container - SandPix Brand Design */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 p-[2px] group shadow-2xl">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden relative">
              {/* Responsive aspect ratio container for horizontal video */}
              <div className="relative aspect-video w-full mx-auto p-4 sm:p-6 md:p-8">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/4UK_pA4Pt_c?autoplay=1&mute=1&loop=1&playlist=4UK_pA4Pt_c&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
                  title="SandPix Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              
              {/* YouTube Demo Label */}
              <div className="absolute bottom-4 right-4">
                <div className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  SandPix Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
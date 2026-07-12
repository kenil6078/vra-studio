import React from 'react'
import FlowingMenu from '../FlowingMenu/FlowingMenu'

const footerItems = [
  { link: '/studio', text: 'Studio', image: 'https://picsum.photos/600/400?grayscale&random=201' },
  { link: '/about', text: 'About', image: 'https://picsum.photos/600/400?grayscale&random=202' },
  { link: '/journal', text: 'Journal', image: 'https://picsum.photos/600/400?grayscale&random=203' },
  { link: '/contact', text: 'Contact', image: 'https://picsum.photos/600/400?grayscale&random=204' }
]

const Footer = () => {
  return (
    <footer className="w-full relative z-10 mt-auto border-t border-white/5 bg-transparent">
      {/* 4-Item Flowing Marquee Menu */}
      <div className="h-[220px] md:h-[260px] w-full">
        <FlowingMenu
          items={footerItems}
          speed={12}
          textColor="rgba(255, 255, 255, 0.45)"
          bgColor="transparent"
          marqueeBgColor="#ffffff"
          marqueeTextColor="#000000"
          borderColor="rgba(255, 255, 255, 0.05)"
        />
      </div>

      {/* Footer Bottom Metadata Capsule */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-mono">
        <div>
          © {new Date().getFullYear()} VRA-STUDIO®. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors duration-300">TWITTER</a>
          <a href="#" className="hover:text-foreground transition-colors duration-300">INSTAGRAM</a>
          <a href="#" className="hover:text-foreground transition-colors duration-300">LINKEDIN</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import InfiniteMenu from '../components/InfiniteMenu/InfiniteMenu'

const items = [
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    link: 'https://google.com/',
    title: 'The Art of Digital Silence',
    description: 'Exploring how minimizing cognitive load in design fosters greater creativity and concentration.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    link: 'https://google.com/',
    title: 'Interactive WebGL & Attention',
    description: 'Finding the balance between engaging interactive physics and distracting visual clutter.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    link: 'https://google.com/',
    title: 'Designing Beyond the Screen',
    description: 'How spatial interfaces, typography, and contrast shape the workflow of next-generation developers.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=4',
    link: 'https://google.com/',
    title: 'Cognitive Architecture in Minimal UI',
    description: 'Building software tools that respect human attention limits and enhance developer throughput.'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=5',
    link: 'https://google.com/',
    title: 'The Aesthetics of Simplicity',
    description: 'Why visual clarity, dark modes, and high-fidelity typography create professional environments.'
  }
]

const Journal = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Floating Top Header Overlay */}
      <div className="absolute top-28 left-0 right-0 z-20 pointer-events-none text-center px-4 animate-fade-rise">
        <div className="inline-block bg-black/30 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 shadow-2xl pointer-events-auto">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium mr-2">
            Insights
          </span>
          <span className="text-sm font-display text-foreground border-l border-white/10 pl-2">
            The Journal
          </span>
        </div>
      </div>

      {/* Full Viewport 3D WebGL Canvas */}
      <div className="w-full h-full absolute inset-0 z-0">
        <InfiniteMenu items={items} scale={1.0} />
      </div>
    </div>
  )
}

export default Journal

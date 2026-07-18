import React from 'react'
import ChromaGrid from '../components/ChromaGrid/ChromaGrid'

const items = [
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    title: 'The Art of Digital Silence',
    subtitle: 'Exploring how minimizing cognitive load in design fosters greater creativity and concentration.',
    handle: '@silence',
    borderColor: '#A8864F',
    gradient: 'linear-gradient(180deg, #A8864F, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    title: 'WebGL Physics & Attention',
    subtitle: 'Finding the balance between engaging interactive physics and distracting visual clutter.',
    handle: '@physics',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(180deg, #3B82F6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    title: 'Designing Beyond Screen',
    subtitle: 'How spatial interfaces, typography, and contrast shape the workflow of next-generation developers.',
    handle: '@spatial',
    borderColor: '#10B981',
    gradient: 'linear-gradient(180deg, #10B981, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=4',
    title: 'Cognitive UI Architecture',
    subtitle: 'Building software tools that respect human attention limits and enhance developer throughput.',
    handle: '@cognition',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(180deg, #EF4444, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=5',
    title: 'Aesthetics of Simplicity',
    subtitle: 'Why visual clarity, dark modes, and high-fidelity typography create professional environments.',
    handle: '@simplicity',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(180deg, #8B5CF6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    title: 'The Art of Digital Silence',
    subtitle: 'Exploring how minimizing cognitive load in design fosters greater creativity and concentration.',
    handle: '@silence',
    borderColor: '#A8864F',
    gradient: 'linear-gradient(180deg, #A8864F, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    title: 'WebGL Physics & Attention',
    subtitle: 'Finding the balance between engaging interactive physics and distracting visual clutter.',
    handle: '@physics',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(180deg, #3B82F6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    title: 'Designing Beyond Screen',
    subtitle: 'How spatial interfaces, typography, and contrast shape the workflow of next-generation developers.',
    handle: '@spatial',
    borderColor: '#10B981',
    gradient: 'linear-gradient(180deg, #10B981, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=4',
    title: 'Cognitive UI Architecture',
    subtitle: 'Building software tools that respect human attention limits and enhance developer throughput.',
    handle: '@cognition',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(180deg, #EF4444, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=5',
    title: 'Aesthetics of Simplicity',
    subtitle: 'Why visual clarity, dark modes, and high-fidelity typography create professional environments.',
    handle: '@simplicity',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(180deg, #8B5CF6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    title: 'The Art of Digital Silence',
    subtitle: 'Exploring how minimizing cognitive load in design fosters greater creativity and concentration.',
    handle: '@silence',
    borderColor: '#A8864F',
    gradient: 'linear-gradient(180deg, #A8864F, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    title: 'WebGL Physics & Attention',
    subtitle: 'Finding the balance between engaging interactive physics and distracting visual clutter.',
    handle: '@physics',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(180deg, #3B82F6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    title: 'Designing Beyond Screen',
    subtitle: 'How spatial interfaces, typography, and contrast shape the workflow of next-generation developers.',
    handle: '@spatial',
    borderColor: '#10B981',
    gradient: 'linear-gradient(180deg, #10B981, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=4',
    title: 'Cognitive UI Architecture',
    subtitle: 'Building software tools that respect human attention limits and enhance developer throughput.',
    handle: '@cognition',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(180deg, #EF4444, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=5',
    title: 'Aesthetics of Simplicity',
    subtitle: 'Why visual clarity, dark modes, and high-fidelity typography create professional environments.',
    handle: '@simplicity',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(180deg, #8B5CF6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=1',
    title: 'The Art of Digital Silence',
    subtitle: 'Exploring how minimizing cognitive load in design fosters greater creativity and concentration.',
    handle: '@silence',
    borderColor: '#A8864F',
    gradient: 'linear-gradient(180deg, #A8864F, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=2',
    title: 'WebGL Physics & Attention',
    subtitle: 'Finding the balance between engaging interactive physics and distracting visual clutter.',
    handle: '@physics',
    borderColor: '#3B82F6',
    gradient: 'linear-gradient(180deg, #3B82F6, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=3',
    title: 'Designing Beyond Screen',
    subtitle: 'How spatial interfaces, typography, and contrast shape the workflow of next-generation developers.',
    handle: '@spatial',
    borderColor: '#10B981',
    gradient: 'linear-gradient(180deg, #10B981, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=4',
    title: 'Cognitive UI Architecture',
    subtitle: 'Building software tools that respect human attention limits and enhance developer throughput.',
    handle: '@cognition',
    borderColor: '#EF4444',
    gradient: 'linear-gradient(180deg, #EF4444, #000000)',
    url: 'https://google.com/'
  },
  {
    image: 'https://picsum.photos/600/600?grayscale&random=5',
    title: 'Aesthetics of Simplicity',
    subtitle: 'Why visual clarity, dark modes, and high-fidelity typography create professional environments.',
    handle: '@simplicity',
    borderColor: '#8B5CF6',
    gradient: 'linear-gradient(180deg, #8B5CF6, #000000)',
    url: 'https://google.com/'
  }
]

const Journal = () => {
  return (
    <div className="relative w-full min-h-screen pt-40 pb-20 overflow-y-auto bg-transparent">
      {/* Floating Top Header Overlay */}
      <div className="relative z-20 text-center px-4 animate-fade-rise mb-12">
        <div className="inline-block bg-black/30 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 shadow-2xl pointer-events-auto">
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium mr-2">
            Insights
          </span>
          <span className="text-sm font-display text-foreground border-l border-white/10 pl-2">
            The Journal
          </span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <ChromaGrid
          items={items}
          radius={320}
          columns={3}
          rows={2}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>
    </div>
  )
}

export default Journal

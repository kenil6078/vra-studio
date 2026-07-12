import React, { useState } from 'react'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.name && form.email && form.message) {
      setSubmitted(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  return (
    <div className="relative min-h-screen pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto space-y-8 animate-fade-rise">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Get In Touch
          </span>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.0] tracking-tight font-display"
          >
            Reach <em className="not-italic text-muted-foreground">Us</em>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Let's build something silent, pure, and exceptional together.
          </p>
        </div>

        {submitted ? (
          <div className="liquid-glass rounded-3xl text-center animate-fade-rise shadow-xl">
            <div className="p-6 md:p-8 space-y-3">
              <h3 className="text-xl font-medium text-foreground">Journey Initiated</h3>
              <p className="text-sm text-muted-foreground">
                Thank you for reaching out. We will connect with you through the silence shortly.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="liquid-glass rounded-3xl shadow-2xl">
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/20"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/20"
                  placeholder="you@domain.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all duration-300 placeholder-white/20 resize-none"
                  placeholder="What dreams rise today?"
                />
              </div>

              <button
                type="submit"
                className="w-full liquid-glass rounded-full py-4 text-sm font-semibold text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer border-none shadow-[0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]"
              >
                Send Dispatch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Contact

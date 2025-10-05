if (typeof window !== 'undefined') {
  const originalWarn = console.warn
  const originalError = console.error
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.warn = (...args: any[]) => {
    const msg = args[0]?.toString?.() || ''
    if (msg.includes('css` function is deprecated')) return
    if (msg.includes('styleFunctionSx')) return
    originalWarn(...args)
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = (...args: any[]) => {
    const msg = args[0]?.toString?.() || ''
    if (msg.includes('css` function is deprecated')) return
    if (msg.includes('styleFunctionSx')) return
    originalError(...args)
  }
}

export {}

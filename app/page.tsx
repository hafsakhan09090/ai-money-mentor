@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}

@layer utilities {
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
}

/* Premium Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-800 rounded-full;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-500 to-purple-500 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gradient-to-b from-blue-600 to-purple-600;
}

/* Smooth Transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Glassmorphism Effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #a855f7, #ec489a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Animated Border */
.animated-border {
  position: relative;
  background: linear-gradient(60deg, #3b82f6, #8b5cf6, #ec489a);
  background-size: 300% 300%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

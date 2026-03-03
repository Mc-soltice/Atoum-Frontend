// components/ui/Animated.tsx
interface AnimatedProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'slideInRight' | 'fadeIn' | 'slideUp' | 'bounceIn' | 'pulseOnce';
}

export function Animated({ children, delay = 0, type = 'fadeIn' }: AnimatedProps) {
  const animations = {
    slideInRight: { animation: "slideInRight 0.3s ease-out forwards" },
    fadeIn: { animation: "fadeIn 0.5s ease-out forwards" },
    slideUp: { animation: "slideUp 0.4s ease-out forwards" },
    bounceIn: { animation: "bounceIn 0.5s ease-out" },
    pulseOnce: { animation: "pulseOnce 0.5s ease-in-out" },
  };

  return (
    <div
      style={{
        ...animations[type],
        opacity: 0,
        animationDelay: `${delay}s`,
        animationFillMode: "forwards"
      }}
    >
      {children}
    </div>
  );
}
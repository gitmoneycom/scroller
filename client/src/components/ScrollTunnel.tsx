import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function TypographyTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 35,
    restDelta: 0.001,
  });

  // World fade in
  const worldOpacity = useTransform(smoothProgress, [0, 0.05], [0, 1]);
  
  // Transition between Initial ACT and Tunnel ACT
  const fontStyle = useTransform(smoothProgress, [0.05, 0.15], ["normal", "italic"]);
  const skewX = useTransform(smoothProgress, [0.05, 0.15], [0, -10]);
  const actScaleX = useTransform(smoothProgress, [0.05, 0.25], [1, 4.5]); // More horizontal scale
  const actScaleY = useTransform(smoothProgress, [0.05, 0.25], [1, 1.5]); // More vertical scale
  
  // Split movement
  const actSplitY = useTransform(smoothProgress, [0.15, 0.35], [0, 48]); // vh
  const actRotationX = useTransform(smoothProgress, [0.15, 0.35], [0, 45]); // Less tilt for legibility
  const actTranslateZ = useTransform(smoothProgress, [0.05, 0.35], [-3500, -500]);

  // Environmental transitions
  const fogOpacity = useTransform(smoothProgress, [0.45, 0.8], [0, 1]);
  const cameraZ = useTransform(smoothProgress, [0.35, 1], [0, 15000]);

  return (
    <div ref={containerRef} className="h-[600vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1500px] bg-black">
        
        {/* Red Depth Fog */}
        <motion.div 
          className="absolute inset-0 z-40 pointer-events-none"
          style={{
            opacity: fogOpacity,
            background: 'radial-gradient(circle at center, transparent 10%, rgba(180, 0, 0, 0.4) 60%, rgba(30, 0, 0, 0.9) 100%)',
          }}
        />

        {/* --- MAIN 3D WORLD --- */}
        <motion.div 
          className="relative w-full h-full preserve-3d"
          style={{ translateZ: cameraZ, opacity: worldOpacity }}
        >
          {/* Repeating Tunnel Segments - Fewer segments for clarity */}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute inset-0 preserve-3d" style={{ transform: `translateZ(${-i * 2000}px)` }}>
              
              {/* Ceiling ACT */}
              <motion.div 
                className="absolute top-1/2 left-[-100%] w-[300%] h-fit flex items-center justify-center pointer-events-none"
                style={{ 
                  originY: "bottom",
                  y: useTransform(actSplitY, (v) => `-${v}vh`),
                  rotateX: useTransform(actRotationX, (v) => -v),
                  scaleX: actScaleX,
                  scaleY: actScaleY,
                  skewX: skewX,
                  translateZ: actTranslateZ,
                  translateY: "-50%",
                  opacity: i === 0 ? 1 : useTransform(smoothProgress, [0.3, 0.4], [0, 1])
                }}
              >
                <motion.div 
                  className="text-[25vh] font-display text-white tracking-[-0.1em] uppercase select-none antialiased blur-[0.3px]"
                  style={{ fontStyle }}
                >
                  ACT
                </motion.div>
              </motion.div>

              {/* Floor ACT */}
              <motion.div 
                className="absolute top-1/2 left-[-100%] w-[300%] h-fit flex items-center justify-center pointer-events-none"
                style={{ 
                  originY: "top",
                  y: useTransform(actSplitY, (v) => `${v}vh`),
                  rotateX: useTransform(actRotationX, (v) => v),
                  scaleX: actScaleX,
                  scaleY: actScaleY,
                  skewX: skewX,
                  translateZ: actTranslateZ,
                  translateY: "-50%",
                  opacity: i === 0 ? 1 : useTransform(smoothProgress, [0.3, 0.4], [0, 1])
                }}
              >
                <motion.div 
                  className="text-[25vh] font-display text-white tracking-[-0.1em] uppercase select-none antialiased blur-[0.3px]"
                  style={{ fontStyle }}
                >
                  ACT
                </motion.div>
              </motion.div>
            </div>
          ))}

        </motion.div>

        {/* Depth Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] z-50" />
      </div>
    </div>
  );
}

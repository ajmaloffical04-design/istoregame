"use client";

import { useState } from "react";
import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";

interface Phone3DProps {
  sceneUrl: string;
  fallbackIcon: string;
  altText: string;
}

export default function Phone3D({ sceneUrl, fallbackIcon, altText }: Phone3DProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="text-6xl" title={altText}>
          {fallbackIcon}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <Spline
            scene={sceneUrl}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

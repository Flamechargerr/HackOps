
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const ProgressiveImage = ({
  src,
  placeholderSrc,
  alt,
  className,
  containerClassName,
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={cn("progressive-image-container relative overflow-hidden", containerClassName)}>
      {placeholderSrc && (
        <img
          src={placeholderSrc}
          alt={alt}
          className="progressive-image-placeholder w-full h-full object-cover"
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "progressive-image-full w-full h-full object-cover",
          isLoaded && "loaded",
          className
        )}
      />
    </div>
  );
};

export default ProgressiveImage;

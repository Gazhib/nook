import { useEffect, useState } from "react";

/**
 * Loads the SVG illustration for a furniture `type` from `/svgs/<type>.svg`.
 * Returns the HTMLImageElement once loaded so it can be drawn by a Konva Image.
 */
export const useFurnitureImage = (type: string): HTMLImageElement | undefined => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    const img = new window.Image();
    img.src = `/svgs/${type.toLowerCase()}.svg`;

    const handleLoad = () => setImage(img);
    img.addEventListener("load", handleLoad);

    return () => {
      img.removeEventListener("load", handleLoad);
    };
  }, [type]);

  return image;
};

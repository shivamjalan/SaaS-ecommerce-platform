import { useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

/* ===================================================== */
/* ============== FULL-SCREEN IMAGE LIGHTBOX ============ */
/* ===================================================== */

const ImageLightbox = ({
  images,
  index,
  open,
  onClose,
  onIndexChange,
}) => {

  useEffect(() => {

    if (!open) return;

    const handleKey = (e) => {

      if (e.key === "Escape") onClose();

      if (e.key === "ArrowRight") {
        onIndexChange((index + 1) % images.length);
      }

      if (e.key === "ArrowLeft") {
        onIndexChange((index - 1 + images.length) % images.length);
      }

    };

    window.addEventListener("keydown", handleKey);

    document.body.style.overflow = "hidden";

    return () => {

      window.removeEventListener("keydown", handleKey);

      document.body.style.overflow = "";

    };

  }, [open, index, images.length, onClose, onIndexChange]);

  const image = images[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6"
    >

      {/* CLOSE */}

      <button
        onClick={onClose}
        aria-label="Close fullscreen view"
        className="absolute top-5 right-5 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
      >

        <FaTimes size={20} />

      </button>

      {/* PREV / NEXT */}

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(
                (index - 1 + images.length) % images.length
              );
            }}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >

            <FaChevronLeft size={20} />

          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >

            <FaChevronRight size={20} />

          </button>
        </>
      )}

      {/* FULL IMAGE (contain, never cropped) */}

      <motion.img
        key={image}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={image}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg shadow-2xl bg-black"
      />

      {/* COUNTER + THUMBNAILS */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-6 flex flex-col items-center gap-4"
      >

        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/70">

          {index + 1} / {images.length}

        </p>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto max-w-[92vw] pb-2">

            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                className={`rounded-lg overflow-hidden shrink-0 transition ${
                  i === index
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-black"
                    : "opacity-50 hover:opacity-100"
                }`}
              >

                <img
                  src={img}
                  alt=""
                  className="h-14 w-14 object-cover"
                />

              </button>
            ))}

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ImageLightbox;

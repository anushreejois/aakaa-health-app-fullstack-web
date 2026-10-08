import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Small timeout to allow DOM to paint the new route
    setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'auto' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }, 10);
  }, [pathname, hash]);

  return null;
}

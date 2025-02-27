import React, { useEffect, useState } from "react";

const BlogFader = ({ title }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFade(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
    </div>
  );
};

export default BlogFader;

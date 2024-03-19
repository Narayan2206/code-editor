import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="text-white text-center py-6 text-sm bg-black">&copy; {year}. Made by Narayan Pal.</footer>
    </>
  );
}

export default Footer;

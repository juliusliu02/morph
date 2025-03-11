import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-center my-5">
      <small className="text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Julius Liu
      </small>
    </footer>
  );
};

export default Footer;

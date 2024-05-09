import { useState } from "react";
import lightTheme from "../styles/theme.js";

export default function Header() {
  return (
    <header className="bg-[#F6F6F7] flex justify-between px-8 py-6/">
      <div className="flex">
        <img src="home-header.svg" />
        <p className="text-b3-blue font-bold m-4">HOME</p>
      </div>
    </header>
  );
}

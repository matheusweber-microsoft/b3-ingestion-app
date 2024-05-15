import { useState } from "react";
import theme from "../styles/theme.js";

export default function Header() {
  return (
    <header className="flex justify-between px-8 py-2" style={{background: theme.colors.menuBackground, boxShadow: `0 0px 10px -10px ${theme.colors.shadow}`}}>
      <div className="flex">
        <img src="home-header.svg" />
        <p className="font-bold m-4" style={{color: theme.colors.title}}>HOME</p>
      </div>
    </header>
  );
}

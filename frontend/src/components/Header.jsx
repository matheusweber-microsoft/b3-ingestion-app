import { useState } from "react";
<<<<<<< HEAD
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
=======
import lightTheme from '../styles/theme.js';

export default function Header() {
    return (
        <header>
            <div className="header h-6 pt-1">
                <div className="user-info float-right text-xs pr-15" style={{ paddingRight: '15px' }}>
                    <span className="username">Welcome Jade@b3.com.br</span>
                </div>
            </div>
            <div className="divider bg-gray-300 h-0.5"></div>
        </header>
    );
}
>>>>>>> f06a479 (Start)

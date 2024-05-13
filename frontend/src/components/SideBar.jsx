import { Link } from "react-router-dom";

export default function SideBar() {
  return (
    <div className="bg-[#e3e5e7] min-h-screen w-[272px] shadow-md">
      <div className="flex items-center ml-8 my-12">
        <img src="B3-logo.svg" />
        <p className="text-b3-blue font-bold text-lg ml-2">B3 GPT</p>
      </div>
      <div className="h-0.5 w-full bg-[#b2b6bc] shadow-sm mb-8" />
      <Link src="/">
        <div className="border-l-2 border-[#00B0E6] flex my-4 pl-6">
          <img src="menu-pdf.svg" />
          <p className="pl-2 text-[#002C63]">upload document</p>
        </div>
      </Link>
    </div>
  );
}

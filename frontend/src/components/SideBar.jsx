import { Link } from "react-router-dom";
import theme from '../styles/theme.js';

export default function SideBar() {
  return (
    <div className="min-h-screen w-[272px] shadow-md" style={{background: theme.colors.menuBackground}}>
      <div className="flex items-center ml-8 my-12">
        <img src="B3-logo.svg" />
        <p className="font-bold text-lg ml-2" style={{color: theme.colors.title}}>B3 GPT</p>
      </div>
      <div className="h-0.5 w-full bg-[#b2b6bc] shadow-sm mb-8" />
      <div className="flex flex-col justify-center" style={{width: "100%", float:"left"}} >
          <div className="flex flex-row items-center ml-5">
              <div className="flex items-center">
                <Link to="/upload">
                    <img src="menu-pdf.svg" style={{float: 'left'}}/>
                    <p className="pl-2" style={{color: theme.colors.title, float: 'left'}}>Ingestão de Documentos</p>
                </Link>
              </div>
          </div>
          <div className="flex flex-row items-center ml-5 mt-5">
              <div className="flex items-center">
                <Link to="/">
                    <img src="menu-ic.svg" style={{float: 'left'}}/>
                    <p className="pl-2" style={{color: theme.colors.title, float: 'left'}}>Visualizar Documentos</p>
                </Link>
              </div>
          </div>
      </div>
    </div>
  );
}

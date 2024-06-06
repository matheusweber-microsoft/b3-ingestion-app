import { Link } from "react-router-dom";
import theme from '../styles/theme.js';

export default function SideBar() {
  var imageBasePath = window.location.protocol + "//" + window.location.host + "/ingestion/";

  return (
    <div className="min-h-screen w-[272px] shadow-md" style={{background: theme.colors.menuBackground}}>
      <div className="flex items-center ml-8 my-12">
        <img src={imageBasePath+"B3-logo.svg"} alt="B3 Logo" />
        <p className="font-bold text-lg ml-2" style={{color: theme.colors.title}}>B3 GPT</p>
      </div>
      <div className="h-0.5 w-full bg-[#b2b6bc] shadow-sm mb-8" />
      <div className="flex flex-col justify-center" style={{width: "100%", float:"left"}} >
          <div className="flex flex-row items-center ml-5">
              <div className="flex items-center">
                <Link to="/ingestion/upload">
                    <img src={imageBasePath+"plus-ic.svg"} alt="Plus Icon" style={{float: 'left'}}/>
                    <p className="pl-2" style={{color: theme.colors.title, float: 'left'}}>Ingestão de Documentos</p>
                </Link>
              </div>
          </div>
          <div className="flex flex-row items-center ml-5 mt-5">
              <div className="flex items-center">
                <Link to="/ingestion/">
                    <img src={imageBasePath+"menu-ic.svg"} alt="Menu Icon" style={{float: 'left'}}/>
                    <p className="pl-2" style={{color: theme.colors.title, float: 'left'}}>Visualizar Documentos</p>
                </Link>
              </div>
          </div>
      </div>
    </div>
  );
}

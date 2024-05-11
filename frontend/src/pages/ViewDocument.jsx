import DocumentDetails from '../components/DocumentDetails.jsx';
import Header from '../components/Header.jsx';
import Title from '../components/Title.jsx';
import ListPDF from '../components/pagesComponents/ListPDF.jsx';
import lightTheme from '../styles/theme.js';

export default function ViewDocument() {
  return (
    <div style={{ height: "100vh", backgroundColor: lightTheme.colors.background}}>
      <Header />
      <DocumentDetails
        documentTitle="Titulo"
        fileName="Nome do arquivo"
        theme="Tema"
        subtheme="Subtema"
        uploadedDate="2024-05-12"
        expiryDate="2024-06-31"
        uploadedBy="matheus"
      />
      <div style={{ padding: '10px'}}>
        <Title title="Lista de citações" />
      </div>
      <div style={{ padding: '10px'}}>
        <ListPDF />
      </div>
    </div>
  );
}

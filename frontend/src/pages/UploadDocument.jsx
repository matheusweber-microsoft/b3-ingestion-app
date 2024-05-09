import './UploadDocument.css';
import '../styles/theme.js';
import lightTheme from '../styles/theme.js';
import Header from '../components/Header';
import UploadDocumentForm from '../components/UploadDocumentForm';


export default function UploadDocument() {
  return (
    <main style={{
      backgroundColor: lightTheme.colors.background,
    }}>
      <Header />
      <div className="content" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px'  }}>
        < UploadDocumentForm />
      </div>
    </main>
  );
}

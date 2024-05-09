import Title from './Title.jsx';
import { useState } from 'react';
import CustomInput from './CustomInput.jsx';

const UploadDocumentForm = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main>
      <Title title="Upload Document" />
      <form className="flex flex-col space-y-4" style={{ marginTop: '15px', paddingRight: '15px', paddingLeft: '15px' }}>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Document Title:</label>
            <input type="text" id="field2" name="field2" className="border border-gray-300 rounded-md p-1 mt-2" required/>
          </div>
        </div>

        <div className="flex flex-row space-x-4 ">
          <div className="flex flex-col flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Theme:</label>
            <input type="text" id="field2" name="field2" className="border border-gray-300 rounded-md p-2" required/>
          </div>

          <div className="flex flex-col  flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Subtheme:</label>
            <input type="text" id="field3" name="field3" className="border border-gray-300 rounded-md p-2" required/>
          </div>

          <div className="flex flex-col  flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Expiry Date:</label>
            <input type="text" id="field4" name="field4" className="border border-gray-300 rounded-md p-2" required />
          </div>
          <div className="flex flex-col  flex-grow">
            <label htmlFor="field1" className="text-xs font-bold">Language:</label>
            <input type="text" id="field4" name="field4" className="border border-gray-300 rounded-md p-2" required/>
          </div>
        </div>

        <div className="flex flex-col">
        <label htmlFor="field1" className="text-xs font-bold">File:</label>
          <input type="file" id="file" name="file" className="border border-gray-300 rounded-md p-2" required/>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
      </form>
    </main>
  );
}

export default UploadDocumentForm;

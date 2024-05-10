import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documentTitle: '',
  fileName: '',
  uploadDate: '',
  expiredOnly: false,
  selectedThemeId: null,
  selectedSubThemeId: null
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setDocumentTitle(state, action) {
      state.documentTitle = action.payload;
    },
    setFileName(state, action) {
      state.fileName = action.payload;
    },
    setUploadDate(state, action) {
      state.uploadDate = action.payload;
    },
    setExpiredOnly(state, action) {
      state.expiredOnly = action.payload;
    },
    setSelectedThemeId(state, action) {
      state.selectedThemeId = action.payload;
    },
    setSelectedSubThemeId(state, action) {
      state.selectedSubThemeId = action.payload;
    }
  }
});

export const {
  setDocumentTitle,
  setFileName,
  setUploadDate,
  setExpiredOnly,
  setSelectedThemeId,
  setSelectedSubThemeId
} = filtersSlice.actions;

export default filtersSlice.reducer;

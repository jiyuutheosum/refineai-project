import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  resumeSections: [],
  originalSections: [],
  feedbackItems: [],
  isSidebarOpen: false,
  showComparison: false,
  autoSaveStatus: 'saved',
  lastSaved: null,
  status: 'idle',
  error: null
}

const manualEditorSlice = createSlice({
  name: 'manualEditor',
  initialState,
  reducers: {
    setResumeSections: (state, action) => {
      state.resumeSections = action.payload
    },
    updateSectionContent: (state, action) => {
      const { sectionId, newContent } = action.payload
      const section = state.resumeSections.find(s => s.id === sectionId)
      if (section) {
        section.content = newContent
      }
    },
    deleteSection: (state, action) => {
      const sectionId = action.payload
      state.resumeSections = state.resumeSections.filter(s => s.id !== sectionId)
    },
    moveSection: (state, action) => {
      const { sectionId, direction } = action.payload
      // implementation
    },
    setAutoSaveStatus: (state, action) => {
      state.autoSaveStatus = action.payload
      if (action.payload === 'saved') {
        state.lastSaved = new Date()
      }
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload
    },
    setShowComparison: (state, action) => {
      state.showComparison = action.payload
    }
  }
})

export const { 
  setResumeSections, 
  updateSectionContent, 
  deleteSection, 
  moveSection, 
  setAutoSaveStatus, 
  setSidebarOpen, 
  setShowComparison 
} = manualEditorSlice.actions
export default manualEditorSlice.reducer


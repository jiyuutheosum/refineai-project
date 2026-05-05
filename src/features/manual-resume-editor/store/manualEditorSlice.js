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
  error: null,
}

const manualEditorSlice = createSlice({
  name: 'manualEditor',
  initialState,
  reducers: {
    setResumeSections(state, action) {
      state.resumeSections = action.payload ?? []
      state.originalSections = action.payload ?? []
    },

    setFeedbackItems(state, action) {
      state.feedbackItems = action.payload ?? []
    },

    updateSectionContent(state, action) {
      const { sectionId, newContent } = action.payload

      const section = state.resumeSections.find(
        (section) => section.id === sectionId
      )

      if (section) {
        section.content = newContent
      }
    },

    deleteSection(state, action) {
      const sectionId = action.payload

      state.resumeSections = state.resumeSections.filter(
        (section) => section.id !== sectionId
      )
    },

    moveSection(state, action) {
      const { sectionId, direction } = action.payload

      const currentIndex = state.resumeSections.findIndex(
        (section) => section.id === sectionId
      )

      if (currentIndex === -1) return

      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (targetIndex < 0 || targetIndex >= state.resumeSections.length) return

      const sections = [...state.resumeSections]
      const [movedSection] = sections.splice(currentIndex, 1)

      sections.splice(targetIndex, 0, movedSection)

      state.resumeSections = sections
    },

    setAutoSaveStatus(state, action) {
      state.autoSaveStatus = action.payload

      if (action.payload === 'saved') {
        state.lastSaved = new Date().toISOString()
      }
    },

    setSidebarOpen(state, action) {
      state.isSidebarOpen = Boolean(action.payload)
    },

    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },

    setShowComparison(state, action) {
      state.showComparison = Boolean(action.payload)
    },

    toggleComparison(state) {
      state.showComparison = !state.showComparison
    },

    resetManualEditor() {
      return initialState
    },
  },
})

export const {
  setResumeSections,
  setFeedbackItems,
  updateSectionContent,
  deleteSection,
  moveSection,
  setAutoSaveStatus,
  setSidebarOpen,
  toggleSidebar,
  setShowComparison,
  toggleComparison,
  resetManualEditor,
} = manualEditorSlice.actions

export default manualEditorSlice.reducer
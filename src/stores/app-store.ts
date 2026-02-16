import { create } from 'zustand'

interface AppState {
  // Navigation state
  showNotifications: boolean
  currentPage: string
  defaultTab: string
  selectedSchoolId: string | null
  selectedStudentId: string | null
  selectedScheduleId: string | null
  
  // Schedule detail metadata (student + site combination)
  selectedScheduleStudentName: string | null
  selectedScheduleSiteName: string | null

  // Leo AI Panel state
  showLeoPanel: boolean
  leoPanelContext: string
  leoInitialQuery: string

  // Actions
  setShowNotifications: (show: boolean) => void
  setCurrentPage: (page: string) => void
  setDefaultTab: (tab: string) => void
  setSelectedSchoolId: (id: string | null) => void
  setSelectedStudentId: (id: string | null) => void
  setSelectedScheduleId: (id: string | null) => void
  setSelectedScheduleStudentName: (name: string | null) => void
  setSelectedScheduleSiteName: (name: string | null) => void
  setShowLeoPanel: (show: boolean) => void
  setLeoPanelContext: (context: string) => void
  setLeoInitialQuery: (query: string) => void
  
  // Navigation actions
  navigateToPage: (page: string) => void
  navigateToLeoAI: () => void
  navigateToHome: () => void
  navigateToSchoolProfile: (schoolId: string) => void
  navigateToStudentProfile: (studentId: string) => void
  navigateBackFromSchoolProfile: () => void
  navigateBackFromStudentProfile: () => void
  navigateToScheduleDetail: (scheduleId: string, studentName?: string, siteName?: string) => void
  navigateBackFromScheduleDetail: () => void
  toggleLeoPanel: () => void
  openLeoPanelWithQuery: (query: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  showNotifications: false,
  currentPage: "Home",
  defaultTab: "pipeline",
  selectedSchoolId: null,
  selectedStudentId: null,
  selectedScheduleId: null,
  selectedScheduleStudentName: null,
  selectedScheduleSiteName: null,
  showLeoPanel: false,
  leoPanelContext: "Home",
  leoInitialQuery: "",

  // Basic setters
  setShowNotifications: (show: boolean) => set({ showNotifications: show }),
  setCurrentPage: (page: string) => set({ currentPage: page }),
  setDefaultTab: (tab: string) => set({ defaultTab: tab }),
  setSelectedSchoolId: (id: string | null) => set({ selectedSchoolId: id }),
  setSelectedStudentId: (id: string | null) => set({ selectedStudentId: id }),
  setSelectedScheduleId: (id: string | null) => set({ selectedScheduleId: id }),
  setSelectedScheduleStudentName: (name: string | null) => set({ selectedScheduleStudentName: name }),
  setSelectedScheduleSiteName: (name: string | null) => set({ selectedScheduleSiteName: name }),
  setShowLeoPanel: (show: boolean) => set({ showLeoPanel: show }),
  setLeoPanelContext: (context: string) => set({ leoPanelContext: context }),
  setLeoInitialQuery: (query: string) => set({ leoInitialQuery: query }),

  // Navigation actions
  navigateToPage: (page: string) => {
    set({ 
      currentPage: page,
      selectedSchoolId: null,
      selectedStudentId: null,
      selectedScheduleId: null,
      selectedScheduleStudentName: null,
      selectedScheduleSiteName: null,
      defaultTab: "pipeline"
    })
  },

  navigateToLeoAI: () => {
    set({ currentPage: "Leo AI" })
  },

  navigateToHome: () => {
    set({ currentPage: "Home" })
  },

  navigateToSchoolProfile: (schoolId: string) => {
    set({ selectedSchoolId: schoolId })
  },

  navigateToStudentProfile: (studentId: string) => {
    set({ selectedStudentId: studentId })
  },

  navigateBackFromSchoolProfile: () => {
    set({ selectedSchoolId: null })
  },

  navigateBackFromStudentProfile: () => {
    set({ selectedStudentId: null })
  },

  navigateToScheduleDetail: (scheduleId: string, studentName?: string, siteName?: string) => {
    set({ 
      selectedScheduleId: scheduleId,
      selectedScheduleStudentName: studentName || null,
      selectedScheduleSiteName: siteName || null
    })
  },

  navigateBackFromScheduleDetail: () => {
    set({ 
      selectedScheduleId: null,
      selectedScheduleStudentName: null,
      selectedScheduleSiteName: null,
    })
  },

  toggleLeoPanel: () => {
    const state = get()
    set({ showLeoPanel: !state.showLeoPanel })
  },

  openLeoPanelWithQuery: (query: string) => {
    set({ showLeoPanel: true, leoInitialQuery: query })
  }
}))
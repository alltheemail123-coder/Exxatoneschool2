import { create } from 'zustand'

interface AppState {
  // Navigation state
  showNotifications: boolean
  currentPage: string
  selectedAvailabilityId: string | null
  defaultTab: string
  selectedRequestId: string | null
  selectedRequestStage: string
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
  setSelectedAvailabilityId: (id: string | null) => void
  setDefaultTab: (tab: string) => void
  setSelectedRequestId: (id: string | null) => void
  setSelectedRequestStage: (stage: string) => void
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
  navigateToAvailabilityDetail: (availabilityId: string) => void
  navigateBackToAvailability: () => void
  navigateToRequestDetail: (requestId: string, stage: string) => void
  navigateBackFromRequestDetail: () => void
  updateRequestStage: (requestId: string, newStage: string) => void
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
  selectedAvailabilityId: null,
  defaultTab: "pipeline",
  selectedRequestId: null,
  selectedRequestStage: "School Request",
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
  setSelectedAvailabilityId: (id: string | null) => set({ selectedAvailabilityId: id }),
  setDefaultTab: (tab: string) => set({ defaultTab: tab }),
  setSelectedRequestId: (id: string | null) => set({ selectedRequestId: id }),
  setSelectedRequestStage: (stage: string) => set({ selectedRequestStage: stage }),
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
      selectedAvailabilityId: null, // Reset when navigating to new page
      selectedRequestId: null,
      selectedSchoolId: null,
      selectedStudentId: null,
      selectedScheduleId: null,
      selectedScheduleStudentName: null,
      selectedScheduleSiteName: null,
      defaultTab: "pipeline"
    })
  },

  navigateToAvailabilityDetail: (availabilityId: string) => {
    set({ 
      selectedAvailabilityId: availabilityId,
      defaultTab: "pipeline" // Default to pipeline when viewing details
    })
  },

  navigateBackToAvailability: () => {
    set({ 
      selectedAvailabilityId: null,
      selectedRequestId: null,
      defaultTab: "pipeline"
    })
  },

  navigateToRequestDetail: (requestId: string, stage: string) => {
    set({ 
      selectedRequestId: requestId,
      selectedRequestStage: stage
    })
  },

  navigateBackFromRequestDetail: () => {
    set({ 
      selectedRequestId: null,
      selectedRequestStage: "School Request"
    })
  },

  updateRequestStage: (requestId: string, newStage: string) => {
    console.log(`Stage updated for request ${requestId} to ${newStage}`)
    set({ selectedRequestStage: newStage })
    // Here you would implement actual stage update logic
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
    const state = get()
    set({ 
      selectedSchoolId: null,
      // Return to previous context
      ...(state.selectedRequestId && { /* stay in request detail */ }),
      ...(state.selectedAvailabilityId && { /* stay in availability detail */ })
    })
  },

  navigateBackFromStudentProfile: () => {
    const state = get()
    set({ 
      selectedStudentId: null,
      // Return to previous context
      ...(state.selectedRequestId && { /* stay in request detail */ }),
      ...(state.selectedAvailabilityId && { /* stay in availability detail */ })
    })
  },

  navigateToScheduleDetail: (scheduleId: string, studentName?: string, siteName?: string) => {
    set({ 
      selectedScheduleId: scheduleId,
      selectedScheduleStudentName: studentName || null,
      selectedScheduleSiteName: siteName || null
    })
  },

  navigateBackFromScheduleDetail: () => {
    const state = get()
    set({ 
      selectedScheduleId: null,
      selectedScheduleStudentName: null,
      selectedScheduleSiteName: null,
      // Return to previous context
      ...(state.selectedRequestId && { /* stay in request detail */ }),
      ...(state.selectedAvailabilityId && { /* stay in availability detail */ })
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
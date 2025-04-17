import { create } from 'zustand'

export const useTableStore = create((set) => ({
  data: [],
  itemsPerPage: 5,
  filterKeys: [],
  searchTerm: '',
  currentPage: 1,

  setData: (data, filterKeys = []) => set({ data, filterKeys }),
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page })
}))

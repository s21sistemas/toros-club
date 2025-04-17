import { create } from 'zustand'
import {
  getPaymentsCheer,
  getPaymentsPlayers,
  getPlayersByTempCat
} from '../api/calendar'

let unsubscribePlayer = null
let unsubscribeChear = null
let unsubscribeFilter = null
export const useCalendarStore = create((set, get) => ({
  players: [],
  cheerleaders: [],

  getDataPaymentsPlayer: async () => {
    return new Promise((resolve, reject) => {
      try {
        if (unsubscribePlayer) {
          unsubscribePlayer()
          unsubscribePlayer = null
        }

        unsubscribePlayer = getPaymentsPlayers((data) => {
          set({ players: data })
          resolve(data)
        })
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  },

  getPlayersByTempCat: async (temporadaId, categoria) => {
    return new Promise((resolve, reject) => {
      try {
        if (unsubscribeFilter) {
          unsubscribeFilter()
          unsubscribeFilter = null
        }

        unsubscribeFilter = getPlayersByTempCat(
          temporadaId,
          categoria,
          (data) => {
            set({ players: data })
            resolve(data)
          }
        )
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  },

  getDataPaymentsCheer: async () => {
    return new Promise((resolve, reject) => {
      try {
        if (!unsubscribeChear) {
          unsubscribeChear = getPaymentsCheer((data) => {
            set({ cheerleaders: data })
            resolve(data)
          })
        } else {
          resolve(get().cheerleaders)
        }
      } catch (error) {
        console.error(error)
        reject(error)
      } finally {
        set({ loading: false })
      }
    })
  }
}))

import { create } from 'zustand'
import { getCheerleaders, getPlayers } from '../api/graficas'
import { mergeMeses } from '../utils/mergeMeses'

export const useGraficaStore = create((set, get) => ({
  chartData: [],

  getDataPlayers: async () => {
    const { unsubscribePlayers } = get()

    if (!unsubscribePlayers) {
      const unsubscribe = await getPlayers((jugadoresPorMes) => {
        const { chartData } = get()
        const combinado = mergeMeses(chartData, jugadoresPorMes)
        set({ chartData: combinado })
      })

      set({ unsubscribePlayers: unsubscribe })
    }
  },

  getDataCheer: async () => {
    const { unsubscribeCheer } = get()

    if (!unsubscribeCheer) {
      const unsubscribe = await getCheerleaders((porristasPorMes) => {
        const { chartData } = get()
        const combinado = mergeMeses(chartData, porristasPorMes)
        set({ chartData: combinado })
      })

      set({ unsubscribeCheer: unsubscribe })
    }
  }
}))

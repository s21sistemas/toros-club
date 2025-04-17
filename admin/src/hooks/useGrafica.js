import { useEffect } from 'react'
import { useGraficaStore } from '../store/useGraficaStore'

export const useGrafica = () => {
  const chartData = useGraficaStore((state) => state.chartData)

  useEffect(() => {
    const {
      getDataPlayers,
      getDataCheer,
      unsubscribePlayers,
      unsubscribeCheer
    } = useGraficaStore.getState()

    getDataPlayers()
    getDataCheer()

    return () => {
      if (unsubscribePlayers) unsubscribePlayers()
      if (unsubscribeCheer) unsubscribeCheer()
    }
  }, [])

  return { chartData }
}

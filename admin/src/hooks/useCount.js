import { useEffect } from 'react'
import { useCheerleaderStore } from '../store/useCheerleaderStore'
import { useBankStore } from '../store/useBankStore'
import { usePlayerStore } from '../store/usePlayerStore'
import { useUserStore } from '../store/useUserStore'

export const useCount = () => {
  const usersCount = useUserStore((state) => state.usersCount)
  const getDataUsers = useUserStore((state) => state.getDataUsers)

  const playersCount = usePlayerStore((state) => state.playersCount)
  const getDataPlayers = usePlayerStore((state) => state.getDataPlayers)

  const cheerleadersCount = useCheerleaderStore(
    (state) => state.cheerleadersCount
  )
  const getDataCheerleaders = useCheerleaderStore(
    (state) => state.getDataCheerleaders
  )

  const banksCount = useBankStore((state) => state.banksCount)
  const getDataBanks = useBankStore((state) => state.getDataBanks)

  useEffect(() => {
    const getUser = async () => await getDataUsers()
    const getPlayer = async () => await getDataPlayers()
    const getCheerleader = async () => await getDataCheerleaders()
    const getBancos = async () => await getDataBanks()

    getUser()
    getPlayer()
    getCheerleader()
    getBancos()
  }, [getDataCheerleaders, getDataBanks, getDataPlayers, getDataUsers])

  return {
    usersCount,
    playersCount,
    cheerleadersCount,
    banksCount
  }
}

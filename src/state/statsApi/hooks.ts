import { updateStatsApiStateData } from './actions'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { AppState } from '../index'
import { useWeb3React } from '@web3-react/core'
import { HttpClient } from './HttpClient'
import { NUCLEUS_VERSION } from 'constants/index'

export function useNucleusState(): AppState['statsApi'] {
  return useAppSelector((state) => state.statsApi.nucleusState)
}

export function useUpdateStatsApiState(): (apiResponse: any) => void {
  const dispatch = useAppDispatch()
  return useCallback((apiResponse: any) => dispatch(updateStatsApiStateData({ apiResponse })), [
    dispatch,
  ])
}

export function useRefreshStatsApiState() {
  const { chainId } = useWeb3React()

  const updateStatsApiState = useUpdateStatsApiState()
  const httpClient = new HttpClient()

  function refreshNucleusState() {
    if(!chainId) return
    const stateUrl = `https://stats.hydrogendefi.xyz/state/?chainID=${chainId}&v=${NUCLEUS_VERSION}`
    httpClient.get(stateUrl, false).then((nucleusState:any) => {
      nucleusState.chainId = chainId
      updateStatsApiState(nucleusState)
    })
  }

  return useCallback(() => {
    refreshNucleusState()
  }, [])
}

export function usePollStatsApiForPoolID() {
  const { chainId } = useWeb3React()

  const updateStatsApiState = useUpdateStatsApiState()
  const httpClient = new HttpClient()

  async function refreshNucleusState() {
    return new Promise(async (resolve,reject) => {
      if(!chainId) {
        resolve(undefined)
        return
      }
      const stateUrl = `https://stats.hydrogendefi.xyz/state/?chainID=${chainId}&v=${NUCLEUS_VERSION}`
      httpClient.get(stateUrl, false).then((nucleusState:any) => {
        nucleusState.chainId = chainId
        updateStatsApiState(nucleusState)
        resolve(nucleusState)
      })
    })
  }

  async function poll(poolID: number) {
    async function nextIter() {
      const nucleusState = await refreshNucleusState()
      const cond = pollTerminateCondition(nucleusState, poolID)
      if(cond) return
      setTimeout(nextIter, 1000)
    }
    nextIter()
  }

  function pollTerminateCondition(nucleusState: any, poolID: number) {
    if(!nucleusState || !!nucleusState.loading) return false
    if(nucleusState.pools.hasOwnProperty(poolID)) return true
    if(!!nucleusState.pools[poolID]) return true
    return false
  }

  return poll
}

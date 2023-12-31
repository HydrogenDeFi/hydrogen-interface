import { useUpdateStatsApiState } from './hooks'
import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { HttpClient } from './HttpClient'
import { NUCLEUS_VERSION } from 'constants/index'

export default function Updater(): null {
  const { chainId } = useWeb3React()

  const updateStatsApiState = useUpdateStatsApiState()
  const httpClient = new HttpClient()

  function refreshNucleusState() {
    if(!chainId) return
    const stateUrl = `https://stats.hydrogendefi.xyz/state/?chainID=${chainId}&v=${NUCLEUS_VERSION}`
    httpClient.get(stateUrl, false).then((nucleusState:any) => {
      nucleusState.chainId = chainId
      //console.log({nucleusState})
      updateStatsApiState(nucleusState)
    })
  }

  useEffect(() => {
    refreshNucleusState()
    const interval = setInterval(refreshNucleusState, 30000)
    return () => clearInterval(interval)
  }, [chainId])

  return null
}

import { Trade } from '@uniswap/router-sdk'
import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { usePermit2Enabled } from 'featureFlags/flags/permit2'
import { GridOrderCallbackState, useGridOrderCallback as useLibGridOrderCallBack } from 'lib/hooks/gridOrder/useGridOrderCallback'
import { ReactNode, useMemo } from 'react'

import { useTransactionAdder } from '../state/transactions/hooks'
import { TransactionType } from '../state/transactions/types'
import { currencyId } from '../utils/currencyId'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import { Permit } from './usePermit2'
import useTransactionDeadline from './useTransactionDeadline'
import { useUniversalRouterSwapCallback } from './useUniversalRouter'

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useGridOrderCallback(
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null,
  permit: Permit | undefined
): { state: GridOrderCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
  const { account } = useWeb3React()

  const deadline = useTransactionDeadline()

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const permit2Enabled = usePermit2Enabled()
  const {
    state,
    callback: libCallback,
    error,
  } = useLibGridOrderCallBack({
    trade: permit2Enabled ? undefined : trade,
    allowedSlippage,
    recipientAddressOrName: recipient,
    signatureData,
    deadline,
  })
  const universalRouterSwapCallback = useUniversalRouterSwapCallback(permit2Enabled ? trade : undefined, {
    slippageTolerance: allowedSlippage,
    deadline,
    permit: permit?.signature,
  })
  const swapCallback = permit2Enabled ? universalRouterSwapCallback : libCallback

  const callback = useMemo(() => {
    if (!trade || !swapCallback) return null
    return () =>
      swapCallback().then((response) => {
        addTransaction(
          response,
          {
            type: TransactionType.LIMIT_ORDER,
            inputCurrencyId: currencyId(trade.inputAmount.currency),
            inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            outputCurrencyId: currencyId(trade.outputAmount.currency),
            outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
          }
        )
        return response.hash
      })
  }, [addTransaction, allowedSlippage, swapCallback, trade])

  return {
    state,
    callback,
    error,
  }
}

import { ElementName } from '@uniswap/analytics-events'
import { DollarSign, Terminal } from 'react-feather'
import styled from 'styled-components/macro'
import { lightTheme } from 'theme/colors'

import darkArrowImgSrc from './images/aboutArrowDark.png'
import lightArrowImgSrc from './images/aboutArrowLight.png'
import darkDollarImgSrc from './images/aboutDollarDark.png'
import darkTerminalImgSrc from './images/aboutTerminalDark.png'
//import nftCardImgSrc from './images/nftCard.png'
import swapCardImgSrc from './images/swapCard.png'
import earnCardImgSrc from './images/earnCard.png'



const StyledCardLogo = styled.img`
  min-width: 20px;
  min-height: 20px;
  max-height: 48px;
  max-width: 48px;
`

export const MAIN_CARDS = [
  {
    to: '/swap',
    title: 'Swap tokens',
    description: 'Buy, sell, and explore tokens on Ethereum, Polygon, Optimism, and more.',
    cta: 'Trade Tokens',
    darkBackgroundImgSrc: swapCardImgSrc,
    lightBackgroundImgSrc: swapCardImgSrc,
    elementName: ElementName.ABOUT_PAGE_SWAP_CARD,
  },
  /*
  {
    to: '/nfts',
    title: 'Trade NFTs',
    description: 'Buy and sell NFTs across marketplaces to find more listings at better prices.',
    cta: 'Explore NFTs',
    darkBackgroundImgSrc: nftCardImgSrc,
    lightBackgroundImgSrc: nftCardImgSrc,
    elementName: ElementName.ABOUT_PAGE_NFTS_CARD,
  },
  */
  {
    to: '/pool',
    title: 'Earn',
    description: 'Provide liquidity to pools on Hyswap and earn fees on swaps and reinvestment vaults.',
    cta: 'Provide liquidity',
    darkBackgroundImgSrc: earnCardImgSrc,
    lightBackgroundImgSrc: earnCardImgSrc,
    elementName: ElementName.ABOUT_PAGE_EARN_CARD,
  },
]

export const MORE_CARDS = [
  {
    to: 'https://support.uniswap.org/hc/en-us/articles/11306574799117-How-to-use-Moon-Pay-on-the-Uniswap-web-app-',
    external: true,
    title: 'Buy crypto',
    description: 'Buy crypto with your credit card or bank account at the best rates.',
    lightIcon: <DollarSign color={lightTheme.textTertiary} size={48} />,
    darkIcon: <StyledCardLogo src={darkDollarImgSrc} alt="Earn" />,
    cta: 'Buy now',
    elementName: ElementName.ABOUT_PAGE_BUY_CRYPTO_CARD,
  },
  {
    to: '/pool',
    title: 'Earn',
    description: 'Provide liquidity to pools on Uniswap and earn fees on swaps.',
    lightIcon: <StyledCardLogo src={lightArrowImgSrc} alt="Analytics" />,
    darkIcon: <StyledCardLogo src={darkArrowImgSrc} alt="Analytics" />,
    cta: 'Provide liquidity',
    elementName: ElementName.ABOUT_PAGE_EARN_CARD,
  },
  {
    to: 'https://docs.uniswap.org',
    external: true,
    title: 'Build dApps',
    description: 'Build apps and tools on the largest DeFi protocol on Ethereum.',
    lightIcon: <Terminal color={lightTheme.textTertiary} size={48} />,
    darkIcon: <StyledCardLogo src={darkTerminalImgSrc} alt="Developers" />,
    cta: 'Developer docs',
    elementName: ElementName.ABOUT_PAGE_DEV_DOCS_CARD,
  },
]

import { bscTestnetTokens, serializeToken } from '@kazamaswap/tokens';

import { SerializedFarmConfig } from '../types';

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
   {
    pid: 2,
    // v1pid: 3,
    lpSymbol: 'KAZAMA / BNB',
    lpAddress: '0x63aB99774aAD18d53e59Ef2655cD45485e6E7cb4',
    // boosted: true,
    token: bscTestnetTokens.kazama,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 4,
    // v1pid: 3,
    lpSymbol: 'BNB / BUSD',
    lpAddress: '0xe0e92035077c39594793e61802a350347c320cf2',
    // boosted: true,
    token: bscTestnetTokens.busd,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 5,
    // v1pid: 3,
    lpSymbol: 'BNB / SDXb',
    lpAddress: '0xad39bbDdBb9b19b5034026595A257A6F1D132b14',
    // boosted: true,
    token: bscTestnetTokens.sdxb,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 6,
    // v1pid: 3,
    lpSymbol: 'BNB / XEN',
    lpAddress: '0x705d9759250a70cc9aeaFdCAaE7b8e00F50b3605',
    // boosted: true,
    token: bscTestnetTokens.xen,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 7,
    // v1pid: 3,
    lpSymbol: 'BNB / EGC',
    lpAddress: '0xE1e8AE13090d4f0F6b31fa391d6efE82D9531C17',
    // boosted: true,
    token: bscTestnetTokens.egc,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 8,
    // v1pid: 3,
    lpSymbol: 'BNB / BTCB',
    lpAddress: '0x326174Ab0100069c8F00F8059fC7D6F4fa6D8a83',
    // boosted: true,
    token: bscTestnetTokens.btc,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 9,
    // v1pid: 3,
    lpSymbol: 'BNB / ETH',
    lpAddress: '0xb27F628C12573594437B180A1eA1542d15E0cb78',
    // boosted: true,
    token: bscTestnetTokens.eth,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 10,
    // v1pid: 3,
    lpSymbol: 'BNB / PEPEL',
    lpAddress: '0x2CC0eC87f00533F9329fB366832423F4681D2cfB',
    // boosted: true,
    token: bscTestnetTokens.pepel,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 11,
    // v1pid: 3,
    lpSymbol: 'BNB / RABBIT',
    lpAddress: '0xC4127414aF76268c86c1604F4ADB634A1FD158f4',
    // boosted: true,
    token: bscTestnetTokens.rabbit,
    quoteToken: bscTestnetTokens.wbnb,
  },
  {
    pid: 12,
    // v1pid: 3,
    lpSymbol: 'BNB / ROMA',
    lpAddress: '0x79bD182b3ef3024E078a7ecF02f6Cf837Dc22BEd',
    // boosted: true,
    token: bscTestnetTokens.roma,
    quoteToken: bscTestnetTokens.wbnb,
  },
  

].map((p) => ({ ...p, token: serializeToken(p.token), quoteToken: serializeToken(p.quoteToken) }))

export default farms


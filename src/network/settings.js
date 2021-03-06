const NETWORK_MAIN_ID = 1
const NETWORK_ROPSTEN_ID = 3
const NETWORK_RINKEBY_ID = 4
const NETWORK_KOVAN_ID = 42
const NETWORK_PRIVATE_ID = 777
export const LOCAL_ID = 9999999999

export const INFURA_TOKEN = 'PVe9zSjxTKIP3eAuAHFA'
export const UPORT_ID = '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'

const scannerMap = {
  // only for mainnet API url is different from web-interface url
  main: [
    'https://etherscan.io',
    'https://api.etherscan.io'
  ],
  ropsten: 'https://ropsten.etherscan.io',
  kovan: 'https://kovan.etherscan.io',
  rinkeby: 'https://rinkeby.etherscan.io'
}

export const metamaskNetworkMap = [{
  id: LOCAL_ID,
  name: 'Localhost'
}, {
  id: NETWORK_MAIN_ID,
  name: 'Main Ethereum Network',
  scanner: scannerMap.main
}, {
  id: NETWORK_ROPSTEN_ID,
  name: 'Ropsten (test network)',
  scanner: scannerMap.ropsten
}, {
  id: NETWORK_RINKEBY_ID,
  name: 'Rinkeby (test network)',
  scanner: scannerMap.rinkeby
}, {
  id: NETWORK_KOVAN_ID,
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

export const infuraNetworkMap = [{
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  host: `mainnet.infura.io/${INFURA_TOKEN}`,
  name: 'Mainnet (production)',
  scanner: scannerMap.main
}, {
//   id: NETWORK_ROPSTEN_ID,
//   protocol: 'https',
//   host: `ropsten.infura.io/${INFURA_TOKEN}`,
//   name: 'Ropsten (test network)',
//   scanner: scannerMap.ropsten
// }, {
  id: NETWORK_RINKEBY_ID,
  protocol: 'https',
  host: `rinkeby.infura.io/${INFURA_TOKEN}`,
  name: 'Rinkeby (test network)',
  scanner: scannerMap.rinkeby
}, {
  id: NETWORK_KOVAN_ID,
  protocol: 'https',
  host: `kovan.infura.io/${INFURA_TOKEN}`,
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

const chronoBankMap = [{
  id: NETWORK_MAIN_ID,
  protocol: 'https',
  host: 'mainnet.chronobank.io/',
  name: 'Mainnet (production)',
  scanner: scannerMap.main
}, {
//   id: NETWORK_ROPSTEN_ID,
//   protocol: 'https',
//   host: 'ropsten.chronobank.io/',
//   name: 'Ropsten (test network)',
//   scanner: scannerMap.ropsten
// }, {
  id: NETWORK_RINKEBY_ID,
  protocol: 'https',
  host: 'rinkeby.chronobank.io/',
  name: 'Rinkeby (test network)',
  scanner: scannerMap.rinkeby
}, {
  id: NETWORK_KOVAN_ID,
  protocol: 'https',
  host: 'kovan.chronobank.io/',
  name: 'Kovan (test network)',
  scanner: scannerMap.kovan
}]

// dev only
if (process.env.NODE_ENV === 'development') {
  chronoBankMap.push({
    id: NETWORK_PRIVATE_ID,
    protocol: 'https',
    host: 'private.chronobank.io/',
    name: 'Private (develop network)'
  })
}

export const infuraLocalNetwork = {
  id: LOCAL_ID,
  host: location.hostname + ':8545',
  name: 'Local'
}

export const providerMap = {
  metamask: {
    id: 1,
    name: 'Metamask/Mist',
    disabled: true
  },
  infura: {
    id: 2,
    name: 'Infura',
    disabled: false
  },
  chronoBank: {
    id: 4,
    name: 'ChronoBank',
    disabled: false
  },
  uport: {
    id: 5,
    name: 'UPort',
    disabled: false
  },
  local: {
    id: LOCAL_ID,
    name: 'Local',
    disabled: true
  }
}

export const getNetworksByProvider = (providerId, withLocal = false) => {
  switch (providerId) {
    case providerMap.metamask.id: {
      return [...metamaskNetworkMap]
    }
    case providerMap.infura.id: {
      const networks = [...infuraNetworkMap]
      if (withLocal) {
        networks.push(infuraLocalNetwork)
      }
      return networks
    }
    case providerMap.chronoBank.id: {
      return [...chronoBankMap]
    }
    case providerMap.local.id: {
      return [infuraLocalNetwork]
    }
    default: {
      return []
    }
  }
}

export const getNetworkById = (networkId, providerId, withLocal = false) => {
  const networkMap = getNetworksByProvider(providerId, withLocal)
  return networkMap.find((net) => net.id === networkId) || {}
}

export const getScannerById = (networkId, providerId, api = false) => {
  let scanner = getNetworkById(networkId, providerId).scanner
  if (Array.isArray(scanner)) {
    scanner = scanner[api ? 1 : 0]
  }
  return scanner
}

export const getEtherscanUrl = (networkId, providerId, txHash) => {
  const baseScannerUrl = getScannerById(networkId, providerId)
  return baseScannerUrl ? (`${baseScannerUrl}/tx/` + txHash) : null
}

export const isTestingNetwork = (networkId, providerId) => {
  const net = getNetworkById(networkId, providerId)
  return net.id !== NETWORK_MAIN_ID
}

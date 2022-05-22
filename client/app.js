const App = {

  contracts: {},

  web3Provider: '',

  init: () => {
    console.log('Loaded')
    App.loadEthereum()
    App.loadContracts()
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      new Web3(window.web3.currentProvider)
    } else {
      console.log('Ethereum browser is not installed. Try installing MetaMask.')
    }
  },

  loadContracts: async () => {
    const res = await fetch("TasksContract.json")
    const tasksContractJSON = await res.json()
    
    App.contracts.tasksContract = TruffleContract(tasksContractJSON)

    App.contracts.tasksContract.setProvider(App.web3Provider)
    App.taskContract = await App.contracts.tasksContract.deployed()
  }
}

App.init()
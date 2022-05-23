const App = {

  contracts: {},

  web3Provider: '',

  init: () => {
    App.loadEthereum()
    App.loadWallet()
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
  
  loadWallet: async () => {
    const wallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
    App.wallet = wallet[0]
  },

  loadContracts: async () => {
    const res = await fetch("TasksContract.json")
    const tasksContractJSON = await res.json()
    
    App.contracts.tasksContract = TruffleContract(tasksContractJSON)

    App.contracts.tasksContract.setProvider(App.web3Provider)
    App.tasksContract = await App.contracts.tasksContract.deployed()
  },

  createTask: async (title, description) => {
    const res = await App.tasksContract.createTask(title, description, { from: App.wallet })
    console.log(res.logs[0]?.args)
  }
}

App.init()
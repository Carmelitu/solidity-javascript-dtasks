const App = {

  contracts: {},

  web3Provider: '',

  init: async () => {
    await App.loadEthereum()
    await App.loadWallet()
    await App.loadContracts()
    App.renderWallet()
    await App.renderTasks()
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

  renderWallet: async () => {
    document.getElementById('wallet').innerText = App.wallet
  },

  renderTasks: async () => {
    let taskCounter = await App.tasksContract.taskCounter()
    taskCounter = taskCounter.toNumber()

    let html = ''

    for (let i = 0; i < taskCounter; i++) {
      const task = await App.tasksContract.tasks(i)
      const { title, description, done, createdAt } = task

      let taskElement = `
        <div class="card bg-dark rounded-0 mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>${title}</span>
            <div class="form-check form-switch">
              <input class="form-check-input" data-id="${i}" type="checkbox" ${done ? 'checked' : ''}
                    onchange="App.toggleDone(this)" />
            </div>
          </div>
          <div class="card-body">
            <span>${description}</span>
            <p class="text-muted">Task was created ${new Date(createdAt * 1000).toLocaleString()}</p>
          </div>
        </div>
      `
      html += taskElement
    }

    document.querySelector('#task-list').innerHTML = html
  },

  createTask: async (title, description) => {
    const res = await App.tasksContract.createTask(title, description, { from: App.wallet })
    console.log(res.logs[0]?.args)
    await App.renderTasks()
  },

  toggleDone: async (element) => {
    const res = await App.tasksContract.toggleDone(element.dataset.id, { from: App.wallet })
    await App.renderTasks()
  }
}

App.init()
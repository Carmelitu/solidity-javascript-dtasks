const TasksContract = artifacts.require('TasksContract')

contract('TasksContract', () => {

  before(async () => {
      this.tasksContract = await TasksContract.deployed()
  })

  it('migrate deployed successfully', async () => {
    const address = this.tasksContract.address

    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
  })

  it('get first task and check values', async () => {
    const taskCounter = await this.tasksContract.taskCounter()
    const task = await this.tasksContract.tasks(taskCounter - 1)

    assert.equal(task.id.toNumber(), taskCounter - 1)
    assert.equal(task.title, 'my first task')
    assert.equal(task.description, 'example')
    assert.equal(task.done, false)
    assert.equal(taskCounter, 1)
  })

  it('task created successfully', async () => {
    const res = await this.tasksContract.createTask('some task', 'some description')
    const task = res.logs[0].args

    assert.equal(task.id.toNumber(), 1)
    assert.equal(task.title, 'some task')
    assert.equal(task.description, 'some description')
    assert.equal(task.done, false)

    const taskCounter = await this.tasksContract.taskCounter()
    assert.equal(taskCounter, 2)
  })

  it('task done toggled successfully', async () => {
    const res = await this.tasksContract.toggleDone(0)
    const task = res.logs[0].args
    const taskQuery = await this.tasksContract.tasks(0)

    assert.equal(task.id.toNumber(), 0)
    assert.equal(task.done, true)
    assert.equal(taskQuery.done, true)
  })

})
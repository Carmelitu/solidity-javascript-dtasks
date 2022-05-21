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

})
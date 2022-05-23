const taskForm = document.querySelector('#task-form')

taskForm.addEventListener('submit', e => {
  e.preventDefault()

  App.createTask(taskForm.title.value, taskForm.description.value)
})
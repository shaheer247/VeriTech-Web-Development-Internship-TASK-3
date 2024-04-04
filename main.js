window.addEventListener('load', () => {
  let form = document.getElementById("form");
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textarea = document.getElementById("textarea");
  let msg = document.getElementById("msg");
  let tasks = document.getElementById("tasks");
  let add = document.getElementById("add");


  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });

  let formValidation = () => {
    if (textInput.value === "" || dateInput.value === "" || textarea.value === "") {
      console.log("failure");
      msg.innerHTML = "Please fill all the Fields";
    } else {
      console.log("success");
      msg.innerHTML = "";
      acceptData();
      add.setAttribute("data-bs-dismiss", "modal");
      add.click();

      (() => {
        add.setAttribute("data-bs-dismiss", "");
      })();
    }
  };
  let acceptData = () => {
    if (editingIndex !== null) {
      data[editingIndex] = {
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value,
        completed: data[editingIndex].completed // Retain the completion status
      };
      editingIndex = null; // Reset editingIndex after updating the task
    } else {
      data.push({
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value,
        completed: false,
      });
    }

    localStorage.setItem("data", JSON.stringify(data));

    createTasks();
  };


  window.createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
      return (tasks.innerHTML += `
    <div id=${y}>
    <p class="task_title">Task ${y + 1}</p>
        <span class="fw-bold">${x.text}</span>
        <span class="small text-secondary">${x.date}</span>
          <p>${x.description}</p>
      <span class="options">
        <span>
          Completed:
          <input type="checkbox" class="task_checkbox" id="statusInput" ${x.completed ? 'checked' : ''} onchange="updateCompletionStatus(this.checked, ${y})">
        </span>
           <span>
            <i onClick= "editTask(this)" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
           </span>
       </span>
        </div>
    `);
    });

    resetForm();
  };
  window.updateCompletionStatus = (isChecked, index) => {
    data[index].completed = isChecked;
    localStorage.setItem("data", JSON.stringify(data));
  };


  window.deleteTask = (e) => {
    e.parentElement.parentElement.parentElement.remove();
    data.splice(e.parentElement.parentElement.parentElement.id, 1);
    localStorage.setItem("data", JSON.stringify(data));
    console.log(data);

  };

  let editingIndex = null;

  window.editTask = (e) => {
    let selectedTask = e.parentElement.parentElement.parentElement;

    textInput.value = selectedTask.children[1].innerHTML;
    dateInput.value = selectedTask.children[2].innerHTML;
    textarea.value = selectedTask.children[3].innerHTML;

    editingIndex = parseInt(selectedTask.id);
  };


  let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    textarea.value = "";
  };

  (() => {
    data = JSON.parse(localStorage.getItem("data")) || []
    console.log(data);
    createTasks();

  })();

});

import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoForm from "../TodoForm/TodoForm";

const ItemType = "TASK";


function Task({ task, onEdit, onDelete }) {
  const [, dragRef] = useDrag({
    type: ItemType,
    item: { id: task.id, stage: task.stage },
  });

  return (
    <div ref={dragRef} className="p-3 mb-2 border rounded shadow-sm" style={{
      background : task.stage==="todo" ? "rgb(144 218 245)" :(task.stage==='in-progress')?"rgb(237 202 56)":"rgb(150 199 134)"
    }}
           >
      <h4 className="text-center">{task.title}</h4>
     
      <p>{task.description}</p>
      <div className="d-flex justify-content-end mt-2">
        <button
          className="btn btn-sm btn-primary me-2"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}


function Stage({ stage, tasks, onDrop, onEdit, onDelete }) {
  const [, dropRef] = useDrop({
    accept: ItemType,
    drop: (item) => onDrop(item.id, stage),
  });

  return (
    <div
      ref={dropRef}
      className={`p-3 rounded  bg-light shadow ${
        tasks.length === 0
          ? "min-vh-50 d-flex align-items-center justify-content-center"
          : "min-vh-50"
      }`}
    style={{minHeight:"400px"}} >
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p className="text-muted">No tasks available</p>
      )}
    </div>
  );
}


function TodoThreeStages() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
        const response = await fetch("http://localhost:1100/api/tasks");
        if (!response.ok) throw new Error("Unable to fetch tasks. Please try again.");
        const data = await response.json();
        setTasks(data);
    } catch (err) {
        setError(err.message); // Set a user-readable error message
    } finally {
        setLoading(false);
    }
};


  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  const handleDrop = (id, newStage) => {
  
    fetch(`http://localhost:1100/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }), 
    })
      .then((res) => {
        if (!res.ok) {
     
          return res.text().then((message) => {
            throw new Error(`Server error: ${message}`);
          });
        }
        return res.json(); // Parse JSON if request succeeds
      })
      .then((updatedTask) => {
        console.log("Task updated successfully:", updatedTask);
  
        // Update the task in the local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch((err) => {
        console.error("Failed to update task:", err.message);
      });
  };
  

  const handleDelete = (id) => {
    fetch(`http://localhost:1100/api/tasks/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (editedTask) => {
    console.log(editedTask)
    fetch(`http://localhost:1100/api/tasks`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        setEditingTask(null);
      })
      .catch((err) => console.error(err));
  };

  const stages = {
    todo: tasks.filter((task) => task.stage === "todo"),
    "in-progress": tasks.filter((task) => task.stage === "in-progress"),
    complete: tasks.filter((task) => task.stage === "complete"),
  };

  if (loading) return <div className="text-center mt-5">Loading tasks...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid min-vh-100  pb-5 pt-4"
      style={{backgroundColor:"#bcb8db"}}>

        <div className="text-center mb-4 mt-4">
          <button
            className="btn bg-primary text-light"
            
            onClick={() => setFormOpen(true)}
          >
            Add New Task
          </button>
        </div>

        {formOpen && (
          <div className="modal show d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setFormOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <TodoForm setOpen={setFormOpen} onTaskCreated={handleTaskCreated} />
                </div>
              </div>
            </div>
          </div>
        )}

        {editingTask && (
          <div className="modal show d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditingTask(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Title"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        title: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSaveEdit(editingTask)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {Object.keys(stages).map((stage) => (
            <div key={stage} className="col-12 col-md-4">
              <div className="card">
                <div
                  className={`card-header ${
                    stage === "todo"
                      ? "bg-info"
                      : stage === "in-progress"
                      ? "bg-warning"
                      : "bg-success"
                  } text-white`}
                >
                  <h5 className="text-center" style={{color:"#010308"}}>{(stage!=="in-progress")? stage.replace("-", " ").toUpperCase():"IN-PROGRESS"}</h5>
                </div>
                <Stage
                  stage={stage}
                  tasks={stages[stage]}
                  onDrop={handleDrop}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default TodoThreeStages;

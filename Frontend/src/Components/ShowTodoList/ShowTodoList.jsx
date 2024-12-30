import React from "react";
import { useSelector } from "react-redux";
import "./ShowTodoList.css";

const ShowTodoList = () => {
  const tasks = useSelector((state) => state.Data.Tasks); // Accessing Tasks from the count reducer

  return (
    <div id="TaskParentDiv">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div className="TaskDiv" key={task.id}>
            <div id="TitleDiv">
              <h3>Title</h3>
              <p>{task.title}</p>
            </div>

            <h3
              align="start"
              style={{
                marginTop: "30px",
                paddingLeft: "35px",
                paddingBottom: "10px",
                color: "lightsteelblue",
              }}
            >
              Description:
            </h3>

            <div id="descriptionDiv">
              <div id="descriptionDivFirstChild">
                {task.description.length > 0 ? task.description : "No description added"}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default ShowTodoList;

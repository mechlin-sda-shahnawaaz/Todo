import { Button } from "react-bootstrap";

function Todo({
  _id,
  title,
  description,
  isCompleted,
  dueDate,
  onUpdateBtnClick,
  onDeleteBtnClick,
  toggleTodo,
}) {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h5 className="card-title">{title}</h5>
          <div>{dueDate}</div>
        </div>
        <div className="d-flex justify-content-between my-4">
          <p className="card-text">{description}</p>
          <div style={{ height: "50px !important" }}>
            <Button
              variant={`${isCompleted ? "success" : "info"}`}
              onClick={() => toggleTodo({ isCompleted: !isCompleted }, _id)}
            >
              {isCompleted ? "Completed" : "Pending"}
            </Button>
          </div>
        </div>
        <div className="text-end">
          <Button
            variant="warning"
            className="me-3"
            onClick={() =>
              onUpdateBtnClick({ title, description, dueDate, _id })
            }
          >
            Update
          </Button>
          <Button variant="danger" onClick={() => onDeleteBtnClick(_id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Todo;

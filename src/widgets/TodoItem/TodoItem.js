import React from "react";

class TodoItem extends React.PureComponent {
  static schema = {
    title: "Todo",
    type: "object",
    required: ["title"],
    properties: {
      title: {type: "string", title: "Title", default: "A new task"},
      done: {type: "boolean", title: "Done?", default: false}
    }
  }

  render() {
    return (<div>{this.props.title || "empty"}</div>)
  }
}

export default TodoItem;

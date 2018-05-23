import AddIcon from "../icon/plus.svg"
import _ from "lodash";
import TodoItem from "../widgets/TodoItem/TodoItem";

class WidgetManagerClass {
  widgets = [];

  register = (name, component, desc, icon, schema) => {
    this.widgets.push({
      name,component,desc,icon,schema
    });
  }

  getAllWidgets = () => {
    return this.widgets;
  }

  get = (name) => {
    return _.find(this.widgets, {name});
  }
}

const WidgetManager = new WidgetManagerClass();
WidgetManager.register('TodoItem', TodoItem, 'TodoItem component' ,AddIcon, TodoItem.schema);
export default WidgetManager;

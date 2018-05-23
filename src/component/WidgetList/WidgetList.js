import React from "react";
import _ from "lodash";
import './WidgetList.css'
import SVG from 'react-inlinesvg';

class WidgetList extends React.PureComponent {

  render() {
    return (
      <div className="widget-list">
        {_.map(this.props.widgets, (widget)=>(<div key={widget.name} className="widget-card">
          <div className="widget-content" onClick={ () => this.props.handleSelect(widget.name)}>
            <SVG className="icon" src={widget.icon}/>
            <div>{widget.name}</div>
            <div>{widget.desc}</div>
          </div></div>))}
      </div>
    )
  }
}


export default WidgetList;

import React from "react";
import './WidgetWrapper.css'
import RemoveIcon from "../../icon/trash.svg"
import AddIcon from "../../icon/plus.svg"
import SVG from 'react-inlinesvg';

class WidgetWrapper extends React.PureComponent {
  static defaultProps = {
    widget: null,
  };


  render() {

    const {onRemove, onAdd, children} = this.props;
    return <React.Fragment>
      { !children ? (<div className='add' onClick={onAdd}><SVG className="svg-add" src={AddIcon}
      /></div>) : (children)}

      <span
        className="remove"
        onClick={onRemove}>
        <SVG className="svg-remove" src={RemoveIcon}/>
      </span>
    </React.Fragment>;
  }
}

export default WidgetWrapper;

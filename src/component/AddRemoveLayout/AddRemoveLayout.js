import React from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";
import WidgetManager from '../../utils/WidgetManager'
import '../../../node_modules/react-grid-layout/css/styles.css';
import WidgetWrapper from '../WidgetWrapper/WidgetWrapper'
import SkyLight from "react-skylight";
import WidgetList from "../WidgetList/WidgetList";
import Sidebar from 'react-sidebar';
import './AddRemoveLayout.css'
import Form from "react-jsonschema-form";
import {getBreakpointFromWidth} from "react-grid-layout/build/responsiveUtils";
import {getFromLS, getWindowWidth, makeId, saveToLS} from "../../utils/utils";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
// import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
/**Sidebar content
 Add Item

 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
class AddRemoveLayout extends React.Component {

  static defaultProps = {
    className: "layout",
    breakpoints: { lg: 1200, md: 996, sm: 768},
    cols: {lg: 12, md: 10, sm: 6},
    rowHeight: 100,
    width: 1400,
    useCSSTransforms: false,
  };

  constructor(props) {
    super(props);
    const width = getWindowWidth();
    const breakPoint = getBreakpointFromWidth(this.props.breakpoints, width);

    this.state = {
      sidebarOpen: false,
      breakpoint: breakPoint,
      cols: this.props.cols[breakPoint],
      cells: getFromLS("cells") || _.map(["foo", "bar", "cat", "dog", "duck"], (item, index) => {
        return {
          key: item,
          layout: this.generateLayout(item, index)
        }
      }),
      layout: []
    };
  }

  generateLayout = (cellName, index, cols) => {
    const initLayout = {};
    _.forEach(Object.keys(this.props.cols), (key) => {
      initLayout[key] = {
        i: cellName,
        x: (index * 2) % (cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2
      }
    });

    return initLayout;
  };

  onLayoutChange = (layout, allLayout) => {
    const {cells} = this.state;

    _.forEach(Object.keys(this.props.cols), (breakpoint) => {
      _.forEach(allLayout[breakpoint], (item) => {
        const cell = _.find(cells, {key: item.i});
        cell.layout[breakpoint] = item;
      });
    });

    this.setState({
      cells,
    });

  };

  getCellsLayout = () => {
    const initLayout = {};
    _.forEach(Object.keys(this.props.cols), (key) => {
      initLayout[key] = this.state.cells.map(cell => cell.layout[key]);
    });

    return initLayout;
  };

  onSetSidebarOpen = (open) => {
    this.setState({sidebarOpen: open});
  };

  onAddWidgetButtonClick = (cellName) => {
    this.simpleDialog.show();
    this.setState({currentCellName: cellName})
  };

  onWidgetSelected = (widgetName) => {

    this.simpleDialog.hide();
    const cell = _.find(this.state.cells, {key: this.state.currentCellName})
    cell.widget = widgetName;
    this.setState({
      cells: this.state.cells,
      currentWidget: widgetName,
      sidebarOpen: true
    })
  };

  onAddCell = () => {
    const cellName = makeId();
    const {cells, cols} = this.state;
    console.log("adding", cellName);
    this.setState({
      // Add a new item. It must have a unique key!
      cells: cells.concat({
        key: cellName,
        layout: this.generateLayout(cellName, cells.length, cols)
      })
    });
  };

  // We're using the cols coming back from this to calculate where to add new cells.
  onBreakpointChange = (breakpoint, cols) => {

    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });

  };

  onRemoveItem = (cellName) => {
    console.log("removing", cellName);
    this.setState({cells: _.reject(this.state.cells, {key: cellName})});
  };

  log = (str)=> {
    return (obj) => {
      console.log(str, obj);
    }
  };

  handleWidgetReady = (form) => {
    const cell = _.find(this.state.cells, {key: this.state.currentCellName});
    cell.widgetProps = form.formData;
    this.setState({
      sidebarOpen: false,
      cells: this.state.cells
    })
  };

  render() {

    const {currentWidget, sidebarOpen, cells} = this.state;
    saveToLS("cells", cells);

    const layouts = this.getCellsLayout();

    const sidebar = (<div>
      <div>Sidebar content</div>
      {currentWidget && (<Form schema={WidgetManager.get(currentWidget).schema}
            onChange={this.log("changed")}
            onSubmit={this.handleWidgetReady}
            onError={this.log("errors")} />)}
    </div>);

    return (
      <Sidebar sidebar={sidebar}
               open={sidebarOpen}
               pullRight={true}
               shadow={false}
               sidebarClassName="sidebar"
               onSetOpen={this.onSetSidebarOpen}>
        <div>
          <button onClick={this.onAddCell}>Add Item</button>
          <ResponsiveReactGridLayout
            onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}
            layouts={layouts}
            {...this.props}
          >
            {_.map(cells, cell => {
              return (<div key={cell.key} >
                  <WidgetWrapper widget={cell} onAdd={() => {
                    this.onAddWidgetButtonClick(cell.key)
                  }} onRemove={() => {
                    this.onRemoveItem(cell.key)
                  }}>
                    {(cell.widget) &&
                      React.createElement(WidgetManager.get(cell.widget).component, {key: cell.key, ...cell.widgetProps}, null)}
                  </WidgetWrapper>
                </div>)})}
          </ResponsiveReactGridLayout>
          <SkyLight
            hideOnOverlayClicked
            ref={ref => this.simpleDialog = ref}
            title="Select Widget"
          >
            <WidgetList widgets={WidgetManager.getAllWidgets()} handleSelect={this.onWidgetSelected}/>
          </SkyLight>
        </div>
      </Sidebar>
    );
  }
}

export default AddRemoveLayout;

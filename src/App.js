import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as shoppingListItemActions from './actions/shoppingListItemActions';
import ShoppingList from './ShoppingList';
import NewItemForm from './NewItemForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.createItem = this.createItem.bind(this)
  }

  createItem(itemDescription) {
    debugger;
    this.props.actions.addShoppingListItem(itemDescription)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React Shopping List</h2>
        </div>
        <div className="col-lg-12">
          <ShoppingList items={this.props.shoppingListItems}/>
        </div>
        <div className="col-lg-12">
          <NewItemForm addItem={this.createItem} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {shoppingListItems: state.shoppingListItems}
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(shoppingListItemActions, dispatch)}
}

const connector = connect(mapStateToProps, mapDispatchToProps)
const connectedComponent = connector(App)

export default connectedComponent;

// Bonus: show usual export default connect...
// Bonus: container vs. presentational components: build actual list in shopping list component
// with actions for next code-along, shoppingList here top level, dispatch action
// then, bonus: container vs. presentational, props as callback functions

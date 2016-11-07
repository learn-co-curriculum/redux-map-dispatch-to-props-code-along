import React from 'react'

export default class NewItemForm extends React.Component {
  constructor(props) {
    super(props)
    this.triggerAddItem = this.triggerAddItem.bind(this)
  }
  triggerAddItem(event) {
    event.preventDefault();
    const newItem = event.target.children[1].value
    this.props.addItem(newItem)
  }

  render() {
    return (
      <form className="col-lg-6 col-lg-offset-3 form-horizontal" onSubmit={this.triggerAddItem}>
        <label>new item:</label>
        <input className="form-control"/>
        <input type="submit" />
      </form>
    )
  }
}  
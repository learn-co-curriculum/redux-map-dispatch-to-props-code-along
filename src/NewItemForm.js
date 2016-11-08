import React from 'react'

const NewItemForm = (props) =>  {
  function submitItemForm(event) {
    event.preventDefault();
    const newItem = event.target.children[1].value
    props.triggerCreateItem(newItem)
  }
  return (
    <form className="col-lg-6 col-lg-offset-3 form-horizontal" onSubmit={submitItemForm}>
      <label>new item:</label>
      <input className="form-control"/>
      <input type="submit" />
    </form>
  )
}  

export default NewItemForm;
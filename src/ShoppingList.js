import React from 'react';

const ShoppingList = (props) => {
  return (
    <ul className="list-group col-lg-6 col-lg-offset-3">
      {props.items.map((item, i) => {
        return <li key={i} className="list-group-item">{item.description}</li>
      })}
    </ul>
  )
}

export default ShoppingList;
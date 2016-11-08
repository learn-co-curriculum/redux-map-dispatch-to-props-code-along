export function getShoppingListItems() {
  const items = [{id: 1, description: "milk"}, {id: 2, description: "cookies"}, {id: 3, description: "sprinkles"}]
  return {type: 'GET_SHOPPING_LIST_ITEMS', payload: items}
}

export function addShoppingListItem(newItemDescription) {
  const newItem = {description: newItemDescription}
  return {type: 'ADD_SHOPPING_LIST_ITEM', payload: newItem}
}
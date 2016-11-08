export default function shoppingListItemReducer(state = [], action) {
  switch(action.type) {
    case 'GET_SHOPPING_LIST_ITEMS':
      return action.payload
    case 'ADD_SHOPPING_LIST_ITEM':
      return [...state, action.payload]
    default: 
      return state;
  }
}
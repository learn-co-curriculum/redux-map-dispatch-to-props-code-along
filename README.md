# Changing State in Redux with `mapDispatchToProps`

## Objectives

* Learn how to dispatch actions from withint a component.
* Use the Redux architecture to create a new copy of state, causing your components to re-render.

## Introduction

In this lesson, we'll be building out a feature on a shopping list application that allows a user to add an item to the list. Something like this:

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/react-shopping-list-demo.gif)

In order to do this, we'll need to dispatch an action creator function from our component. 

Let's do it!

### Step 1: Define the `ADD_SHOPPING_LIST_ITEM` action

First things first, we'll define an action creator function that, when dispatched to the reducer, will add a new item to state's collection of items. 

Let's stop and think about what this action needs access to in order to add that new item (long pause while you think....)

Our action creator function needs to know the data describing the new item to be created/added to state. Currently our shopping list items are pretty simple--they just have a property, `description`. So, our action creator function needs to take in the description of our new item as an argument. 

Open up `src/actions/shoppingListItemActions.js` and add the following function:

```javascript
...
export function addShoppingListItem(newItemDescription) {
  const newItem = {description: newItemDescription}
  return {type: 'ADD_SHOPPING_LIST_ITEM', payload: newItem}
}
```

Now we're ready to teach our reducer how to respond to this action and what changes to make to state. 

### Step 2: Teach the Reducer to Respond to the Action

We'll add a new `case` statement to our `shoppingListItemsReducer` to match the action with a type of `ADD_SHOPPING_LIST_ITEM`. 

```javascript
export default function shoppingListItemReducer(state = [], action) {
  switch(action.type) {
    case 'GET_SHOPPING_LIST_ITEMS':
      return action.payload
    case 'ADD_SHOPPING_LIST_ITEM':
      // coming soon!
    default: 
      return state;
  }
}
```

How should our reducer handle this action? Well, we need to add the new item that we stored in `action.payload` to the state's current collection of items. But, **we don't want to mutate state**. So, we need to create a copy of state that *includes our new item*. We'll use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) to achieve this. 

```javascript
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
```

The line 

```javascript
[...state, action.payload]
```

creates a new array comprised of the existing state collection, plus the new object in `action.payload`:

```javascript
[{description: 'milk'}, {description: 'cookies'}, {description: 'sprinkles'}, {description: 'chocolate'}]
```

The reducer returns this new collection, which causes the store to create a new version of state with a key of `shoppingListItems` set to this new collection. 

As a result, our component tree, connected to the store via the top-level container component `App`, is told to re-render. 

**When the component re-renders, it will run `mapStateToProps` again**, grabbing the new shopping list items collection from state, passing it to the component as `props`, and *then* rendering with the newly updated data. 

Now that our action and reducer are in place, we're ready to build out a form for our user to add a new item. 


### Step 3: Dispatching the Action from the Component

We'll build a form for a new item, and when that form is submitted, it should fire our `addShoppingListItem` action creator function, triggering the cycle described above. 

#### Building our Form

Let's add our form to our `App` component:



#### Using `mapDispatchToProps`
### Step 4: Refactor into a Form Component
#### props as callback functions/DDAU
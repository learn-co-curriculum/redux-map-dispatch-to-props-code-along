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

Update the `render` method of your `App` component to contain the following form:

```javascript
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
           <form className="col-lg-6 col-lg-offset-3 form-horizontal" onSubmit={this.createItem}>
            <label>new item:</label>
            <input className="form-control"/>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
```

Notice that we've added an `onSubmit` callback function to our form, called `createItem`. 

Let's define that function now to do the following:

* Grab the description of the new item from the form field
* Invoke the `addShoppingListItem` action creator function, passing it an argument of that description. 

Our `createItem` function will be automatically invoked when the form is submitted by the user, at which time the event of the form submission will be passed to this function as an argument. So, we would define our `createItem` function to take an argument of `event` and make sure to call `event.preventDefault()` to prevent the page from reloading. 

Let's define our function:

```js
// src/App.js

class App extends Component {

  createItem(event) {
    event.preventDefault();
    const newItemDescription = event.target.children[1].value
    // dispatch action here
  }
  
  ...
```

We also need to bind `this` to the function so that the function, when called, understands `this` to refer to the component, i.e. the context in which it was defined. Otherwise, when invoked as an `onSubmit` callback, `this` will be undefined. 

We'll bind `this` in a constructor function in our `App` class:

```js
class App extends Component {
  constructor(props) {
    super(props);
    this.createItem = this.createItem.bind(this)
  }

  createItem(event) {
    debugger;
    event.preventDefault();
    const newItemDescription = event.target.children[1].value
    // dispatch action here
  }
  
  ...
```

Okay, we're ready to dispatch our action from within the `createItem` function. In order to do that, we need to make our action available to our component. 

#### Using `mapDispatchToProps`

Recall that, with Redux, our components don't talk directly to the store. Instead, the interaction between the store and the component is abstracted away via the `connect` function. So, *we will not directly call `store.dispatch(someAction())` from within our component. 

If the way to get information from the store's internal state (and therefore application state) into our component was to define a `mapStateToProps` function, which gets passed as an argument to `connect`, it stands to reason that we'll take a similar approach in order to make actions available to our component. 

In order to enable a component to indirectly tell the store to dispatch an action, we'll define the function `mapDispatchToProps`, and pass that function as a second argument to connect:

```js
// src/App.js

...

function mapDispatchToProps() {
  // coming soon!
}

const connector = connect(mapStateToProps, mapDispatchToProps)
const connectedComponent = connector(App)

export default connectedComponent;
```

The `mapDispatchToProps` function has one job: take a set of action creator functions, package them up and make them invocable from inside the the component under `this.props.actions`. 

How can `mapDispatchToProps` do all this? With the help of the `bindActionCreators` function made available to us by Redux.

#### Using `bindActionCreators`

Here's how it works:

The `bindActionCreators` function takes in two arguments:

* The collection of action creator functions, which we'll import from the file where we defined them, and
* The `dispatch` function

`bindActionCreators` will then iterate over each action creator function and wrap it up in a call to `dispatch`. 

The result of calling

```js
bindActionCreators(actions, dispatch)
```

is then passed to our component 





### Step 4: Refactor into a Form Component
#### props as callback functions/DDAU
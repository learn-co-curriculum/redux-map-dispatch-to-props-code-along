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

First, let's take a look at our `mapDispatchToProps` function and its usage of `bindActionCreators`, then we'll break down how it works. 

```js
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(shoppingListItemActions, dispatch)}
}
```

The `mapDispatchToProps` function, just like `mapStateToProps` is passed to and invoked by `connect`. When the `connect` function invokes `mapDispatchToProps`, it will pass in an argument of the store's dispatch function. 

The `bindActionCreators` function takes in two arguments:

* The collection of action creator functions, which we'll import from the file where we defined them
* The `dispatch` function

`bindActionCreators` will then iterate over each action creator function and wrap it up in a call to `dispatch`, returning an object with keys named for each action creator function and values of a directly invocable version of that function. 

The object is then passed to the component, becoming available as `this.props.actions`. 

Let's take a look at that in the browser now. Put a `debugger` in your `render` function, run the app by running `npm start` in your terminal and open up the developer console in the browser in order to hit the `debugger`. 

If you run the following in your console, you should see something like this:

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/Screen+Shot+2016-11-08+at+11.19.35+AM.png)

We can see that `this.props.actions` returns an object. If we open up that object we can see that its key/value pairs consist of the action creator function names, pointing to values of each action creator function. 

#### Invoking the Action Creator Functions Inside the Component

Here comes the cool part--these functions are *directly invocable from within our component*. This means that **we do not call `store.dispatch(someAction())`, but instead can invoke the action creator function like this:

```js
this.props.actions.addShoppingListItem()
```

Because `bindActionCreators` wrapped up each of these action creator functions in a call to dispatch, when we directly invoke the function as shown above, it will automatically get dispatched by the store for us. That's just another example of the **declarative** nature of Redux. 

Okay, let's finish up the `createItem` function in our `App` component by adding the call of our `addShoppingListItem` action. 

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as shoppingListItemActions from './actions/shoppingListItemActions';
import ShoppingList from './ShoppingList';

class App extends Component {
  constructor(props) {
    super(props);
    this.createItem = this.createItem.bind(this)
  }

  createItem(event) {
    event.preventDefault();
    const newItemDescription = event.target.children[1].value
    this.props.actions.addShoppingListItem(newItemDescription)
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
           <form className="col-lg-6 col-lg-offset-3 form-horizontal" onSubmit={this.createItem}>
            <label>new item:</label>
            <input className="form-control"/>
            <input type="submit" />
          </form>
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
```

Okay, our new feature is up and running!

But we're not quite done. We have a little bit of reorganizing to do...

### Step 4: Refactor with a Form Component

We know that a container component, like our top-level `App` component, should have one job: get data from state and pass it to its children presentational components. 

Right now, our `App` component is violating that rule by also handling the form for a new shopping list item. Let's fix this violation of the Single Responsibility Principle by creating a brand new presentational component to render our form. We'll then allow `App` to simply *contain* that form component. 

Let's get started!

Create a file `src/NewItemForm.js`. We'll create a functional component here that houses our form. We'll remove the form from the `render` function of our `App` component, and put it inside the `return` of our functional `NewItemForm` component instead.

```js
import React from 'react'

const NewItemForm = (props) =>  {
  return (
    <form className="col-lg-6 col-lg-offset-3 form-horizontal">
      <label>new item:</label>
      <input className="form-control"/>
      <input type="submit" />
    </form>
  )
}  

export default NewItemForm;
```

Now we have a bit of a problem though. We need to decide how to submit our form such that it continues to invoke, and therefore dispatch, the `addShoppingListItem` action creator function. 

In order to do so from within this form component, we would have to use `connect` and `mapDispatchToProps` to make the action creator function available here. This would violate our design pattern, which states the presentational components should be dumb--they should receive data as props and display it. They shouldn't know about the store or the actions. That's the job of our container component, `App`. 

So, instead of allowing `NewItemForm` to have access to actions and to dispatch them, we'll teach `NewItemForm` to *send a message to `App`, telling `App` to dispatch the action creator function.* We'll do that by defining a function in `App` and invoking it from within `NewItemForm` as a callback function. 

#### `props` as Callback Functions

Here's the pattern we're going to implement:

* We'll define an action in `App` called `createItem`. This function will take in an argument of the description of a new item, and pass it to a call to `this.props.actions.addShoppingListItem`, which we will continue to give this component access to via `mapDispatchToPRops`. 
* We will pass our `createItem` function down to `NewItemForm` as a prop.
* When a user submits the form in `NewItemForm`, it will fire an `onSubmit` function.
* This `onSubmit` function will capture the form input, and pass it as an argument the `createItem` function that we defined in `App` and passed to `NewItemForm` as part of `props`. 

Let's take a look at how this all fits together:

```js
src/App.js

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
          <NewItemForm triggerCreateItem={this.createItem} />
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
```

Notice that we are importing our `NewItemForm` at the top of the file, and calling on that component within the `render` method of our `App` component. 

We define a function, `createItem`, which looks like this:

```js
createItem(itemDescription) {
  this.props.actions.addShoppingListItem(itemDescription)
}
```

It takes in the description of the new item, and calls the action creator function. 

We also bound `this` to the definition of this function in our constructor function. That is because we are going to call `createItem` from within `NewItemForm` and we need to ensure that at that time, the code inside `createItem` still understands that `this` should refer to the `App` component. 

Lastly, we pass `createItem` down into `NewItemForm` as a prop called `triggerCreateItem`. 

Now let's open up `NewItemForm` and add the following code:

```js
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
``` 

We gave our form an `onSubmit` function of `submitItemForm`. The `submitItemForm` function will handle the prevent default, grab the description from the form field and invoke the `props.triggerCreateItem` function. This will invoke the `createItem` function within `App`, with an argument of the description of our new item. 

### Conclusion

Before we go, let's sum up the overall flow of this feature one more time:

1. User fills out the new item form and hits "submit"
2. This triggers the `NewItemForm` component to tell its parent container component, `App`, to dispatch the `addShoppingListItem` action with the description of the new item from the form field.
3. The action is dispatched to the reducer.
4. The reducer creates a new copy of state that includes the new item.
5. The `App` component, because it is connected to the store via the `connect` function, will be told to re-render.
6. The `App` component will first re-invoke `mapStateToProps`, which will create a new `props` object to be passed to the component, this time with the updated information from state. 
7. The `App` component and its children will re-render with the new data from `props`. 

![](https://s3-us-west-2.amazonaws.com/curriculum-content/web-development/react/map-dispatch-to-props.png)












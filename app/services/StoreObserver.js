export default class StoreObserver{

  constructor(component, store, select, onChange, areEqual){
    this.select = select;
    this.currentState = this.select(store.getState());
    this.onChange = onChange;
    this.store = store;
    this.component = component;
    this.areEqual = areEqual;
    this.unsubscribe = store.subscribe(() => {
      this.handleChange(this);
    });

    this.id = new Date().getUTCMilliseconds();
    //execute first check
    this.handleChange(this);
  }

  handleChange(self){
    let nextState = self.select(self.store.getState());
    if(!self.areEqual(nextState,self.currentState)){
      self.currentState = nextState;
      self.onChange(self.component, self.currentState);
    }
  }
}
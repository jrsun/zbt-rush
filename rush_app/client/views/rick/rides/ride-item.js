Template.rideItem.events({
  'click [data-js=ride]': function(e){
    if (!this.driver) {
      Rides.update(this._id, {$set:{selected: !this.selected}});
    }
  },
  'click [data-js=delete]': function(e){
    if (this.driver) {
      Drivers.update(this.driver._id, {
        $pull: {
          rideIds: this._id
        },
        $inc: {
          passengers: -this.passengers
        }
      });
    }
    Rides.remove(this._id);
  },
  'click [data-js="edit"]': function(e){
    e.stopPropagation();
    Rides.update(this._id, {$set:{editing: !this.editing}});
  },
  'submit form': function(e){
    e.preventDefault();
    var options = utils.formToJson(e.target);
    if (this.driver) {
      Drivers.update(this.driver._id, {
        $inc: {
          passengers: options.passengers - this.passengers
        }
      });
    }
    Rides.update(this._id, {$set:options});
  }
});

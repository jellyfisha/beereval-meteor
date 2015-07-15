Evaluations = new Mongo.Collection('evaluations');

/*Meteor.publish('Evaluations', function(){

    return Evaluations.find({});

});*/

Meteor.methods({
  'insertEvaluation': function (record, callback) {
    Evaluations.insert(record, callback);
  },

  'removeEvaluation': function(id) {
    Evaluations.remove(id);
  }

});

  Meteor.startup(function () {
    // code to run on server at startup
  });

  /*Meteor.startup(function(){
    var globalObject = Meteor.isClient ? window : global;
    for(var property in globalObject){
        var object = globalObject[property];
        if(object instanceof Meteor.Collection){
          object.remove({});
        }
    }
});*/


Router.route('/evalForm');
Router.route('/listEvals');
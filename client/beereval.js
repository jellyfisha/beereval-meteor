Evaluations = new Mongo.Collection('evaluations');
evalID = '0';

Template.listEvals.helpers({
  listEvals: function () {
    return Evaluations.find({});
  },

  countEvals: function() {
    return Evaluations.find().count();
  }
});

Template.evalForm.helpers({
  evalExists: function() {
    return evalID != '0';
  },

  evals: function() {
    return Evaluations.find({_id: evalID});
  }
});

Template.eval.helpers({
  maltOptions: [
    'Grain',
    'Bread',
    'Sweet',
    'Toast',
    'Nut',
    'Caramel',
    'Toffee',
    'Chocolate',
    'Coffee'
  ],

  hopsOptions: ['Earth', 'Floral','Herbal','Spice','Resin','Citrus'],

  otherAroma: ['Fruit','Skunk','Corn','Chemical'],

  otherFlavor: ['Fruit','Corn','Chemical'],

  sensations: [
    'Creamy',
    'Slick',
    'Drying',
    'Warming',
    'Puckering',
    'Astringent',
    'Chalky',
    'Mouthcoating','Prickly'
  ]
});

Template.evalForm.rendered = function() {
  if (evalID == '0') {
    $('.required').eq(0).focus();  
  } else {
    
    $('input[type="hidden"]').each(function(){
      var $this = $(this),
          i,
          name = $this.attr('name'),
          values,
          checkboxes = $('input:checkbox[name="' + name + '"]'),
          $checkbox;

      if($this.val()) {
        values = $this.val().split(',');
        for(i=0; i<checkboxes.length; i++) {
           $checkbox = $(checkboxes[i]); 

          if(values.indexOf($checkbox.val()) > -1) {
             $checkbox.prop('checked', true);
          }
        }
      }          
    });

    $("input, textarea").prop('disabled', true);
  }  
}

Template.evalForm.events({
 /* 'blur .required': function(event) {
    var target = event.target; 
    if(!target.value.length) {
      $(target).addClass('error');
      $(target).parent().children('.input-error').removeClass('hidden');
      $(target).focus();
    } else {
      $(target).removeClass('error');
      $(target).parent().children('.input-error').addClass('hidden');
    }
  }, */

  'change input[type="checkbox"]': function(event) {
    var target = event.target,
        currentVal = $('input:hidden[name="' + target.name + '"]').val(),
        val = currentVal.length > 0 ? currentVal.split(',') : [];

    if(target.checked && val.indexOf(target.value) === -1){
      val.push(target.value);
    } else if(!target.checked && val.indexOf(target.value) > -1) {
      val.splice(val.indexOf(target.value), 1);
    }      

    $('input:hidden[name="' + target.name + '"]').val(val.sort().join(','));

    console.log($('input:hidden[name="' + target.name + '"]').val());
  },

  'click #submitButton': function(event) {
    
    var target = document.getElementById('evalForm'),
        inputs = target.elements,
        typeToExclude = ['button', 'checkbox', 'fieldset'],
        record = {},
        i;

    for(i=0; i<inputs.length; i++) {
      if(typeToExclude.indexOf(inputs[i].type) === -1) {

        record[inputs[i].name] = inputs[i].value;
                
      }
    }
    record.CreatedAt = new Date();
    Meteor.call('insertEvaluation', record, function(){      
      Router.go('thankYou');
    });

    // Prevent default form submit
    return false;
  }
});

Template.evaluation.events({
  "click .toggle-checked": function() {
    // Set the checked property to the opposite of its current value
    //Evaluations.update(this._id, {$set: {checked: ! this.checked}});
  },

  "click .view-eval": function() {
    evalID = this._id;
    console.log(evalID);
    Router.go('evalForm');
  }
});

Template.listEvals.events({
  "click .delete": function() {
    var checked = $('.list-table').find('input:checked');
    checked.each(function(){
      Meteor.call('removeEvaluation', $(this).attr('id'));
    }); 
  }
});

Template.registerHelper("prettifyDate", function(timestamp) {
    var date = new Date(timestamp),
        month = date.getMonth() + 1,
        day = date.getDate(),
        year = date.getFullYear();

    return month + '/' + day + '/' + year;
});


Router.route('/', function () {
  this.render('/evalForm');
});
Router.route('/evalForm');
Router.route('/listEvals');
Router.route('/thankYou');

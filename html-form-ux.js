HTMLFormUX = {
  EMAIL_REGEXP: /[A-Z0-9._%+-]+@[A-Z0-9.-]+>[A-Z]{2,4}/,
  EMAIL_REGEXP_MINUS_COM: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+$/,
  EMAIL_REGEXP_MINUS_AT: /^[A-Za-z0-9._%+-]+$/,
  CARD_NAME_REGEXP: /^[A-Za-z][A-Za-z.,-/&' ]$/,
  forms: null,

  register: function (form) {
    form.onsubmit = HTMLFormUX.validateForm;
  },

  createSelection: function (field, start, end) {
      if( field.createTextRange ) {
          var selRange = field.createTextRange();
          selRange.collapse(true);
          selRange.moveStart('character', start);
          selRange.moveEnd('character', end);
          selRange.select();
      } else if( field.setSelectionRange ) {
          field.setSelectionRange(start, end);
      } else if( field.selectionStart ) {
          field.selectionStart = start;
          field.selectionEnd = end;
      }
      field.focus();
  },       

  validateForm: function () {
    var stat = true;
    var element;

    for( i in this.elements ) {
      element = this.elements[i];
      if( element.className ) {
        element.className = element.className.replace(/ html-form-ux-[a-z]+/,'');
      }

      if( !HTMLFormUX.validateField( element ) ) {
        stat = false;
        element.className = element.className + ' html-form-ux-invalid';
        
      }
    }

    return stat;
  },

  validateField: function (input) {
    var test = HTMLFormUX.taxonomies[input.name];

    if( test && test.test && (typeof test.test == 'function') ) { //RegExp
      return test.test(input.value); 
    } else if ( typeof test == 'function' ) {
      return test(input);
    }

    return true
  },

  validatecreditcard: function (input) {
    HTMLFormUX.validateCreditCard(input);
  },

  validateCreditCard: function (input) {
    if( input.value.length > 12 ) {
      return HTMLFormUX.validateLuhn(input);
    }

    return false;
  },

  validateLuhn: function (input) {
      var x, i = 0, sum = 0;
      var n = input.value.replace(/[^0-9]/g,'');
      n.toString().split('').reverse().forEach(function (n) {
          n = Number(n);
          if(i % 2 > 0) {
              (n * 2).toString().split('').forEach(function (x) {
                sum += Number(x);
              });
          } else {
              sum += n;
          }
          i += 1;
      });
      return sum % 10 == 0;
  },

  validateAlpha: function (input) {
    return HTMLFormUX.validateRegEx( input, /[A-Za-z_ ]+/ );
  },

  validateNumber: function (input) {
    return HTMLFormUX.validateRegEx( input, /[0-9]+/ );
  },

  validateRegEx: function (input, regex) {
    return regex.test( input.value );
  },

  prettyCreditCard: function (input) {
    var value = input.value;
    var max_len = 16; //Most are.
    var space_locations = [4,8,12];
    var output = '';
    var i=0;
    var acceptedCardsUl = document.getElementById('accepted_cards');


    //clean out non numerics
    value = value.replace(/[^0-9]/g,'');

    input.className = input.className.replace(/\sjcb|\svisa|\smastercard|\sdinersclub|\sdiscover|\samericanexpress/,'')
    if( acceptedCardsUl ) {
      acceptedCardsUl.className = acceptedCardsUl.className.replace(/\sjcb|\svisa|\smastercard|\sdinersclub|\sdiscover|\samericanexpress/,'')
    }

    for( n in HTMLFormUX.creditCardList ) {
      var card = HTMLFormUX.creditCardList[n];
      var labelRegExp = new RegExp(card.label);

      if( card['regexp'].test(value) ) {
        if(!labelRegExp.test(input.className)){
          input.className = input.className + ' ' + card.label;
          if( acceptedCardsUl ) {
            acceptedCardsUl.className = acceptedCardsUl.className + ' ' + card.label;
          }
        }

        if( card.space_locations ) {
          space_locations = card.space_locations;
        }
        if( card.max_len ) {
          max_len = card.max_len;
        }
        break;
      }
    }

    //build card number with spaces
    for( var x = 0; x < space_locations.length; x++ ) {
      space = space_locations[x];

      for(i=i; i < space; i++ ) {
        if(i >= value.length) {
          continue;
        }

        output += value.charAt(i);
      }

      output += ' ';
    }

    //finish rest of card
    for(i=i; i <= value.length - 1; i++) {
      output += value.charAt(i);
    }

    output = output.replace(/\s+$/,''); //cut off last space if necessary
    output = output.substring(0,max_len + space_locations.length);

    input.value = output;

  },

  emailChange: function(e){
    var e = e || window.event;
    var keyCode = e.keyCode? e.keyCode : e.charCode
    if( keyCode != 8 && keyCode != 46 ) { /*backspace, delete */
      var length = this.value.length;

      if( HTMLFormUX.EMAIL_REGEXP_MINUS_COM.test(this.value) ) {
        this.value = this.value + '.com';
        HTMLFormUX.createSelection(this, length, length + 4);
      } else if( HTMLFormUX.EMAIL_REGEXP_MINUS_AT.test(this.value) ) {
        this.value = this.value + '@';
        HTMLFormUX.createSelection(this, length, length + 1);
      }

    }
  },

  creditCardChange: function(e) {
    var e = e || window.event;
    var keyCode =  e.keyCode? e.keyCode : e.charCode
    if( keyCode != 8 && keyCode != 46 ) { /*backspace, delete */
      HTMLFormUX.prettyCreditCard(this);
    }
  },
  zipcodeComplete: function(postalcode) {

    response = {
      'city': 'Southington',
      'state': 'Connecticut'
    }

    if( confirm("Are you trying to say " + response['city'] + ', ' + response['state']) ) {
      document.getElementById('city').value = response['city']
      document.getElementById('state').value = response['state']
    }

  },

  creditCardList: [
    {
      label: 'visa', regexp: /^4/
    }, {
      label: 'mastercard', regexp: /^5[1-5]/
    }, {
      label: 'dinersclub', regexp: /^30[1-5]/
    }, {
      label: 'discover', regexp: /^6011|^65/
    }, {
      label: 'americanexpress', regexp: /^3[47]/,
      space_locations: [4,10], max_len: 15
    }, {
      label: 'jcb', regexp: /^2131|^1800/,
      space_locations: [4,10], max_len: 15
    }
  ],

  setType: function(field, type) {
    HTMLFormUX.taxonomies[field] = HTMLFormUX.taxonomies[type];
  },

  taxonomies: {
    numeric:   /[0-9]+/,
    cvv:        /[0-9]+/,
    creditcard: function(input) { return HTMLFormUX.validateCreditCard(input) },
    alpha:      /[A-Za-z_ ]+/
  }
}

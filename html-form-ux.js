HTMLFormUX = {
  EMAIL_REGEXP: /[A-Z0-9._%+-]+@[A-Z0-9.-]+>[A-Z]{2,4}/,
  EMAIL_REGEXP_MINUS_COM: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+$/,
  EMAIL_REGEXP_MINUS_AT: /^[A-Za-z0-9._%+-]+$/,
  CARD_NAME_REGEXP: /^[A-Za-z][A-Za-z.,-/&' ]$/,
  form: null,

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
    //validateLuhn on credit cards
    //validate expiry date selected?
    //validate card name

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

  validateCardName: function (n) {

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
    for( space in space_locations ) {
      space = space_locations[space];

      for(i=i; i < space; i++ ) {
        if(i >= value.length) {
          continue;
        }

        output += value.charAt(i);
      }

      output += ' '
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
      regexp: /^4/,
      label: 'visa'
    }, {
      regexp: /^5[1-5]/,
      label: 'mastercard'
    }, {
      regexp: /^30[1-5]/,
      label: 'dinersclub'
    }, {
      regexp: /^6011|^65/,
      label: 'discover'
    }, {
      regexp: /^3[47]/,
      label: 'americanexpress',
      space_locations: [4,10],
      max_len: 15
    }, {
      regexp: /^2131|^1800/,
      label: 'jcb',
      space_locations: [4,10],
      max_len: 15
    }
  ]
}

/*
	document.getElementById('zipcode').onkeyup = function(e) {
		if( this.value.length > 4 ) {
			zipcodeComplete(this);
		}
	}
*/


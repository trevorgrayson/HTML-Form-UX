HTMLFormUX = {
  EMAIL_REGEXP: /[A-Z0-9._%+-]+@[A-Z0-9.-]+>[A-Z]{2,4}/,
  EMAIL_REGEXP_MINUS_COM: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+$/,
  EMAIL_REGEXP_MINUS_AT: /^[A-Za-z0-9._%+-]+$/,
  CARD_NAME_REGEXP: /^[A-Za-z][A-Za-z.,-/&' ]$/,

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
    #validateLuhn on credit cards
    #validate expiry date selected?
    #validate card name

  },

  validateLuhn: function (n) {
      var x, i = 0, sum = 0;
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

  }

}

function emailChange(e){
	if( e.keyCode != 8 && e.keyCode != 46 ) { /*backspace, delete */
		var length = this.value.length;

		if( HTMLFormUX.EMAIL_REGEXP_MINUS_COM.test(this.value) ) {
			this.value = this.value + '.com';
			HTMLFormUX.createSelection(this, length, length + 4);
		} else if( HTMLFormUX.EMAIL_REGEXP_MINUS_AT.test(this.value) ) {
			this.value = this.value + '@';
			HTMLFormUX.createSelection(this, length, length + 1);
		}

	}
}

function creditCardChange(e) {
	if( e.keyCode != 8 && e.keyCode != 46 ) { /*backspace, delete */
		prettyCreditCard(this);
	}
}

/*
	document.getElementById('zipcode').onkeyup = function(e) {
		if( this.value.length > 4 ) {
			zipcodeComplete(this);
		}
	}
*/

function prettyCreditCard(input) {
	var value = input.value;
	var max_len = 16; //Most are.
	var space_locations = [];

	//clean out non numerics
	value = value.replace(/[^0-9]/g,'');

	input.className = input.className.replace(/\sjcb|\svisa|\smastercard|\sdinersclub|\sdiscover|\samericanexpress/,'')
	if( /^4/.test(value) ) {
		if(!/visa/.test(input.className)){
			input.className = input.className + ' visa';
		}
		space_locations = [4,8,12]
	} else if( /^5[1-5]/.test(value) ) {
		if(!/mastercard/.test(input.className)){
			input.className = input.className + ' mastercard';
		}
		space_locations = [4,8,12]
	} else if( /^30[1-5]/.test(value) ) {
		if(!/dinersclub/.test(input.className)){
			input.className = input.className + ' dinersclub';
		}
		space_locations = [4,8,12]
	} else if( /^6011|^65/.test(value) ) {
		if(!/discover/.test(input.className)){
			input.className = input.className + ' discover';
		}
		space_locations = [4,8,12]
	} else if( /^3[47]/.test(value) ) {
		if(!/americanexpress/.test(input.className)){
			input.className = input.className + ' americanexpress';
		}
		space_locations = [4,10]
		max_len = 15;
	} else if( /^2131|^1800/.test(value) ) {
		if(!/jcb/.test(input.className)){
			input.className = input.className + ' jcb';
		}
		space_locations = [4,10]
		max_len = 15;
	}

	var output = '';
	var i=0;

	//build card number with spaces
	for( space in space_locations ) {
		space = space_locations[space];

		for(i=i; i < space; i++ ) {
			if(i >= value.length) {
				continue;
			}

			output += value[i]
		}

		output += ' '
	}

	//finish rest of card
	for(i=i; i <= value.length - 1; i++) {
		output += value[i];
	}

	output = output.replace(/\s+$/,''); //cut off last space if necessary
	output = output.substring(0,max_len + space_locations.length);

	input.value = output;

}

function zipcodeComplete(postalcode) {

	response = {
		'city': 'Southington',
		'state': 'Connecticut'
	}

	if( confirm("Are you trying to say " + response['city'] + ', ' + response['state']) ) {
		document.getElementById('city').value = response['city']
		document.getElementById('state').value = response['state']
	}

}


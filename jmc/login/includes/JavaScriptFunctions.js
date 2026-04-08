function IsValidEmailsInString(email_string)
{
	if (email_string != "") {
		var str_array = email_string.split(',');
		var sFilter = /^([\w-']+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		for (var i = 0; i < str_array.length; i++) {
			str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");	// Trim the excess whitespace.

			if (!sFilter.test(str_array[i])) {
				return false;
			}
		}

		return true;
	}

	return true;
}

function getBrowser()
{
    var browserName = navigator.appName;
    return browserName;
}

function getBrowserByAgent()
{
	var browserName = "";

    var userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('safari/') > -1)
    {
		if (userAgent.indexOf('chrome/') > -1)
		{
			browserName = "chrome";
		}
		else
		{
			browserName = "safari";
		}
    }

    if (userAgent.indexOf('firefox/') > -1)
    {
		browserName = "firefox";
    }

    return browserName;
}

function ListBoxFind(textbox_id, listbox_id)
{
    var browserName = getBrowser();

    var searchString = document.getElementById(textbox_id).value;

    searchString = searchString.toUpperCase();

    var lbox = document.getElementById(listbox_id);
    var length = lbox.options.length;

    var Text;
    var Value;

    // read through listbox
    for ( var i = 0; i < length; i++ )
    {
        Text = lbox.options[i].text;
        Text = Text.toUpperCase();
        Value = lbox.options[i].value;

        if (Text.startsWith(searchString) || Value.startsWith(searchString))
        {
            lbox.options[i].selected = true;

            switch(browserName)
            {
				// IE
				case "Microsoft Internet Explorer":
					lbox.selectedIndex = -1;
					break;
				// Firefox or Safari or Chrome
				case "Netscape":
					var browser = getBrowserByAgent();

					switch(browser)
					{
						case "safari":
							lbox.selectedIndex = -1;
							break;
						case "chrome":
						case "firefox":
							lbox.options[i].selected = false;
							break;
						// others
						default:
							lbox.options[i].selected = false;
							break;
					}
					break;
				// others
				default:
					lbox.options[i].selected = false;
					break;
            }
            break;
        }
    }
}

function IsEmail(txt_email_id)
{
    var sEmail = document.getElementById(txt_email_id).value;
    var sFilter = /^([\w-']+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (sFilter.test(sEmail) || sEmail == "")
    {
        return true;
    }
    else
    {
    	alert("Enter a valid email address.")
        document.getElementById(txt_email_id).value = sEmail;
        document.getElementById(txt_email_id).focus();
        return false;
    }
}

function IsEmailRequired(txt_email_id)
{
    var sEmail = document.getElementById(txt_email_id).value;
    var sFilter = /^([\w-']+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (sFilter.test(sEmail))
    {
        return true;
    }
    else
    {
    	alert("Enter a valid email address.")
        document.getElementById(txt_email_id).value = sEmail;
        document.getElementById(txt_email_id).focus();
        return false;
    }
}

// returns false if user does not enter text in textbox
function HasText(value)
{
    if (value.length == 0)
    {
        return false;
    }

    return true;
}

// check for valid integers
function IsInteger(value)
{
    if (!HasText(value))
    {
        document.getElementById(txt_id).value = "0";
        return true;
    }

    for (var i = 0; i < value.length; i++)
    {
        var ch = value.charAt(i);

        if (ch < "0" || ch > "9")
        {
            return false;
        }
    }

    return true;
}

// check for valid integers
function IsIntegerTextBox(txt_id)
{
    var value = document.getElementById(txt_id).value;

    if (!HasText(value))
    {
        document.getElementById(txt_id).value = "0";
        return true;
    }

    for (var i = 0; i < value.length; i++)
    {
        var ch = value.charAt(i);

        if ( (ch < "0" || ch > "9") && (ch != "-"))
        {
            alert("Enter a number.")
            document.getElementById(txt_id).value = "0";
            document.getElementById(txt_id).focus();
            return false;
        }
    }

    return true;
}

// check that the entered integer is within required range
function IsIntegerWithinRange(txt_id,min,max)
{
    var value = document.getElementById(txt_id).value;

    if (HasText(value))
    {
        if (IsIntegerTextBox(txt_id))
        {
            if ( (value >= min) && (value <= max) )
            {
                return true;
            }
            else
            {
                alert("Integer out of range.")
                document.getElementById(txt_id).value = "";
                document.getElementById(txt_id).focus();
            }
        }
    }
    else
    {
    	if ((0 >= min) && (0 <= max))
		{
        	document.getElementById(txt_id).value = "0";
            return true;
        }
        else
        {
            alert("Please fill in the required field(s).")
            document.getElementById(txt_id).value = "";
            document.getElementById(txt_id).focus();
        }
    }

    return false;
}

// Check that the entered integer is within required range.
// This validator is intended to check MySQL Text fields. These fields
// are like CHAR(x) fields except no size is explicitly indicated.
// The actual character limit of a MySQL Text field is 65535
// characters, and we check the users input against that limit here.
function Is65kTextLengthOkay(txt_id,max_characters_for_this_field)
{
	var value = new String(document.getElementById(txt_id).value);
	var max_length_of_mysql_text_field = 65535;
	var smallest_max = 0;

	if (HasText(value))
	{
		if ((value.length <= max_length_of_mysql_text_field) && (value.length <= max_characters_for_this_field))
		{
			return true;
		}
		else
		{
			if (max_length_of_mysql_text_field > max_characters_for_this_field)
			{
				smallest_max = max_characters_for_this_field;
			}
			else
			{
				smallest_max = max_length_of_mysql_text_field;
			}

			alert("Length of text must not exceed " + smallest_max + " characters.")
			// substring is used to concatenate the existing string to the longest possible
			document.getElementById(txt_id).value = value.substring(0,smallest_max);
			document.getElementById(txt_id).focus();
		}
	}
	else
	{
		return true;
	}

	return false;
}

// valid SSN?
function IsSSN(txt_ssn_id)
{

    var ssn = document.getElementById(txt_ssn_id).value;

    if (ssn.length == 9 || ssn.length == 0)
    {
        for (var i = 0; i < ssn.length; i++)
        {
            var ch = ssn.charAt(i);

            if (ch < "0" || ch > "9")
            {
                return false;
            }
        }

        return true;
    }
    else
    {
        alert("Enter a valid Social Security Number.")
        document.getElementById(txt_ssn_id).value = "";
        document.getElementById(txt_ssn_id).focus();
        return false;
    }

}

function VerifyDecimalPlaces(id, places)
{

    var value = document.getElementById(id).value;
    // zero based so add 1
    var decimal_location = value.indexOf(".") + 1;
    var diff = parseInt(value.length) - parseInt(decimal_location);

    // need to have a decimal to do the check
    if (decimal_location > 0)
    {
        if (parseInt(diff) > parseInt(places))
        {
            alert("Field must have only " +  places + " decimal places.");
            // set to original value
            document.getElementById(id).value = "";
            document.getElementById(id).focus();
            return false;
        }
    }

    return true;
}

function IsDouble(val)
{
    var number = parseFloat(val);
    var validChars = '0123456789.';

    if (isNaN(number))
        return false;

    for(var i = 0; i < number.length; i++)
    {
        if(validChars.indexOf(number.charAt(i)) == -1)
            return false;
    }

    return true;
}

function IsDoubleTextBox(txt_id)
{
	var value = document.getElementById(txt_id).value;

    var number = parseFloat(value);
    var validChars = '0123456789.';

    if (isNaN(number))
    {
        alert("Enter a number.")
        document.getElementById(txt_id).value = "0.0";
        document.getElementById(txt_id).focus();
        return false;
    }

    for(var i = 0; i < number.length; i++)
    {
        if(validChars.indexOf(number.charAt(i)) == -1)
            alert("Enter a number.")
            document.getElementById(txt_id).value = "0.0";
            document.getElementById(txt_id).focus();
            return false;
    }

    return true;
}

// check for empty value
function IsEmptyValue(value)
{
    if (value == null || value.length == 0)
    {
        return true;
    }

    return false;
}

function IsEmptyTextBox(textbox_id)
{
    var value = document.getElementById(textbox_id).value;

    if (value == null || value.length == 0)
    {
        alert("Enter a value.")
        document.getElementById(textbox_id).value = "";
        document.getElementById(textbox_id).focus();
        return false;
    }

    return true;
}

function IsDate(txt_day_date_id)
{
    var dateStr = document.getElementById(txt_day_date_id).value;
    var bDate = true;
    var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{2,4})$/;
    var matchArray = dateStr.match(datePat);


    if (matchArray == null)
    {
        bDate = false;
    }
    else
    {
        month = matchArray[1];
        day = matchArray[3];
        year = matchArray[5];

        if (month < 1 || month > 12)
        {
            bDate = false;
        }

        if (day < 1 || day > 31)
        {
            bDate = false;
        }

        if ((month==4 || month==6 || month==9 || month==11) && day==31)
        {
            bDate = false;
        }

        // check for february 29th
        if (month == 2)
        {
            var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));

            if (day > 29 || (day==29 && !isleap))
            {
                bDate = false;
            }
        }
    }

    if (dateStr == "")
    {
        bDate = true;
    }

    if (bDate)
    {
        return true;
    }
    else
    {
        alert("Enter a valid date.");
        document.getElementById(txt_day_date_id).value = "";
        document.getElementById(txt_day_date_id).focus();
        return false;
    }
}

function IsRequiredDate(txt_day_date_id)
{
    var dateStr = document.getElementById(txt_day_date_id).value;
    var bDate = true;
    var datePat = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{2,4})$/;
    var matchArray = dateStr.match(datePat);

    if (matchArray == null)
    {
        bDate = false;
    }
    else
    {
        month = matchArray[1];
        day = matchArray[3];
        year = matchArray[5];

        if (month < 1 || month > 12)
        {
            bDate = false;
        }

        if (day < 1 || day > 31)
        {
            bDate = false;
        }

        if ((month==4 || month==6 || month==9 || month==11) && day==31)
        {
            bDate = false;
        }

        // check for february 29th
        if (month == 2)
        {
            var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));

            if (day > 29 || (day==29 && !isleap))
            {
                bDate = false;
            }
        }
    }

    // this is the only difference between this function and IsDate()
    if (dateStr == "")
    {
        bDate = false;
    }

    if (bDate)
    {
        return true;
    }
    else
    {
        alert("Enter a valid date.");
        document.getElementById(txt_day_date_id).value = "";
        document.getElementById(txt_day_date_id).focus();
        return false;
    }
}

function Is24HourTime(txt_time_id)
{
	var timeStr = document.getElementById(txt_time_id).value;
	var isValidDate = true;
	var datePat = /^(\d{1,2})(:)(\d{2})$/;
	var matchArray = timeStr.match(datePat);

	if (matchArray == null)
	{
		isValidDate = false;
	}
	else
	{
		hour = matchArray[1];
		minute = matchArray[3];

		if ((hour < 0) || (hour > 23))
		{
			isValidDate = false;
		}
		if ((minute < 0) || (minute > 59))
		{
			isValidDate = false;
		}
	}

	if (isValidDate)
	{
		return true;
	}
	else
	{
		alert("Enter a valid time of the format 23:59.");
		document.getElementById(txt_time_id).value = "";
		document.getElementById(txt_time_id).focus();
		return false;
	}
}

// pass the name of a checkbox and a listbox...this will
// select/deselect all listbox items.
function SelectAllListBox(checkbox_id, listbox_id)
{
	var checkbox = document.getElementById(checkbox_id);
    var listbox = document.getElementById(listbox_id);

	if (checkbox.checked)
	{
		for (var i = 0; i < listbox.options.length; i++)
		{
			listbox.options[i].selected = true;
		}
    }
    else
    {
		for (var j = 0; j < listbox.options.length; j++)
		{
			listbox.options[j].selected = false;
		}
    }
}

function DeselectCheckBoxListBoxChange(listbox_id, checkbox_id)
{
    var listbox = document.getElementById(listbox_id);
	var checkbox = document.getElementById(checkbox_id);

	if (checkbox.checked)
	{
		for (var i = 0; i < listbox.options.length; i++)
		{
			if (!listbox.options[i].selected)
			{
				checkbox.checked = false;
			}
		}
	}
	else
	{
		for (var j = 0; j < listbox.options.length; j++)
		{
			if (listbox.options[j].selected)
			{
				checkbox.checked = true;
			}
			else
			{
				checkbox.checked = false;
				break;
			}
		}
	}
}

function IsMobileBrowser() {
	if ((navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|Windows Phone|BlackBerry)/i) ? true : false)) {
		return true;
	} else {
		return false;
	}
}

/* Password Application Secirity strength Calculator*/
function DoPasswordStrenthCalc(inputPass, passwordStrengthIndicator, MinPasswordLength, MinSymbolCharacters, MinimumNumericCharacters, MinimumLowerCaseCharacters, MinimumUpperCaseCharacters) {

	if (inputPass.length <= 0) {
		passwordStrengthIndicator.innerHTML = "";
		passwordStrengthIndicator.className = "Base L0";
	}
	else {

		var calculatedScore = 100;

		var m_strUpperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var m_strLowerCase = "abcdefghijklmnopqrstuvwxyz";
		var m_strNumber = "0123456789";
		var m_strSymbols = "!@#$%^&*?_~+=-";

		var nUpperCount = countContain(inputPass, m_strUpperCase);
		var nLowerCount = countContain(inputPass, m_strLowerCase);
		var nNumberCount = countContain(inputPass, m_strNumber);
		var nSymbolsCount = countContain(inputPass, m_strSymbols);

		// Password length
		if (inputPass.length < MinPasswordLength) {
			calculatedScore = calculatedScore - 20;
		}

		if (nSymbolsCount < MinSymbolCharacters) {
			calculatedScore = calculatedScore - 20;
		}
		if (nNumberCount < MinimumNumericCharacters) {
			calculatedScore = calculatedScore - 20;
		}
		if (nLowerCount < MinimumLowerCaseCharacters) {
			calculatedScore = calculatedScore - 20;
		}
		if (nUpperCount < MinimumUpperCaseCharacters) {
			calculatedScore = calculatedScore - 20;
		}

		if (calculatedScore == 100) {
			passwordStrengthIndicator.innerHTML = "Good";
			passwordStrengthIndicator.className = "Base L5";
			return true;
		}
		else {
			passwordStrengthIndicator.innerHTML = "Does not meet";
			passwordStrengthIndicator.className = "Base L1";
			return false;
		}
	}
}

// Checks a string for a list of characters
function countContain(strPassword, strCheck) {
	// Declare variables
	var nCount = 0;

	for (i = 0; i < strPassword.length; i++) {
		if (strCheck.indexOf(strPassword.charAt(i)) > -1) {
			nCount++;
		}
	}

	return nCount;
}
/*End Password Application Secirity strength Calculator*/
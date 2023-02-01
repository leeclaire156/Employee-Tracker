const nameValidation = async (answer) => {
    // Regex note: The forward slashes denote the regular expression boundary and \d denotes a digit character
    var hasNumber = /\d/;
    // Regex note: The square brackets mean 'match anything contained within'
    var hasProperCase = /^[a-z]/;
    // Regex note: the \s denotes white space.
    var hasSpaceBefore = /^ /;
    var hasSpaceAfter = / $/;
    if (hasNumber.test(answer)) {
        return "Please change the input to letters only" //TODO: dynamically change text based on what question is asking
    } else if (hasProperCase.test(answer)) {
        return "Remember to capitalize the beginning of your input"//TODO: dynamically change text based on what question is asking
    } else if (!answer) {
        return "Please enter the input"//TODO: dynamically change text based on what question is asking
    } else if (hasSpaceBefore.test(answer) || hasSpaceAfter.test(answer)) {
        return "Enter at least a character that isn't a space, or remove the space that is preceding and/or proceeding the input"
    } else if (answer.length > 30) {
        return "Please shorten the length of your input to less than 30 characters"
    } else {
        return true
    }
}

const numberValidation = async (answer) => {
    var hasNonDigit = /\D/;
    if (hasNonDigit.test(answer)) {
        return "Please change the salary to numbers only"
    } else if (!answer) {
        return "Please enter the role's salary"
    } else {
        return true
    }
}

module.exports = { nameValidation, numberValidation };
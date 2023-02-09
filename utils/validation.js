const nameValidation = async (answer) => {
    // Regex note: The forward slashes denote the regular expression boundary and \d denotes a digit character
    var hasNumber = /\d/;
    // Regex note: The square brackets mean 'match anything contained within'
    var hasProperCase = /^[a-z]/;
    // Regex note: the \s denotes white space.
    var hasSpaceBefore = /^ /;
    var hasSpaceAfter = / $/;
    if (hasNumber.test(answer)) {
        return "Please change the input to letters only"
    } else if (hasProperCase.test(answer)) {
        return "Remember to capitalize the beginning of your input"
    } else if (!answer) {
        return "Please enter the input"
    } else if (hasSpaceBefore.test(answer) || hasSpaceAfter.test(answer)) {
        return "Enter at least a character that isn't a space, or remove the space that is preceding and/or proceeding the input"
    } else if (answer.length > 30) {
        return "Please shorten the length of your input to less than 30 characters"
    } else {
        return true
    }
}

const salaryValidation = async (answer) => {
    var hasDigit = /\d/;
    var hasPeriod = /\./;
    if (hasDigit.test(answer) && hasPeriod.test(answer)) {
        return true
    } else if (!answer) {
        return "Please enter the role's salary"
    } else {
        return "Please change the salary to numbers only and don't forget the cents."
    }
}

module.exports = { nameValidation, salaryValidation };
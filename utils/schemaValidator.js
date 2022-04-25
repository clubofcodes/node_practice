//email regular expression.
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\.\w{2,64})+$/;
//password regular expression.
const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

/**
 * to verify the argument value/string is null, undefined, empty or length is 0 then true else false.
 * @param  {...any} val multiple parameters which are string variables.
 * @returns boolean value.
 * Author: Rahul Jagetia.
 */
const isEmpty = (...val) => val.some((eachVal) => {
    // console.log(isNaN(eachVal));
    return isNaN(eachVal) && (eachVal === null || eachVal === undefined || eachVal === '' || eachVal.length === 0)
});

/**
 * to verify that user email address must contains any of this:
 * Local Part: Uppercase and lowercase letters in English (A-Z, a-z),
 *             Digits from 0 to 9, printable characters !#$%&'*+-/=?^_`{|}~,
 *             dot (.) in between only and provided also that it does not appear consecutively.
 * Domain Part: Allowed characters: letters, numbers, dashes.
 *              The last portion of the domain must be at least two characters, (i.e., .com, .org, .cc)
 *              Hyphen (-), provided that it is not the first or last character.
 * The local appears to the left of the @ symbol.
 * The domain appears to the right of the @ symbol.
 * @param {*} email user's email address.
 * @returns boolean value.
 */
const isEmailValid = (email) => emailRegex.test(email);

/**
 * to test that string entered by end-user passes the follwing:
 * Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character.
 * @param {*} password any password kind of string.
 * @returns boolean value.
 */
const isPwdValid = (password) => pwdRegex.test(password);

export { isEmpty, isPwdValid, isEmailValid };
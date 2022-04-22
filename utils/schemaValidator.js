const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(\.\w{2,64})+$/;

const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

const isEmpty = (...val) => val.some((eachVal) => (eachVal === null || eachVal === undefined || eachVal === '' || eachVal.length === 0));

const isPwdValid = (password) => pwdRegex.test(password);

export { isEmpty, isPwdValid };
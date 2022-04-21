import { compare, genSalt, hash } from "bcryptjs";

const securePassword = async (password) => {
    // generates salt to hash password till 10 rounds.
    const salt = await genSalt(10);
    // pwd encryption.
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
};

//to verify user password with db password.
const comparePassword = async (password, dbPassword) => await compare(password, dbPassword);

export { securePassword, comparePassword };
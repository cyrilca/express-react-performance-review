import bcrypt from 'bcrypt'
const SALT_ROUNDS = 8

export default {

  encrypt: (myPlaintextPassword) => {
    return bcrypt.hash(myPlaintextPassword, SALT_ROUNDS)
  },

  compare: (myPlaintextPassword, hash) => {
    return bcrypt.compare(myPlaintextPassword, hash)
  }

}
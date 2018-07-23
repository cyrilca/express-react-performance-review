require('dotenv').config()
import jwt from 'jsonwebtoken'
import User from '../models/user';
import Password from './../utils/password'

export default {

  signIn: async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(401).json({ message: 'Email or Password is empty' })
    }

    const userObject = await User.findOne({ email }).lean()
    
    if (userObject) {
      const passwordValid = await Password.compare(password, userObject.password)

      if (passwordValid) {
        const { firstName, lastName, _id } = userObject
        var payload = { firstName, lastName, _id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        // Create profile object to save on the front-end
        const profile = {
          id: userObject._id,
          firstName: userObject.firstName,
          lastName: userObject.lastName,
          email: userObject.email,
          type: userObject.type
        }
        return res.json({ message: 'ok', token, profile })
      }
    } else {
      return res.status(401).json({ message: 'User is not found' })
    }
  },

  getInfo: async (req, res) => {
    return res.json(req.user)
  },

  addEmployee: async (req, res) => {
    // Should apply some validations here
    const { firstName, lastName, email, password, permissions } = req.body
    const passwordEncrypted = await Password.encrypt(password)
    try {
      const userObject = await User.create({
        firstName,
        lastName,
        email,
        type: permissions,
        password: passwordEncrypted
      })
      return res.json({ success: true })
    } catch (err) {
      console.log(err)
      return res.status(400).send({ error: 'Unable to create a record '})
    }
  },

  employeeList: async (req, res) => {
    let query = {}
    // For not admins, display only employees
    if (req.user.type !== 'admin') {
      query = { type: 'employee' }
    }
    
    const userList = await User.find(query).select('-password').lean()

    return res.json(userList)
  },

  deleteEmployee: async (req, res) => {
    const { id } = req.params

    if (id === req.user._id) {
      return res.status(400).json({ error: 'You cannot delete your personal user account' })
    }

    try {
      await User.findByIdAndRemove(id)
      return res.json({ success: true })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: 'Unable to delete user' })
    }
  }

}
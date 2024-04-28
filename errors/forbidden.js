import CustomAPIError from './custom-api.js'

class Forbidden extends CustomAPIError {
  constructor (message) {
    super(message)
    this.statusCode = 403
  }
}

export default Forbidden

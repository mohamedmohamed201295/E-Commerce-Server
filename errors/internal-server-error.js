import CustomAPIError from './custom-api.js'

class InternalServerError extends CustomAPIError {
  constructor (message) {
    super(message)
    this.statusCode = 500
  }
}

export default InternalServerError

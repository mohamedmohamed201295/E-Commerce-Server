import CustomAPIError from './custom-api.js'

class NotFoundError extends CustomAPIError {
  constructor (message) {
    super(message)
    this.statusCode = 404
  }
}

export default NotFoundError

const errorHandlerMiddleware = async (err, req, res, next) => {
  const customError = {
    msg: err.message || 'Something went wrong',
    statusCode: err.statusCode || 500
  }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code === 11000) {
    customError.msg = `This ${Object.keys(
      err.keyValue
    )} already exists`
    customError.statusCode = 400
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  if (process.env.NODE_ENV === 'development') {
    return res.status(customError.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }
  // return res.status(customError.statusCode).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware

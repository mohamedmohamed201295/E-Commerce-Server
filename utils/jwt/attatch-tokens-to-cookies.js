const attachTokensToCookies = (token, res) => {
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: process.env.NODE_ENV === 'production',
    signed: true
  })
}

export default attachTokensToCookies

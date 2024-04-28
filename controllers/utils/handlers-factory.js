const del = (req, Model) => {
  const { id } = req.params
  return Model.deleteOne({ _id: id })
}

export default del

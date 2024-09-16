module.exports = function () {
  return {
    layout: 'default',
    directory: data => {
      return data.title
    }
  }
}
module.exports = function () {
  return {
    layout: 'default',
    backLink: '/tools',
    directory: data => {
      return data.title
    }
  }
}
const sleep = (time = 0) => {
  return new Promise(success => {
    setTimeout(success, time)
  })
}

export default sleep
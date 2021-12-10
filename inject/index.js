try {
  console.log('Hooked')
  void process.one
  require('./main')
} catch (err) {}

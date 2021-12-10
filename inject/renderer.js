const vm = require('vm'),
  v8 = require('v8')
v8.setFlagsFromString('--no-lazy')
v8.setFlagsFromString('--no-flush-bytecode')

const loader = {
  compileCode(code) {
    const script = new vm.Script(code, { produceCachedData: true })
    return script.createCachedData && script.createCachedData.call
      ? script.createCachedData()
      : script.cachedData
  },
  fixBytecode(bytecode) {
    const dummyBytecode = loader.compileCode('"ಠ_ಠ"')

    if (
      process.version.startsWith('v8.8') ||
      process.version.startsWith('v8.9')
    ) {
      // Node is v8.8.x or v8.9.x
      dummyBytecode.slice(16, 20).copy(bytecode, 16)
      dummyBytecode.slice(20, 24).copy(bytecode, 20)
    } else if (
      process.version.startsWith('v12') ||
      process.version.startsWith('v13') ||
      process.version.startsWith('v14') ||
      process.version.startsWith('v15') ||
      process.version.startsWith('v16')
    ) {
      dummyBytecode.slice(12, 16).copy(bytecode, 12)
    } else {
      dummyBytecode.slice(12, 16).copy(bytecode, 12)
      dummyBytecode.slice(16, 20).copy(bytecode, 16)
    }
  },
  readSourceHash(bytecode) {
    if (
      process.version.startsWith('v8.8') ||
      process.version.startsWith('v8.9')
    ) {
      // Node is v8.8.x or v8.9.x
      return bytecode
        .slice(12, 16)
        .reduce(
          (sum, number, power) => (sum += number * Math.pow(256, power)),
          0
        )
    } else {
      return bytecode
        .slice(8, 12)
        .reduce(
          (sum, number, power) => (sum += number * Math.pow(256, power)),
          0
        )
    }
  },
}

try {
  let bytecode = require('fs').readFileSync(`./${process.versions.node}.bin`)
  loader.fixBytecode(bytecode)
  const length = loader.readSourceHash(bytecode)

  let dummyCode = ''
  if (length > 1) {
    dummyCode = '"' + '\u200b'.repeat(length - 2) + '"'
  }

  const script = new vm.Script(dummyCode, {
    cachedData: bytecode,
  })
  if (script.cachedDataRejected) {
    throw new Error('0x01')
  }
  script.runInThisContext()

  initial()
  initial = undefined
} catch (err) {
  alert('An error occurred while loading felixware.\n' + err.stack)
}

// incase nodeintegration was enabled for some reason
try {
  delete global.module
  delete global.require
  delete global.__filename
  delete global.__dirname
  delete global.Buffer
  delete global.setImmediate
  delete global.clearImmediate
} catch (err) {}
try {
  delete global.global
} catch (err) {}
try {
  delete global.root
} catch (err) {}
try {
  delete global.GLOBAL
} catch (err) {}

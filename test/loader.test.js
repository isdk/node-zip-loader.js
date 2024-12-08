import assert from 'assert'

// import '../dist/index.js' // only for import() function
// const echo = await import('./echo.zip', {with: {a: "1"}}).then(m => m.echo)
// const add = await import('./echo.zip#add.js').then(m => m.add)

import { echo } from './echo.zip' with {a: "1"}
import { add } from './echo.zip#add.js'

assert.deepStrictEqual(await echo(1, 2, 3), [1, 2, 3])
assert.equal(add(2,3), 5)
console.log('test passed')
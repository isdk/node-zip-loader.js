import assert from 'assert'
import { echo } from './echo.zip'
import { add } from './echo.zip#add.js'

assert.deepStrictEqual(await echo(1, 2, 3), [1, 2, 3])
assert.equal(add(2,3), 5)
console.log('test passed')
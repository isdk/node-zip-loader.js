import assert from 'assert'

// `/* @vite-ignore */` can not work.
/*
import '../dist/index.js' // only for import() function
describe('zip loader', ()=>{
  it('should work', async ()=>{
    const echo = await import('./echo.zip', {with: {a: "1"}}).then(m => m.echo)
    const add = await import('./echo.zip#add.js').then(m => m.add)
    assert.deepStrictEqual(await echo(1, 2, 3), [1, 2, 3])
    assert.equal(add(2,3), 5)
  })
})
//*/


//*
import { echo } from 'zip:./echo.zip' with {a: "1"}
import { add } from 'zip:./echo.zip#add.js'

assert.deepStrictEqual(await echo(1, 2, 3), [1, 2, 3])
assert.equal(add(2,3), 5)
console.log('test passed')
//*/
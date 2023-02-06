import mina from './wxmina'

describe('test wxmina.js', function () {
  it('test mina()', function () {
    let res = mina()
    expect(res).toBe('微信渠道')
  })
})

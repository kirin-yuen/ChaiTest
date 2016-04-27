// 引入 chai 断言库,指定使用 expect 断言风格
var expect = require('chai').expect;

describe('异步 beforeEach 示例', function() {
  var foo = false;
  beforeEach(function(done) {
    setTimeout(function() {
      foo = true;
      done();
    }, 50);
  });
  it('全局变量异步修改应该成功', function() {
  	// beforeEach会在it之前执行，所以会修改全局变量。
    expect(foo).to.be.equal(true);
  });
});
// 引入 chai 断言库
var chai = require('chai');

// 指定使用 expect 断言风格
var expect = chai.expect;

// 指定使用 assert 断言风格
var assert = chai.assert;

// 指定使用 should 断言风格
chai.should();

// 引入 demo1 模块
var add = require('../demo/demo1');

// 测试套件
describe('Demo1', function(){
	describe('#add', function(){
		
		it('[expect]should be return 2 when add(1,1)', function(){
			// expect 风格断言处理
			expect(add(1,1)).to.be.equal(2);
		});

		
		it('[should]should be return 2 when add(1,1)', function(){
			// should 风格断言处理
			add(1,1).should.equal(2);
		});

		
		it('[assert]should be return 2 when add(1,1)', function(){
			// assert 风格断言处理
			assert.equal(add(1,1), 2);
		});
	});
});

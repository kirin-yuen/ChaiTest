### 使用Mocha测试框架，结合chai断言库

### 安装
---
```
npm install -g mocha
npm install chai  // 安装chai断言库
```

### Example
---
##### 文件目录结构

/demo 存放被测试文件  
/test是mocha默认存放的测试目录

##### 运行
demo1.test.js 含三种chai中的断言风格的测试例子
```
mocha test/demo1.test.js
```
demo2.test.js Mocha默认每个测试用例最多执行2000毫秒，如没有得到结果就报错。对于涉及异步操作的测试用例，这个时间往往是不够的，需要用-t或–timeout参数指定超时门槛
```
mocha -t 5000 -s 1000 test/demo2.test.js
```
demo3.test.js 在beforeEach之中使用异步操作
```
mocha test/demo3.test.js
````



## 其他内容

### Mocha的基本用法
---

mocha命令后面紧跟测试脚本的路径和文件名，可以指定多个测试脚本。
```
$ mocha file1 file2 file3
```
Mocha**默认运行test子目录**里面的测试脚本。所以，一般都会把测试脚本放在test目录里面，然后执行mocha就不需要参数了。

##### 递归执行所有测试用例，_--recursive_
```
$ mocha --recursive
```


### 通配符
---
命令行指定测试脚本时，可以使用**Shell通配符**，同时指定多个文件。
```
$ mocha spec/{my,awesome}.js  //  指定执行spec目录下面的my.js和awesome.js
$ mocha test/unit/*.js // 指定执行test/unit目录下面的所有js文件
```

还可以使用**Node通配符**。
```
$ mocha 'test/**/*.@(js|jsx)' // 指定运行test目录下面任何子目录中、文件后缀名为js或jsx的测试脚本
```
**注意**:Node的通配符要放在单引号之中，否则星号（*）会先被Shell解释。

上面这行Node通配符，如果改用Shell通配符，要写成下面这样。

$ mocha test/{,**/}*.{js,jsx}

### 命令行参数
---
##### --help, -h
--help或-h参数，用来查看Mocha的所有命令行参数。
```
$ mocha --help
```

##### --reporter, -R
--reporter参数用来指定测试报告的格式，默认是spec格式。
```
$ mocha  等同于 $ mocha --reporter spec
```
除了spec格式，官方网站还提供了其他许多报告格式，如tap


##### 使用 mochawesome 模块，可以生成漂亮的HTML格式的报告
```
$ npm install --save mochawesome
$ mocha --reporter mochawesome
```
测试结果报告就在 mochawesome-reports 子目录生成


##### --growl, -G，桌面显示


##### --watch，-w
--watch参数用来监视指定的测试脚本。只要测试脚本有变化，就会自动运行Mocha。


##### --bail, -b
--bail参数指定只要有一个测试用例没有通过，就停止执行后面的测试用例。这对持续集成很有用。


#####   --grep, -g
--grep参数用于**搜索测试用例的名称**（即it块的第一个参数），然后只执行匹配的测试用例。
```
$ mocha --grep "should return 2 when add(1, 1)" // 只测试名称中包含"should return 2 when add(1, 1)"的测试用例。
```


##### --invert, -i
--invert参数表示只运行不符合条件的测试脚本，必须与--grep参数配合使用。
```
$ mocha --grep "should return 2 when add(1, 1)" --invert
```

##### 配置文件mocha.opts
Mocha允许在test目录下面，放置配置文件mocha.opts，把**命令行参数写在里面**。
```
$ mocha --recursive --reporter tap --growl
```
上面这个命令有三个参数--recursive、--reporter tap、--growl。

把这三个参数写入test目录下的 mocha.opts 文件。
```
--reporter spec
--recursive
--growl
```

然后，执行mocha就能取得与第一行命令一样的效果。

如果测试用例不是存放在test子目录，可以在mocha.opts写入以下内容。
```
server-tests
--recursive
```
上面代码指定运行server-tests目录及其子目录之中的测试脚本。


### ES6测试
---
如果测试脚本是用ES6写的，那么运行测试之前，需要先用Babel转码。
```
import add from '../src/add.js';
import chai from 'chai';

let expect = chai.expect;

describe('加法函数的测试', function() {
  it('1 加 1 应该等于 2', function() {
    expect(add(1, 1)).to.be.equal(2);
  });
});
```

ES6转码，需要安装Babel。
```
$ npm install babel-core babel-preset-es2015 --save-dev
$ mocha --compilers js:babel-core/register
```
然后，在项目目录下面，新建一个 .babelrc 配置文件。
```
{
  "presets": [ "es2015" ]
}
```
最后，使用--compilers参数指定测试脚本的转码器。
```
$ mocha --compilers js:babel-core/register
```

上面代码中，--compilers参数后面紧跟一个用冒号分隔的字符串，冒号左边是文件的后缀名，右边是用来处理这一类文件的模块名。上面代码表示，运行测试之前，先用babel-core/register模块，处理一下.js文件。

下面是另外一个例子，使用Mocha测试CoffeeScript脚本。测试之前，先将.coffee文件转成.js文件。
```
$ mocha --compilers coffee:coffee-script/register
```
注意，Babel默认不会对Iterator、Generator、Promise、Map、Set等全局对象，以及一些全局对象的方法（比如Object.assign）转码。如果你想要对这些对象转码，就要安装babel-polyfill。
```
$ npm install babel-polyfill --save
```
然后，在你的脚本头部加上一行。
```
import 'babel-polyfill'
```



### 异步测试
---
Mocha默认每个测试用例**最多执行2000毫秒，如没有得到结果就报错**。对于涉及异步操作的测试用例，这个时间往往是不够的，需要用**-t或--timeout参数指定超时门槛**。
```
it('测试应该500毫秒后结束', function(done) {
  var x = true;
  var f = function() {
    x = false;
    expect(x).to.be.not.ok;
    done(); // 通知Mocha测试结束
  };
  setTimeout(f, 4000);
});
```
上面的测试用例，需要4000毫秒之后，才有运行结果。所以，需要用-t或--timeout参数，改变默认的超时设置。
```
$ mocha -t 5000 timeout.test.js // 将测试的超时时限指定为5000毫秒。
```

另外，上面的测试用例里面，有一个done函数。it块执行的时候，传入一个done参数，当测试结束的时候，**必须显式调用done这个函数**，告诉Mocha测试结束了。否则，Mocha就无法知道，测试是否结束，会一直等到超时报错。

Mocha默认会`高亮显示超过75毫秒的测试用例`，可以用-s或--slow调整这个参数。
```
$ mocha -t 5000 -s 1000 timeout.test.js // 指定高亮显示耗时超过1000毫秒的测试用例。
```

下面是另一个异步测试的例子 async.test.js 。
```
it('异步请求应该返回一个对象', function(done){
  request
    .get('https://api.github.com')
    .end(function(err, res){
      expect(res).to.be.an('object');
      done();
    });
});
```
运行下面命令，可以看到这个测试会通过。
```
$ mocha -t 10000 async.test.js
```
另外，Mocha内置对Promise的支持，允许直接返回Promise，等到它的状态改变，再执行断言，而不用显式调用done方法。请看 promise.test.js 。
```
it('异步请求应该返回一个对象', function() {
  return fetch('https://api.github.com')
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      expect(json).to.be.an('object');
    });
});
```



### 测试用例的钩子
---
Mocha在describe块之中，提供测试用例的四个钩子：before()、after()、beforeEach()和afterEach()。它们会在指定时间执行。
```
describe('hooks', function() {

  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
```

```
// beforeEach.test.js
describe('beforeEach示例', function() {
  var foo = false;

  beforeEach(function() {
    foo = true;
  });

  it('修改全局变量应该成功', function() {
    expect(foo).to.be.equal(true);
  });
});
```
上面代码中，beforeEach会在it之前执行，所以会修改全局变量。

另一个例子则是演示，如何在beforeEach之中使用异步操作。
```
describe('异步 beforeEach 示例', function() {
  var foo = false;

  beforeEach(function(done) {
    setTimeout(function() {
      foo = true;
      done();
    }, 50);
  });

  it('全局变量异步修改应该成功', function() {
    expect(foo).to.be.equal(true);
  });
});
```


### 测试用例管理
##### only方法
大型项目有很多测试用例。有时，我们希望只运行其中的几个，这时可以用only方法。  
**describe块和it块都允许调用only方法，表示只运行某个测试套件或测试用例**。
```
it.only('1 加 1 应该等于 2', function() {
  expect(add(1, 1)).to.be.equal(2);
});

it('任何数加0应该等于自身', function() {
  expect(add(1, 0)).to.be.equal(1); 
});
```
上面代码只有带有only方法的测试用例会运行。

##### skip方法
表示**跳过指定的测试套件或测试用例**。
```
it.skip('任何数加0应该等于自身', function() {
  expect(add(1, 0)).to.be.equal(1);
});
```
上面代码的这个测试用例不会执行。



### 浏览器测试
---
除了在命令行运行，Mocha还可以在浏览器运行。

```
mocha init path // 使用命令在指定目录生成初始化文件，生成 index.html 文件，以及配套的脚本和样式表。
```

然后，新建一个源码文件 add.js 。
```
// add.js
function add(x, y) {
  return x + y;
}
```
然后，把这个文件，以及断言库chai.js，加入index.html。
```
<script>
  mocha.setup('bdd');
</script>
<script src="add.js"></script>
<script src="http://chaijs.com/chai.js"></script>
<script src="tests.js"></script>
<script>
  mocha.run();
</script>
```
最后，在 tests.js 里面写入测试脚本。
```
var expect = chai.expect;

describe('加法函数的测试', function() {
  it('1 加 1 应该等于 2', function() {
    expect(add(1, 1)).to.be.equal(2);
  });

  it('任何数加0等于自身', function() {
    expect(add(1, 0)).to.be.equal(1);
    expect(add(0, 0)).to.be.equal(0);
  });
});
```
现在，在浏览器里面打开index.html，就可以看到测试脚本的运行结果。



### 生成规格文件
---
Mocha支持从测试用例生成规格文件。

```
$ mocha --recursive -R markdown > spec.md
```
上面命令根据test目录的所有测试脚本，生成一个规格文件 spec.md 。-R markdown参数指定规格报告是markdown格式。

如果想生成HTML格式的报告 spec.html ，使用下面的命令。
```
$ mocha --recursive -R doc > spec.html
```
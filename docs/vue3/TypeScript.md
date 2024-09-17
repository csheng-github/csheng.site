# TypeScript

## 编译 TypeScript

1、命令行编译

```ts
const person = {
  name: '李四',
  age: 18,
}
console.log(`我叫${person.name}，我今年${person.age}岁了`)
```

```bash
# 全局安装 TypeScript
npm i typescript -g

# 使⽤命令编译 .ts ⽂件
tsc demo.ts
```

2、自动化编译

```bash
# 创建 TypeScript 编译控制⽂件
tsc --init

# 监视⽬录中的 .ts ⽂件变化
## 不管代码是否有误都编译
tsc --watch
## 当代码有误则不编译
tsc --noEmitOnError --watch
```

## 类型声明

```ts
let a: string // 变量a只能存储字符串
let b: number // 变量b只能存储数值
let c: boolean // 变量c只能存储布尔值
a = 'hello'
a = 100 // 警告：不能将类型“number”分配给类型“string”// [!code warning]
b = 666
b = '你好' // 警告：不能将类型“string”分配给类型“number”// [!code warning]
c = true
c = 666 // 警告：不能将类型“number”分配给类型“boolean”// [!code warning]

// 参数x必须是数字，参数y也必须是数字，函数返回值也必须是数字
function demo(x: number, y: number): number {
  return x + y
}
demo(100, 200)
demo(100, '200') // 警告：类型“string”的参数不能赋给类型“number”的参数// [!code warning]
demo(100, 200, 300) // 警告：应有 2 个参数，但获得 3 个// [!code warning]
demo(100) // 警告：应有 2 个参数，但获得 1 个// [!code warning]
```

## 类型推断
```ts
let d = -99 // TypeScript会推断出变量d的类型是数字
d = false // 警告：不能将类型“boolean”分配给类型“number”// [!code warning]
```

## 类型总览

- `string、number、boolean、null、undefined、bigint、symbol、object`
  （包含：`Array、Function、Date、Error`）
- 六个新类型：`any、unknown、never、void、tuple、enum`
- 两个⾃定义类型：`type、interface`


|  类型   |  描述   |  举例   |
| ------------- | :-----------: | ------------- |
|  number   |  任意数字   |  1 , -33 , 2.5   |
|  string   |  任意字符串   |  'hello' , 'ok' , '你 好'   |
|  boolean   |  布尔值 true 或 false   |  true 、 false   |
|  字面量   |  值只能是字⾯量值   |  值本身   |
|  any   |  任意类型   |  1 、 'hello' 、 true ....   |
|  unknown   |  类型安全的 any   |  1 、 'hello' 、 true ....   |
|  never   |  不能是任何值   |  无值 |
|  void   |  空 或 undefined   |  空 或 undefined   |
|  object   |  任意的 JS 对象   |  `{name:'张三'}`   |
|  tuple   |  元素（新增类型），固定⻓度数组   |  `[4,5]`   |
|  enum   |  枚举（新增类型） |  `enum{A, B}`   |

## 常用类型与语法

### 1、any

> any：任意类型，⼀旦将变量类型限制为 `any` ，那就意味着放弃了对该变量的类型检查。  

```ts
// 明确的表示a的类型是 any —— 【显式的any】
let a: any
// 以下对a的赋值，均⽆警告
a = 100
a = '你好'
a = false
// 没有明确的表示b的类型是any，但TS主动推断出来b是any —— 【隐式的any】
let b
// 以下对b的赋值，均⽆警告
b = 100
b = '你好'
b = false
```

```ts
/* 注意点：any类型的变量，可以赋值给任意类型的变量 */
let c:any
c = 9
let x: string
x = c // ⽆警告
```

### 2、unknown

> `unknown`：未知类型。

`unknown` 可以理解为⼀个类型安全的 `any` 。

```ts
let a: unknown
// 以下对a的赋值，均符合规范
a = 100
a = false
a = '你好'
// 设置x的数据类型为string
let x: string
x = a // 警告：不能将类型“unknown”分配给类型“string”// [!code warning]
```

`unknown` 会强制开发者在使用之前进行类型检查，从而提供更强的类型安全性。 

```ts
let a: unknown
a = 'hello'
// 第⼀种⽅式：加类型判断
if (typeof a === 'string') {
  x = a
  console.log(x)
}
// 第⼆种⽅式：加断⾔
x = a as string
// 第三种⽅式：加断⾔
x = <string>a
```

读取 `any` 类型数据的任何属性都不会报错，而 `unknown` 正好与之相反。

```ts
let str1: string
str1 = 'hello'
str1.toUpperCase() // ⽆警告
let str2: any
str2 = 'hello'
str2.toUpperCase() // ⽆警告
let str3: unknown
str3 = 'hello'
str3.toUpperCase() // 警告：“str3”的类型为“未知”// [!code warning]

// 使⽤断⾔强制指定str3的类型为string
(str3 as string).toUpperCase() // ⽆警告
```

### 3、never

>  never 的含义是：任何值都不是，即：不能有值，例如 undefined、null、''、0 都不⾏！

几乎不用 `never` 去直接限制变量，因为没有意义，例如：  
```ts
/* 指定a的类型为never，那就意味着a以后不能存任何的数据了 */
let a: never

// 以下对a的所有赋值都会有警告
a = 1 // [!code warning] 
a = true // [!code warning]
a = undefined // [!code warning]
a = null // [!code warning]
```
`never` ⼀般是 `TypeScript` 主动推断出来的，例如：  
```ts
let a: string;
a = "hello";
if (typeof a === "string") {
  a.toUpperCase();
} else {
  console.log(a); // TypeScript会推断出此处的a是never，因为没有任何⼀个值符合此处的逻辑
}
```
`never` 也可用于限制函数的返回值  
```ts
// 限制throwError函数不需要有任何返回值，任何值都不⾏，像 undefined、null 都不⾏
function throwError(str: string): never {
  throw new Error('程序异常退出:' + str)
}
```

### 4、void

>  `void` 的含义是空，即：函数不返回任何值，调用者也不应依赖其返回值进行任何操作！

`void` 通常用于函数返回值声明
```ts
function logMessage(msg:string):void{
  console.log(msg)
}
logMessage('你好')
```
以下写法均符合规范
```ts
// ⽆警告
function logMessage(msg:string):void{
  console.log(msg)
}
// ⽆警告
function logMessage(msg:string):void{
  console.log(msg)
  return;
}
// ⽆警告
function logMessage(msg:string):void{
  console.log(msg)
  return undefined
}
```
限制函数返回值时，是不是 `undefined` 和 `void` 就没区别呢？—— 有区别。因为还有这句话 ：【返回值类型为 void 的函数，调用者不应依赖其返回值进行任何操作！】对比下面两段代码：
```ts
function logMessage(msg:string):void{
  console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此⾏报错：⽆法测试 "void" 类型的表达式的真实性// [!code error]
  console.log('logMessage有返回值')
}
```
```ts
function logMessage(msg:string):undefined{
  console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此⾏⽆警告
  console.log('logMessage有返回值')
}
```

### 5、object

> `object`：所有非原始类型，可存储：**对象、函数、数组** 等。

```ts
let a:object // a的值可以是任何【⾮原始类型】，包括：对象、函数、数组等

// 以下代码，是将【⾮原始类型】赋给a，所以均符合要求
a = {}
a = {name:'张三'}
a = [1,3,5,7,9]
a = function(){}
a = new String('123')
class Person {}
a = new Person()

// 以下代码，是将【原始类型】赋给a，有警告
a = 1 // 警告：不能将类型“number”分配给类型“object”// [!code warning]
a = true // 警告：不能将类型“boolean”分配给类型“object”// [!code warning]
a = '你好' // 警告：不能将类型“string”分配给类型“object”// [!code warning]
a = null // 警告：不能将类型“null”分配给类型“object”// [!code warning]
a = undefined // 警告：不能将类型“undefined”分配给类型“object”// [!code warning]
```

> `Object`：所有可以调用 `Object` 方法的类型。除了 `undefined` 和 `null` 的任何值。

```ts
let b:Object // b的值必须是Object的实例对象（除去undefined和null的任何值）

// 以下代码，均⽆警告，因为给a赋的值，都是Object的实例对象
b = {}
b = {name:'张三'}
b = [1,3,5,7,9]
b = function(){}
b = new String('123')
class Person {}
b = new Person()
b = 1 // 1不是Object的实例对象，但其包装对象是Object的实例
b = true // true不是Object的实例对象，但其包装对象是Object的实例
b = '你好' // “你好”不是Object的实例对象，但其包装对象是Object的实例

// 以下代码均有警告
b = null // 警告：不能将类型“null”分配给类型“Object”// [!code warning]
b = undefined // 警告：不能将类型“undefined”分配给类型“Object”// [!code warning]
```

声明对象类型

```ts
// 限制person1对象必须有name属性，age为可选属性
let person1: { name: string, age?: number }
// 含义同上，也能⽤分号做分隔
let person2: { name: string; age?: number }
// 含义同上，也能⽤换⾏做分隔
let person3: {
 name: string
 age?: number
}

// 如下赋值均可以
person1 = {name:'李四',age:18}
person2 = {name:'张三'}
person3 = {name:'王五'}

// 如下赋值不合法
person3 = {name:'王五',gender:'男'} // person3的类型限制中，没有对gender属性的说明 // [!code warning]
```
```ts
// 限制person对象必须有name属性，可选age属性但值必须是数字，同时可以有任意数量、任意类型的其他属性
let person: {
 name: string
 age?: number
 [key: string]: any // 索引签名，完全可以不⽤key这个单词，换成其他的也可以
}
// 赋值合法
person = {
 name:'张三',
 age:18,
 gender:'男'
}
```

声明函数类型

```ts
let count: (a: number, b: number) => number
count = function (x, y) {
 return x + y
}
```

声明数组类型

```ts
let arr1: string[]
let arr2: Array<string> // 泛型 写法
arr1 = ['a','b','c']
arr2 = ['hello','world']
```

### 6、tuple

> 元组 (Tuple) 是⼀种特殊的数组类型，可以存储固定数量的元素，并且每个元素的类型是已知的且可以不同。元组用于精确描述⼀组值的类型， `?` 表示可选元素。

```ts
// 第⼀个元素必须是 string 类型，第⼆个元素必须是 number 类型。
let arr1: [string, number]
// 第⼀个元素必须是 number 类型，第⼆个元素是可选的，如果存在，必须是 boolean 类型。
let arr2: [number, boolean?]
// 第⼀个元素必须是 number 类型，后⾯的元素可以是任意数量的 string 类型
let arr3: [number, ...string[]]

// 可以赋值
arr1 = ['hello', 123]
arr2 = [100, false]
arr2 = [200]
arr3 = [100, 'hello', 'world']
arr3 = [100]

// 不可以赋值，arr1声明时是两个元素，赋值的是三个
arr1 = ['hello', 123, false] // [!code warning]
```

### 7、enum

> 枚举（ enum ）: 定义⼀组命名常量，它能增强代码的可读性，也让代码更好维护。

数字枚举: 其成员的值会自动递增，且数字枚举还具备反向映射的特点。
```ts
/* 不指定枚举成员到处初始值，则默认从0开始 */
enum Direction {
 Up,
 Down,
 Left,
 Right
}
console.log(Direction.Up) // 输出: 0

Direction.Up = 'shang' // 此⾏代码报错，枚举中的属性是只读的// [!code warning]

/* 指定枚举成员的初始值，其后的成员值会⾃动递增 */
enum Direction {
 Up = 6,
 Down,
 Left,
 Right
}
console.log(Direction.Up); // 输出: 6
console.log(Direction.Down); // 输出: 7
```
字符串枚举: 枚举成员的值是字符串。

```ts
enum Direction {
 Up = "up",
 Down = "down",
 Left = "left",
 Right = "right"
}
let dir: Direction = Direction.Up;
console.log(dir); // 输出: "up"
```
常量枚举: 使用 `const` 关键字定义，在编译时会被内联，避免生成⼀些额外的代码。
```ts
const enum Directions {
 Up,
 Down,
 Left,
 Right
}
let x = Directions.Up;
```

### 8、type

> `type` 可为任意类型创建别名，让代码更简洁、可读性更强，同时能更方便地进行类型复用和扩展。

**基本类型**: 类型别名使⽤ `type` 关键字定义， `type` 后跟类型名称，例如下面代码中 `num` 是类型别名。

```ts
type num = number;
let price: num
price = 100
```

**联合类型**: 高级类型，它表示⼀个值可以是几种不同类型之⼀。
```ts
type Status = number | string
type Gender = '男' | '⼥'
function printStatus(status: Status) {
  console.log(status);
}
function logGender(str:Gender){
  console.log(str)
}
printStatus(404);
printStatus('200');
printStatus('501');
logGender('男')
logGender('⼥')
```

**交叉类型**: 允许将多个类型合并为⼀个类型。合并后的类型将拥有所有被合并类型的成员，通常用于对象类型。 
```ts{13}
// ⾯积
type Area = {
  height: number; //⾼
  width: number; //宽
};
// 地址
type Address = {
  num: number; //楼号
  cell: number; //单元号
  room: string; //房间号
};
// 定义类型House，且House是Area和Address组成的交叉类型
type House = Area & Address;

const house: House = {
  height: 180,
  width: 75,
  num: 6,
  cell: 3,
  room: '702'
};
```

### 9、一个特殊情况

在函数定义时，限制函数返回值为 `void` ，那么函数的返回值就必须是空。

```ts{1}
function demo():void {
  // 返回undefined合法
  return undefined
  // 以下返回均不合法
  return 100
  return false
  return null
  return []
}
demo()
```

使用限制函数返回值为 `void` 时，`TypeScript` 并不会严格要求函数返回空。
```ts{1}
type LogFunc = () => void
const f1: LogFunc = () => {
  return 100; // 允许返回⾮空值
};
const f2: LogFunc = () => 200; // 允许返回⾮空值
const f3: LogFunc = function () {
  return 300; // 允许返回⾮空值
};
```

### 10、复习类相关知识

```ts
class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  speak() {
    console.log(`我叫：${this.name}，今年${this.age}岁`)
  }
}
const p1 = new Person('周杰伦', 38)

class Student extends Person {
  grade: string
  constructor(name: string, age: number, grade: string) {
    super(name, age)
    this.grade = grade
  }
  // 重写从⽗类继承的⽅法
  override speak() {
    console.log(
      `我是学⽣，我叫：${this.name}，今年${this.age}岁，在读${this.grade}年级`
    )
  }
  // ⼦类独有的⽅法
  study() {
    console.log(`${this.name}正在努⼒学习中......`)
  }
}
```

### 11、属性修饰符

|   修饰符      |      含义      |  具体规则 |
| ------------- | :-----------: | ---- |
| public      | 公开的 | 可以被：类内部、子类、类外部访问 |
| protected      |   受保护的    |   可以被：类内部、子类访问。 |
| private  |   私有的    |    可以被：类内部访问 |
| readonly   |   只读属性   |    属性无法修改 |

::: code-group

```ts [public 修饰符]
class Person {
  // name写了public修饰符，age没写修饰符，最终都是public修饰符
  public name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  speak() {
    // 类的【内部】可以访问public修饰的name和age
    console.log(`我叫：${this.name}，今年${this.age}岁`)
  }
}
const p1 = new Person('张三', 18)
// 类的【外部】可以访问p

class Student extends Person {
  constructor(name: string, age: number) {
    super(name, age)
  }
  study() {
    // 【⼦类中】可以访问⽗类中public修饰的：name属性、age属性
    console.log(`${this.age}岁的${this.name}正在努⼒学习`)
  }
}
```

```ts{10-15} [属性的简写形式]
class Person {
  public name: string;
  public age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Person {
  constructor(
    public name: string,
    public age: number
  ) { }
}
```

```ts [protected 修饰符]
class Person {
  // name和age是受保护属性，不能在类外部访问，但可以在【类】与【⼦类】中访问
  constructor(protected name: string, protected age: number) {}
  // getDetails是受保护⽅法，不能在类外部访问，但可以在【类】与【⼦类】中访问
  protected getDetails(): string {
    // 类中能访问受保护的name和age属性
    return `我叫：${this.name}，年龄是：${this.age}`
  }
  // introduce是公开⽅法，类、⼦类、类外部都能使⽤
  introduce() {
    // 类中能访问受保护的getDetails⽅法
    console.log(this.getDetails())
  }
}
const p1 = new Person('杨超越', 18)
// 可以在类外部访问introduce
p1.introduce()
// 以下代码均报错
p1.getDetails()// [!code error]
p1.name// [!code error]
p1.age// [!code error]

class Student extends Person {
  constructor(name: string, age: number) {
    super(name, age)
  }
  study() {
    // ⼦类中可以访问introduce
    this.introduce()
    // ⼦类中可以访问name
    console.log(`${this.name}正在努⼒学习`)
  }
}
const s1 = new Student('tom', 17)
s1.introduce()
```

```ts [private 修饰符]
class Person {
  constructor(
    public name: string,
    public age: number,
    // IDCard属性为私有的(private)属性，只能在【类内部】使⽤
    private IDCard: string
  ) {}
  private getPrivateInfo() {
    // 类内部可以访问私有的(private)属性 —— IDCard
    return `身份证号码为：${this.IDCard}`
  }
  getInfo() {
    // 类内部可以访问受保护的(protected)属性 —— name和age
    return `我叫: ${this.name}, 今年刚满${this.age}岁`
  }
  getFullInfo() {
    // 类内部可以访问公开的getInfo⽅法，也可以访问私有的getPrivateInfo⽅法
    return this.getInfo() + '，' + this.getPrivateInfo()
  }
}
const p1 = new Person('张三', 18, '110114198702034432')
console.log(p1.getFullInfo())
console.log(p1.getInfo())
// 以下代码均报错
p1.name// [!code error]
p1.age// [!code error]
p1.IDCard// [!code error]
p1.getPrivateInfo()// [!code error]
```

```ts [readonly 修饰符]
class Car {
  constructor(
    public readonly vin: string, //⻋辆识别码，为只读属性
    public readonly year: number, //出⼚年份，为只读属性
    public color: string,
    public sound: string
  ) {}
  // 打印⻋辆信息
  displayInfo() {
    console.log(`
      识别码：${this.vin},
      出⼚年份：${this.year},
      颜⾊：${this.color},
      ⾳响：${this.sound}
  `)
  }
}
const car = new Car('1HGCM82633A123456', 2018, '⿊⾊', 'Bose⾳响')
car.displayInfo()
// 以下代码均错误：不能修改 readonly 属性
car.vin = '897WYE87HA8SGDD8SDGHF';// [!code error]
car.year = 2020;// [!code error]
```

:::


### 12、抽象类

> 抽象类: 不能实例化，其意义是可以被继承，抽象类⾥可以有普通方法、也可以有抽象方法。

```ts
abstract class Package {
  constructor(public weight: number) {}
  // 抽象⽅法：⽤来计算运费，不同类型包裹有不同的计算⽅式
  abstract calculate(): number
  // 通⽤⽅法：打印包裹详情
  printPackage() {
    console.log(`包裹重量为: ${this.weight}kg，运费为: ${this.calculate()}元`)
  }
}

// 标准包裹
class StandardPackage extends Package {
  constructor(
    weight: number,
    public unitPrice: number // 每公⽄的固定费率
  ) {
    super(weight)
  }
  // 实现抽象⽅法：计算运费
  calculate(): number {
    return this.weight * this.unitPrice
  }
}
// 创建标准包裹实例
const s1 = new StandardPackage(10, 5)
s1.printPackage()

class ExpressPackage extends Package {
  constructor(
    weight: number,
    private unitPrice: number, // 每公⽄的固定费率（快速包裹更⾼）
    private additional: number // 超出10kg以后的附加费
  ) {
    super(weight)
  }
  // 实现抽象⽅法：计算运费
  calculate(): number {
    if (this.weight > 10) {
      // 超出10kg的部分，每公⽄多收additional对应的价格
      return 10 * this.unitPrice + (this.weight - 10) * this.additional
    } else {
      return this.weight * this.unitPrice
    }
  }
}
// 创建特快包裹实例
const e1 = new ExpressPackage(13, 8, 2)
e1.printPackage()
```

::: danger 总结: 何时使用抽象类?
1. 定义：为⼀组相关的类定义通⽤的⾏为（⽅法或属性）时。
2. 提供：在抽象类中提供某些⽅法或为其提供基础实现，这样派⽣类就可以继承这些实现。
3. 确保：强制派⽣类实现⼀些关键⾏为。
4. 代码和逻辑：当多个类需要共享部分代码时，抽象类可以避免代码重复。
:::

### 13、interface

> `interface`: 定义结构，主要作⽤是为：**类、对象、函数** 等规定⼀种契约，这样可以确保代码的⼀致性和类型安全，但要注意 `interface` **只能定义格式**，不能包含任何实现！

::: code-group

```ts [定义类结构]
// PersonInterface接⼝，⽤与限制Person类的格式
interface PersonInterface {
  name: string
  age: number
  speak(n: number): void
}
// 定义⼀个类 Person，实现 PersonInterface 接⼝
class Person implements PersonInterface {
  constructor(public name: string, public age: number) {}
  // 实现接⼝中的 speak ⽅法
  speak(n: number): void {
    for (let i = 0; i < n; i++) {
      // 打印出包含名字和年龄的问候语句
      console.log(`你好，我叫${this.name}，我的年龄是${this.age}`)
    }
  }
}
// 创建⼀个 Person 类的实例 p1，传⼊名字 'tom' 和年龄 18
const p1 = new Person('tom', 18)
p1.speak(3)
```

```ts [定义对象结构]
interface UserInterface {
  name: string
  readonly gender: string // 只读属性
  age?: number // 可选属性
  run: (n: number) => void
}
const user: UserInterface = {
  name: '张三',
  gender: '男',
  age: 18,
  run(n) {
    console.log(`奔跑了${n}⽶`)
  },
}
```

```ts [定义函数结构]
interface CountInterface {
  (a: number, b: number): number
}
const count: CountInterface = (x, y) => {
  return x + y
}
```

```ts [接口之间的继承]
interface PersonInterface {
  name: string // 姓名
  age: number // 年龄
}
interface StudentInterface extends PersonInterface {
  grade: string // 年级
}
const stu: StudentInterface = {
  name: '张三',
  age: 25,
  grade: '⾼三',
}
```

```ts [接口自动合并]
// PersonInterface接⼝
interface PersonInterface {
  // 属性声明
  name: string
  age: number
}
// 给PersonInterface接⼝添加新属性
interface PersonInterface {
  // ⽅法声明
  speak(): void
}
// Person类实现PersonInterface
class Person implements PersonInterface {
  name: string
  age: number
  // 构造器
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  // ⽅法
  speak() {
    console.log('你好！我是⽼师:', this.name)
  }
}
```

:::

::: danger 总结：何时使⽤接⼝？
1. 定义对象的格式： 描述数据模型、API 响应格式、配置对象........等等，是开发中⽤的最多
的场景。
2. 类的契约：规定⼀个类需要实现哪些属性和⽅法。
3. 扩展已有接口：⼀般用于扩展第三⽅库的类型， 这种特性在⼤型项目中可能会用到。
:::


### 14、一些相似概念的区别

::: info interface 与 type 的区别 
相同点： interface 和 type 都可以用于定义对象结构，在定义对象结构时两者可以互换。 <br/>
不同点：
- interface：更专注于定义对象和类的结构，⽀持继承、合并。
- type：可以定义类型别名、联合类型、交叉类型，但不⽀持继承和⾃动合并。
:::

::: code-group

```ts [interface 和 type 都可以定义对象结构]
// 使⽤ interface 定义 Person 对象
interface PersonInterface {
  name: string
  age: number
  speak(): void
}
// 使⽤ type 定义 Person 对象
type PersonType = {
  name: string
  age: number
  speak(): void
}
// 使⽤PersonInterface
/* let person: PersonInterface = {
  name:'张三',
  age:18,
  speak(){
  console.log(`我叫：${this.name}，年龄：${this.age}`)
  }
 } */
// 使⽤PersonType
let person: PersonType = {
  name: '张三',
  age: 18,
  speak() {
    console.log(`我叫：${this.name}，年龄：${this.age}`)
  },
}
```

```ts [interface 可以继承、合并]
interface PersonInterface {
  name: string // 姓名
  age: number // 年龄
}
interface PersonInterface {
  speak: () => void
}
interface StudentInterface extends PersonInterface {
  grade: string // 年级
}
const student: StudentInterface = {
  name: '李四',
  age: 18,
  grade: '⾼⼆',
  speak() {
    console.log(this.name, this.age, this.grade)
  },
}
```

```ts [type 的交叉类型]
// 使⽤ type 定义 Person 类型，并通过交叉类型实现属性的合并
type PersonType = {
  name: string // 姓名
  age: number // 年龄
} & {
  speak: () => void
}
// 使⽤ type 定义 Student 类型，并通过交叉类型继承 PersonType
type StudentType = PersonType & {
  grade: string // 年级
}
const student: StudentType = {
  name: '李四',
  age: 18,
  grade: '⾼⼆',
  speak() {
    console.log(this.name, this.age, this.grade)
  },
}
```

:::


::: info interface 与 抽象类的区别
相同点：都能定义⼀个类的格式（定义类应遵循的契约）<br/>
不相同：
- 接⼝：只能描述结构，不能有任何实现代码，⼀个类可以实现多个接⼝。
- 抽象类：既可以包含抽象⽅法，也可以包含具体⽅法， ⼀个类只能继承⼀个抽象类。
:::

```ts
// FlyInterface 接⼝
interface FlyInterface {
  fly(): void
}
// 定义 SwimInterface 接⼝
interface SwimInterface {
  swim(): void
}
// Duck 类实现了 FlyInterface 和 SwimInterface 两个接⼝
class Duck implements FlyInterface, SwimInterface {
  fly(): void {
    console.log('鸭⼦可以⻜')
  }
  swim(): void {
    console.log('鸭⼦可以游泳')
  }
}
// 创建⼀个 Duck 实例
const duck = new Duck()
duck.fly() // 输出: 鸭⼦可以⻜
duck.swim() // 输出: 鸭⼦可以游泳
```

### 15、内置类型

- Omit：排除
- Pick：挑选
- Partial：全部转为可选
- Required：全部转为必选
- &：合并

```ts
// 排除一个变量
type OmitUser = Omit<User, 'token'>
// 排除多个变量用 `|` 分割符
type OmitPerson = Omit<Person, 'age' | 'gender'>
```

## 泛型

> 泛型: 允许定义函数、类或接口时，使用类型参数来表示未指定的类型，这些参数在具体使用时，才被指定具体的类型，泛型能让同⼀段代码适用于多种类型，同时仍然保持类型的安全性。

举例：如下代码中 `<T>` 就是泛型，（不⼀定非叫 `T` ），设置泛型后即可在函数中使用 `T` 来表示该类型：

::: code-group

```ts [泛型函数]
function logData<T>(data: T): T {
  console.log(data)
  return data
}
logData<number>(100)
logData<string>('hello')
```

```ts [泛型可以有多个]
function logData<T, U>(data1: T, data2: U): T | U {
  console.log(data1, data2)
  return Date.now() % 2 ? data1 : data2
}
logData<number, string>(100, 'hello')
logData<string, boolean>('ok', false)
```
```ts [泛型接⼝]
interface PersonInterface<T> {
  name: string
  age: number
  extraInfo: T
}
let p1: PersonInterface<string>
let p2: PersonInterface<number>
p1 = { name: '张三', age: 18, extraInfo: '⼀个好⼈' }
p2 = { name: '李四', age: 18, extraInfo: 250 }
```
```ts [泛型约束]
interface LengthInterface {
  length: number
}
// 约束规则是：传⼊的类型T必须具有 length 属性
function logPerson<T extends LengthInterface>(data: T): void {
  console.log(data.length)
}
logPerson<string>('hello')
// 报错：因为number不具备length属性
// logPerson<number>(100) // [!code error]
```
```ts [泛型类]
class Person<T> {
  constructor(public name: string, public age: number, public extraInfo: T) {}
  speak() {
    console.log(`我叫${this.name}今年${this.age}岁了`)
    console.log(this.extraInfo)
  }
}

// 测试代码1
const p1 = new Person<number>('tom', 30, 250)
// 测试代码2
type JobInfo = {
  title: string
  company: string
}
const p2 = new Person<JobInfo>('tom', 30, {
  title: '研发总监',
  company: '发发发科技公司',
})
```

:::

## 类型声明文件

> 类型声明文件: 通常以 `.d.ts` 作为扩展名。<br/>
> 主要作用: 为现有的 `JS` 代码提供类型信息，使得 `TS` 能够在使用 `JS` 或模块时进行类型检查和提示。

::: code-group

```js [demo.js]
export function add(a, b) {
  return a + b
}
export function mul(a, b) {
  return a * b
}
```

```ts [demo.d.ts]
declare function add(a: number, b: number): number
declare function mul(a: number, b: number): number
export { add, mul }
```

:::
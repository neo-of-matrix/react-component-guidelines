> [前端必学-完美组件封装原则](https://juejin.cn/post/7536467524998103092)

> [React 组件的受控与非受控](https://zhuanlan.zhihu.com/p/536322574)

# 基本属性绑定原则

任何组件都需要继承 `className`, `style` 两个属性

```tsx
import classNames from 'classnames';
export interface CommonProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义内敛样式 */
  style?: React.CSSProperties;
}
export interface MyInputProps extends CommonProps {
  /** 值 */
  value: any;
}
const MyInput = forwardRef((props: MyInputProps, ref: React.LegacyRef<HTMLDivElement>) => {
  const { className, ...rest } = props;
  const displayClassName = classNames('chc-input', className);
  return (
    <div ref={ref} {...rest} className={displayClassName}>
      <span></span>
    </div>
  );
});
export default ChcInput;
```

# 注释使用原则

- 原则上所有的 `props` 和 `ref 属性` 类型都需要有注释
- 且所有属性（`props`和`ref 属性`）禁用 `// 注释内容` 语法注释，因为此注释不会被 ts 识别，也就是鼠标悬浮的时候不会出现对应注释文案
- 常用的注视参数 `@description` 描述, `@version` 新属性的起始版本, `@deprecated` 废弃的版本, `@default` 默认值
- 面向国际化使用的组件一般描述语言推荐使用英文

bad ❌

```ts
interface MyInputsProps {
  // 自定义class
  className?: string;
}
const test: MyInputsProps = {};
test.className;
```

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/74d69fcae6124c239c972fab1a90937c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5YiY6bit5Zyw5LiL5Z-O:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTIwMTA4MzkxNTcwNTAzMiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1760311645&x-orig-sign=PwpN01eVQh0QO5RqLuvL10VkwBw%3D)

应该使用如下注释方法  
after good ✅

```ts
interface MyInputsProps {
  /**  custom class */
  className?: string;
  /**
   * @description Custom inline style
   * @version 2.6.0
   * @default ''
   */
  style?: React.CSSProperties;
  /**
   * @description Custom title style
   * @deprecated 2.5.0 废弃
   * @default ''
   */
  customTitleStyle?: React.CSSProperties;
}
const test: MyInputsProps = {};
test.className;
```

![](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/b3bf024ba6d04080949b63d0feba2293~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP5YiY6bit5Zyw5LiL5Z-O:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTIwMTA4MzkxNTcwNTAzMiJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1760311645&x-orig-sign=OTWAVaNuvb92IInexe1X5GaMIhc%3D)

# export 导出组件原则

- 组件 `props` 类型必须 `export` 导出
- 如有 `useImperativeHandle` 则 `ref`类型必须 `export` 导出
- 组件导出 `function` 必须有名称
- 组件 `function` 一般 `export default` 默认导出

在没有名称的组件报错时不利于定位到具体的报错组件

bad ❌

```tsx
interface MyInputProps {
    ....
}
export default (props: MyInputProps) => {
  return <div></div>;
};
```

after good ✅

```tsx
// 暴露 MyInputProps 类型
export interface MyInputProps {
    ....
}
const CustomInput = ({ className, ref, ...rest }: CustomInputProps) => {
  const inputRef = useRef<InputRef>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current?.focus();
        },
      };
    },
    []
  );

  const displayClassName = classNames("chc-input", className);
  return <Input ref={inputRef} {...rest} className={displayClassName} />;
};
// 也可以自己挂载一个组件名称
if (process.env.NODE_ENV !== 'production') {
  MyInput.displayName = 'MyInput';
}
export default MyInput
```

index.ts

```ts
export * from './input';
export { default as MyInput } from './input';
```

当然如果目标组件没有暴露相关的类型，可以通过 `ComponentProps` 和 `ComponentRef` 来分别获取组件的 `props` 和 `ref` 属性

```ts
type DialogProps = ComponentProps<typeof Dialog>;
type DialogRef = ComponentRef<typeof Dialog>;
```

# 入参类型约束原则

**入参类型必须遵循具体原则**

- 确定入参类型的可能情况下，切忌不可用`基本类型`一笔带过
- 公共组件一般不使用`枚举`作为入参类型，因为这样在使用者需要引入此枚举才可以不报错
- 部分数值类型的参数需要描述最大和最小值

bad ❌

```ts
interface InputProps {
  status: string;
}
```

after good ✅

```ts
interface InputProps {
  status: 'success' | 'fail';
}
```

bad ❌

```ts
interface InputProps {
  /** 总数 */
  count: number;
}
```

after good ✅

```ts
interface InputProps {
  /** 总数 0-999 */
  count: number;
}
```

# class 和 style 定义规则

- 禁用 CSS module 因为此类写法会让使用者无法修改组件内部样式
- 书写组件时，内部的 `class` 一定要加上统一的`前缀`来区分组件内外 `class`，避免和外部的 class 类有重复
- class 类的名称需要语意化
- 组件内部的所有 class 类都可以被外部使用者改变
- 禁用 important，不到万不得已不用行内样式
- 可以为颜色相关 CSS 属性留好 CSS 变量，方便外部开发主题切换

bad ❌

```tsx
import styles from './index.module.less';
export default function MyInput(props: MyInputProps) {
  return (
    <div className={styles.input_box}>
      <span className={styles.detail}>21312312</span>
    </div>
  );
}
```

after good ✅

```tsx
import './index.less';
const prefixCls = 'my-input'; // 统一的组件内部前缀
export default function MyInput(props: MyInputProps) {
  return (
    <div className={`${prefixCls}-box`}>
      <span className={`${prefixCls}-detail`}>21312312</span>
    </div>
  );
}
```

after good ✅

```css
.my-input-box {
  height: 100px;
  background: var(--my-input-box-background, #000);
}
```

# 继承透传原则

书写组件时如果进行了二次封装切忌不可将传入的属性一个一个提取然后绑定，这有非常大的局限性，一旦你基础的组件更新了或者需要增加使用的参数则需要再次去修改组件代码

bad ❌

```tsx
import { Input } from '某组件库';
export interface MyInputProps {
  /** 值 */
  value: string;
  /** 限制 */
  limit: number;
  /** 状态 */
  state: string;
}
const MyInput = (props: Partial<MyInputProps>) => {
  const { value, limit, state } = props;
  // ...一些处理
  return <Input value={value} limit={limit} state={state} />;
};
export default MyInput;
```

以`extends`继承基础组件的所有属性，并用`...rest` 承接所有传入的属性，并绑定到我们的基准组件上。

after good ✅

```tsx
import { Input, InputProps } from '某组件库';
export interface MyInputProps extends InputProps {
  /** 值 */
  value: string;
}
const MyInput = (props: Partial<MyInputProps>) => {
  const { value, ...rest } = props;
  // ...一些处理
  return <Input value={value} {...rest} />;
};
export default MyInput;
```

# 事件配套原则

任何组件内部操作导致 `UI视图` 改变都需要有配套的事件，来给使用者提供全量的触发钩子，提高组件的可用性

bad ❌

```tsx
export default function MyInput(props: MyInputProps) {
  // ...省略部分代码
  const [open, setOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const currClassName = classNames(className, {
    `${prefixCls}-box`: true,
    `${prefixCls}-open`: open, // 是否采用打开样式
  })
  const onCheckOpen = () => {
    setOpen(!open)
  }
  const onShowDetail = () => {
    setShowDetail(!showDetail)
  }
  return (
    <div className={currClassName} style={style} onClick={onCheckOpen}>
      <span onClick={onShowDetail}>{showDetail ? '123' : '...'}</span>
    </div>
  );
};
```

所有组件内部会影响外部UI改变的事件都预留了钩子  
after good ✅

```tsx
export default function MyInput(props: MyInputProps) {
  const { onChange, onShowChange } = props
  // ...省略部分代码
  const [open, setOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  // ...省略部分代码
  const currClassName = classNames(className, {
    `${prefixCls}-box`: true,
    `${prefixCls}-open`: open, // 是否采用打开样式
  })
  const onCheckOpen = () => {
    setOpen(!open)
    onChange?.(!open) // 实现组件内部open改变的事件钩子
  }
  const onShowDetail = () => {
    setShowDetail(!showDetail)
    onShowChange?.(!showDetail) // 实现组件详情展示改变的事件钩子
  }
  return (
    <div className={currClassName} style={style} onClick={onCheckOpen}>
      <span onClick={onShowDetail}>{showDetail ? '123' : '...'}</span>
    </div>
  );
};
```

# ref 绑定原则

任何书写的组件有可能绑定 `ref` 情况下都需要暴露有 `ref` 属性，不然使用者一旦挂载 `ref` 则会导致控制台报错警告。

- 原创组件：`useImperativeHandle` 或直接` ref` 绑定组件根节点

```tsx
interface ChcInputRef {
  /** 值 */
  setValidView: (isShow?: boolean) => void;
  /** 值 */
  field: Field;
}
const ChcInput = forwardRef<ChcInputRef, MyProps>((props, ref) => {
  const { className, ...rest } = props;
  useImperativeHandle(
    ref,
    () => ({
      setValidView(isShow = false) {
        setIsCheckBalloonVisible(isShow);
      },
      field,
    }),
    [],
  );
  return <div className={displayClassName}>...</div>;
});
export default ChcInput;
```

```tsx
const ChcInput = forwardRef((props: MyProps, ref: React.LegacyRef<HTMLDivElement>) => {
  const { className, ...rest } = props;
  const displayClassName = classNames('chc-input', className);
  return (
    <div ref={ref} className={displayClassName}>
      <span></span>
      ...
    </div>
  );
});
export default ChcInput;
```

- 二次封装组件：则直接 `ref` 绑定在原基础组件上或组件根节点

```tsx
import { Input } from '某组件库';
const ChcInput = forwardRef((props: InputProps, ref: React.LegacyRef<Input>) => {
  const { className, ...rest } = props;
  const displayClassName = classNames('chc-input', className);
  return <Input ref={ref} className={displayClassName} {...rest} />;
});
export default ChcInput;
```

# 自定义扩展性原则

在组件封装时，遇到组件内部会用一些固定逻辑来渲染UI或者计算时，最好预留一个使用者可以随意自定义的入口，而不是只能死板采用组件内部逻辑，这样可以

- 增加组件的扩展灵活性
- 减少迭代修改

bad ❌

```tsx
export default function MyInput(props: MyInputProps) {
  const { value } = props;
  const detailText = useMemo(() => {
    return value
      .split(',')
      .map((item) => `组件内部复杂的逻辑：${item}`)
      .join('\n');
  }, [value]);
  return (
    <div>
      <span>{detailText}</span>
    </div>
  );
}
```

after good ✅

复杂的 UI 渲染可以采用用户自定义传入 `render` 方法的方式进行扩展

```tsx
export default function MyInput(props: MyInputProps) {
  const { value, render } = props;
  const detailText = useMemo(() => {
    // render 用户自定义渲染
    return render
      ? render(value)
      : value
          .split(',')
          .map((item) => `组件内部复杂的逻辑：${item}`)
          .join('\n');
  }, [value]);
  return (
    <div>
      <span>{detailText}</span>
    </div>
  );
}
```

# 受控与非受控模式原则

对于 react 组件，我们往往都会要求组件在设计时需要包含 `受控` 和 `非受控` 两个模式。

`非受控` 的情况可以实现更加方便的使用组件  
`受控` 的情况可以实现更加灵活的使用组件，以增加组件的可用性

https://github.com/ant-design/ant-design-mobile/blob/fae45549bcadb2b3c7f1dea27462543230e3b795/src/utils/use-props-value.ts

bad ❌（只有一种受控模式）

```tsx
import classNames from 'classnames';
const prefixCls = 'my-input'
export default function MyInput(props: MyInputProps) {
  const { value, className, style, onChange } = props
  const currClassName = classNames(className, {
    `${prefixCls}-box`: true,
    `${prefixCls}-open`: value, // 是否采用打开样式
  })
  const onCheckOpen = () => {
    onChange?.(!value)
  }
  return (
    <div className={currClassName} style={style} onClick={onCheckOpen}>
      <span>12312</span>
    </div>
  );
};
```

after good ✅

```tsx
import classNames from 'classnames';
const prefixCls = 'my-input'
export default function MyInput(props: MyInputProps) {
  const { value, defaultValue = true, className, style, onChange } = props
  // 实现非受控模式
  const [open, setOpen] = useState(value || defaultValue)
  useEffect(() => {
    if(typeof value !== 'boolean') return
    setOpen(value)
  }, [value])
  const currClassName = classNames(className, {
    `${prefixCls}-box`: true,
    `${prefixCls}-open`: open, // 是否采用打开样式
  })
  const onCheckOpen = () => {
    onChange?.(!open)
    // 非受控模式下 组件内部自身处理
    if(typeof value !== 'boolean') {
      setOpen(!open)
    }
  }
  return (
    <div className={currClassName} style={style} onClick={onCheckOpen}>
      <span>12312</span>
    </div>
  );
};
```

# 最小依赖原则

所有组件封装都要遵循最小依赖原则，在条件允许的情况下，简单的方法需要引入新的依赖的情况下采用手写方式。这样避免开发出非常依赖融于的组件或组件库

bad ❌

```tsx
import { useLatest } from 'ahooks'; // 之前组件库无 ahooks, 会引入新的依赖！
import classNames from 'classnames';
const ChcInput = forwardRef((props: InputProps, ref: React.LegacyRef<Input>) => {
  const { className, ...rest } = props;
  const displayClassName = classNames('chc-input', className);
  const funcRef = useLatest(func); // 解决回调内无法获取最新state问题
  return <div className={displayClassName} {...rest}></div>;
});
export default ChcInput;
```

after good ✅

```tsx
// hooks/index.tsx
import { useRef } from 'react';
export function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
...
// 组件
import { useLatest } from '@/hooks'  // 之前组件库无 ahooks 引入新的依赖！
import classNames from 'classnames';
const ChcInput = forwardRef((props: InputProps, ref: React.LegacyRef<Input>) => {
  const { className, ...rest } = props;
  const displayClassName = classNames('chc-input', className);
  const funcRef = useLatest(func); // 解决回调内无法获取最新state问题
  return <div className={displayClassName} {...rest}></div>;
});
export default ChcInput
```

当然依赖包是否引入也要参考当时的使用情况，比如如果 `ahooks` 在公司内部基本都会使用，那这个时候引入也无妨。

# 功能拆分，单一职责原则

如果一个组件内部能力很强大，可能包含多个功能点，不建议将所有能力都只在组件内部体现，可以将这些功能拆分成其他的公共组件, 一个组件只处理一个功能点（单一职责原则），提高功能的复用性和灵活性。  
当然业务组件除外，业务组件可以在组件内实现多个组件的整合完成一个业务能力的单一职责。

bad ❌

```tsx
const MyShowPage = (props: MyTableProps) => {
  const { data, imgList, ref, ...rest } = props;
  return (
    <div>
      <Table ref={ref} data={data} {...rest}>
        {/* 表格显示相关功能封装 ...省略一堆代码 */}
      </Table>
      <div>{/* 图例相关功能封装  ...省略一堆代码 */}</div>
    </div>
  );
};
```

将`表格`和`图例`两个功能点拆分成单独的两个公共组件  
after good ✅

```tsx
const MyShowPage = (props: MyTableProps) => {
  const { data, imgList, ref, ...rest } = props;
  return (
    <div>
      {/* 表格组件只处理表格内容 */}
      <MyTable ref={ref} data={data} {...rest} />
      {/* 图片组件只处理图片展示能力 */}
      <MyImg data={imgList} />
    </div>
  );
};
```

当然如果完全没有复用价值的组件或功能点也是没必要拆分的。

# 通用组件去业务，业务组件内置业务

组件分为通用组件和业务组件，两者比较有明确的界限

- 通用组件更看重通用功能性和基本内容展示，组件涵盖的使用范围广
- 业务组件更看重业务的实现，组件的使用范围绑定具体的业务内容

## 通用组件内部不能包含业务

组件内部如果包含了业务内容，就会大大失去他的通用性，增加开发者的负担。

比如：有个通用的 `table` 组件，负责将传入的数据进行展示，内部封装了这样一个业务，当数据值小于 `0` 时，还是以正数的形式展示，但是使用红色字体：

bad ❌

```tsx
const MyTable = (props: MyTableProps) => {
  const { data, columns, ref, ...rest } = props;

  const dataRender = (item: ListItem) => {
    return Math.abs(item.value);
  };
  const styleRender = (item: ListItem) => {
    return item.value < 0 ? { color: 'red' } : undefined;
  };
  const tableColumns = useMemo(() => {
    return columns.map((item) => {
      if (item.name === 'value') {
        return {
          ...item,
          render: dataRender,
          styleRender: styleRender,
        };
      }
      return { ...item };
    });
  }, [column]);

  return (
    <Table ref={ref} data={data} {...rest}>
      {tableColumns.map((column) => (
        <Table.Column {...column} />
      ))}
    </Table>
  );
};
```

显然这样的逻辑在一个通用组件内是不合理的，业务性太强，开发者在使用的时候还要纳闷为什么值都是正数，难道是接口返回有问题？  
通用组件只承接通用的展示能力，上面的业务就放入到使用层去处理即可

after good ✅

组件内部：

```tsx
const MyTable = forwardRef((props: MyTableProps, ref: React.LegacyRef<Table>) => {
  const { data, columns, ...rest } = props;

  return (
    <Table ref={ref} data={tableData} {...rest}>
      {columns.map((column) => (
        <Table.Column {...column} />
      ))}
    </Table>
  );
});
```

使用：

```tsx
const columns = [
  {
    title: '名称',
    name: 'name',
  },
  {
    title: '数值',
    name: 'value',
    render: (item) => Math.abs(item.value),
    style: (item) => (item.value < 0 ? { color: 'red' } : undefined),
  },
];
const Home = (props: MyTableProps) => {
  const [list, setList] = useState([]);
  return (
    <View>
      <Table data={list} columns={columns} />
    </View>
  );
};
```

## 业务组件尽可能的在内部实现业务，降低使用者的使用负担

我们在封装业务组件的时候，切忌不可将相关复杂的业务逻辑以及运算放到组件外面由使用者去实现，在组件内部只是一些简单的封装；这很难达到业务组件的价值最大化，业务组件的目的就是聚焦某个业务尽可能的帮开发者快速完成。

比如：有个音乐 `table` 组件，负责将传入的数据进行一个音乐业务渲染和展示：

bad ❌

```tsx
const MyMusicTable = forwardRef((props: MyTableProps, ref: React.LegacyRef<Table>) => {
  const { data, ...rest } = props;
  return (
    <Table ref={ref} data={data} {...rest}>
      <Table.Column dataIndex="test1" title="标题1" />
      <Table.Column dataIndex="test2" title="标题2" />
      <Table.Column dataIndex="data" title="值" />
    </Table>
  );
});
```

如果有一个业务是当数据的 `type=1` 时，`data` 的值要乘 2 展示，则上面的组件使用者只能这样使用：

```tsx
const res = [...]
const data = useMemo(() => {
  return res.map(item => ({
    ...item,
    data: item.type === 1 ? item.data * 2 : item.data
  }))
}, [res])
return (
  <MyMusicTable data={data}/>
)
```

显然这样的封装在使用者这边会有一些心智负担，假如一个不熟悉业务的人来开发很容易会遗漏，所以这个时候需要业务组件内置业务，降低使用者的门槛

after good ✅

```tsx
const MyMusicTable = (props: MyTableProps) => {
  const { data, ref, ...rest } = props;
  const dataRender = (item: ListItem) => {
    return item.type === 1 ? item.data * 2 : item.data;
  };
  return (
    <Table ref={ref} data={data} {...rest}>
      <Table.Column dataIndex="test1" title="标题1" />
      <Table.Column dataIndex="test2" title="标题2" />
      <Table.Column dataIndex="data" title="值" render={dataRender} />
    </Table>
  );
};
```

使用者无需关心业务也可以顺利圆满完成任务：

```tsx
const res = [];
return <MyMusicTable data={res} />;
```

## 通用组件和业务组件混淆

业务开发的时候经常会出现因为样式一样，就把两个毫不相关的业务揉到一个组件里去，通过 `if else` 隔离，这是一个很不好的行为，这是混淆了业务组件和通用组件的概念，也没做到业务隔离。

如下例子因为光源和声音的 `UI` 样式差不多，用户将两个功能都封装到了一个 `LightSound` 业务组件内:

bad ❌

```tsx
const Home = () => {
  return (
    <div>
      <LightSound isSound value={sound} onChange={onSoundChange} />
      <LightSound value={light} onChange={onLightChange} />
    </div>
  )
});
```

```tsx
// LightSound
const LightSound = (props: LightSoundProps) => {
  const { show, title, isSound, value, onChange } = props;

  const showValue = useMemo(() => {
    if (isSound) {
    } else {
    }
  }, [value, isSound]);

  const handleChange = () => {
    if (isSound) {
    } else {
    }
  };

  return (
    <Popup show={show} className={styles.lightSound}>
      <div className={styles.lightSoundContent}>
        <div className={styles.lightSoundTitle}>{title}</div>
        {isSound ? (
          <div className={styles.soundContent}>...</div>
        ) : (
          <div className={styles.lightContent}>...</div>
        )}
      </div>
    </Popup>
  );
};
```

正确做法应该是将光源和声音相似的 `UI` 抽离成公共组件如下例如 `MyPopup`，然后分别封装光源 `Light` 和声音 `Sound` 业务组件依赖此公共组件 `MyPopup`

after good ✅

```tsx
const Home = () => {
  return (
    <div>
      <Sound value={sound} onChange={onSoundChange} />
      <Light value={light} onChange={onLightChange} />
    </div>
  )
});
```

```tsx
const Sound = (props: SoundProps) => {
  const { show, value, onChange } = props;
  return (
    <MyPopup show={show} title={Strings.getLang('soundTitle')}>
      <div className={styles.soundContent}>
        ...
      </div>
    </MyPopup>
  )
});
```

```tsx
const Light = (props: LightProps) => {
  const { show, value, onChange } = props;
  return (
    <MyPopup show={show} title={Strings.getLang('lightTitle')}>
      <div className={styles.lightContent}>
        ...
      </div>
    </MyPopup>
  )
});
```

# 最大深度扩展性

当组件传入的数据可能会有树形等有深度的格式，而组件内部也会针对其渲染出有递归深度的 `UI` 时，需要考虑到使用者对于数据深度的不可控性，组件内部需要预留好无限深度的可能

如下渲染组件方式只有一层的深度，很有局限性

bad ❌

```tsx
interface Columns extends TableColumnProps {
  columns: TableColumnProps[];
}
const MyTable = (props: MyTableProps) => {
  const { data, columns = [], ref, ...rest } = props;
  const renderColumn = useMemo(() => {
    return columns.map((item) => {
      return item.columns ? (
        <Table.Column {...item}>
          {item.columns.map((column) => (
            <Table.Column {...column} />
          ))}
        </Table.Column>
      ) : (
        <Table.Column {...item} />
      );
    });
  }, [columns]);
  return (
    <Table ref={ref} data={data} {...rest}>
      {renderColumn}
    </Table>
  );
};
```

after good ✅

```tsx
interface Columns extends TableColumnProps {
  columns: Columns[]; // 改变为继承自己
}
const MyTable = (props: MyTableProps) => {
  const { data, columns = [], ref, ...rest } = props;
  return (
    <Table ref={ref} data={data} {...rest}>
      {/* 采用外部组件 */}
      <MyColumn columns={columns} />
    </Table>
  );
};
const MyColumn = (props: MyColumnProps) => {
  const { columns = [] } = props;
  return item.columns ? (
    <Table.Column {...item}>
      {/* 递归渲染数据，实现数据的深度无限性 */}
      <MyColumn columns={item.columns} />
    </Table.Column>
  ) : (
    <Table.Column {...item} />
  );
};
```

# 多语言可配制化

- 组件内部所有的语言都需要可以修改，兼容多语言的使用场景
- 默认推荐英文
- 内部语言变量较多时可以统一暴露一个例如 `strings` 对象参数，其内部可以传入所有可以替换文案的 `key`

```ts
const strings = {
  title: '标题',
  cancel: '取消',
};
```

bad ❌

```tsx
const prefixCls = 'my-input'; // 统一的组件内部前缀
export default function MyInput(props: MyInputProps) {
  const { title = '标题' } = props;
  return (
    <div className={`${prefixCls}-box`}>
      <span className={`${prefixCls}-title`}>{title}</span>
      <span className={`${prefixCls}-detail`}>详情</span>
    </div>
  );
}
```

after good ✅

```tsx
const prefixCls = 'my-input'; // 统一的组件内部前缀
export default function MyInput(props: MyInputProps) {
  const { title = 'title', detail = 'detail' } = props;
  return (
    <div className={`${prefixCls}-box`}>
      <span className={`${prefixCls}-title`}>{title}</span>
      <span className={`${prefixCls}-detail`}>{detail}</span>
    </div>
  );
}
```

# 异常捕获和提示

- 对于用户传入意外的参数可能带来错误时要控制台 `console.error` 提示
- 不要直接在组件内部 `throw error`，这样会导致用户的白屏
- 缺少某些参数或者参数不符合要求但不会导致报错时可以使用 `console.warn` 提示

bad ❌

```tsx
export default function MyCanvas(props: MyCanvasProps) {
  const { instanceId } = props;

  useEffect(() => {
    initDom(instanceId);
  }, []);
  return (
    <div>
      <canvas id={instanceId} />
    </div>
  );
}
```

after good ✅

```tsx
export default function MyCanvas(props: MyCanvasProps) {
  const { instanceId } = props;

  useEffect(() => {
    if (!instanceId) {
      console.error('missing instanceId!');
      return;
    }
    initDom(instanceId);
  }, []);
  return (
    <div>
      <canvas id={instanceId} />
    </div>
  );
}
```

# 语义化原则

组件的命名，组件的 `api`，方法，包括内部的变量定义都要遵循语义化的原则，严格按照其代表的功能来命名。

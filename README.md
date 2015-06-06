# Carder
### API

###### /render?url=[地址]&timeout=[等待JS渲染的时间(毫秒)]

### iframe用法

直接`<iframe src="http://xxx/iframe?url=xxxx" frameborder="0"></iframe>`是用算法计算

`http://xxx/iframe?url=xxxx`可以带参数`source`，获取指定网站的卡片。例如，`http://xxx/iframe?url=xxxx&source=taobao`

### data结构

##### 文章（算法得出）

请求source为`default`。

```
{
  type: "article",
  content: "文章内容",
  keywords: ["关键词1", "关键词2"],
  images: ["url1", "url2"],
  title: "文章标题"
}
```

##### ebay

请求source为`Ebay`。

```
{
  type: "ebay",
  image: "单张图片地址",
  title: "标题",
  price: "价格",
  priceCurrency: "货币，一般是USD"
}
```

##### 网店通用

请求source为`default`。

```
{
  type: "ecommerce",
  image: "单张图片地址",
  title: "标题",
  price: "价格",
  priceCurrency: "RMB"
}
```

##### 土豆

请求source为`Tudou`。

```
{
  type: "tudou",
  tudouId: "土豆ID"
}
```

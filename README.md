# Carder

### API

###### /render?url=[地址]&timeout=[等待JS渲染的时间(毫秒)]

### iframe用法

直接`<iframe src="http://xxx/iframe?url=xxxx" frameborder="0"></iframe>`是用算法计算

`http://xxx/iframe?url=xxxx`可以带参数`source`，获取指定网站的卡片。例如，`http://xxx/iframe?url=xxxx&source=taobao`

### data结构

##### ebay

请求source为`Ebay`。

```
{
  type: "ebay",
  image: "单张图片地址"
}
```
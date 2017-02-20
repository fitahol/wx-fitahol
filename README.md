#wx-fitahol 开发文档#

#APP示例
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3820.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3821.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3822.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3823.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3824.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3825.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3826.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3827.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3828.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3829.PNG" width = "200" alt="图片名称" align=center />
<img src="https://github.com/fitahol/wx-fitahol/blob/master/screen/IMG_3830.PNG" width = "200" alt="图片名称" align=center />

*1.components:  公用组件
	在pages中引用： <import src="../../components/wxTemplate.wxml" />
								<block wx:for="{{[1, 2]}}">
									<template is="{{item % 2 == 0 ? 'picker' : 'HAHA'}}" data="{{...itemData}}" />
								</block>

*2.pages:  项目页面
	新添加的页面，需在app.json中注册

*3.images:  项目图片

*4.utils:  公用函数

******************************************************************************




#引入wxss文件#

@import "../../common.wxss";

# 模板引入#
<import src="../../components/wxTemplate.wxml" />
<block wx:key="{{[1, 2]}}">
	<template is="{{item % 2 == 0 ? 'picker' : 'HAHA'}}" data="{{...itemData}}" />
</block>
<!-- include可以将目标文件除了<template/>的整个代码引入，相当于是拷贝到include位置 -->
<include src="header.wxml"/>




#  swiper #
<swiper indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" bindchange="swiperChange">
	<block wx:for="{{imgUrls}}" wx:key="{{index}}">
		<swiper-item>
			<image src="{{item}}" class="slide-image" width="355" height="150"/>
		</swiper-item>
	</block>
</swiper>

获取id
<swiper-item data-id="{{item.id}}" >
Event.currentTarget.dataset.id


# 水平滚动 #
<!--水平滚动 ， 垂直滚动需要加height-->
<scroll-view scroll-x="true" style=" white-space: nowrap; display: flex" bindscrolltoupper="upper" bindscrolltolower="lower" bindscroll="scroll" scroll-into-view="{{toView}}" scroll-top="{{scrollTop}}">
<!-- display: inline-block-->
	<view style="width: 200px; height: 100px; display: inline-block" >
			<image class="c3-actual-img" src="https://qnmob.doubanio.com/view/movie_poster_cover/lpst/public/p2367899630.jpg?imageView2/0/q/80/w/9999/h/300/format/jpg"></image>
	</view>
</scroll-view>


"tabBar": {
	"selectedColor": "#f7604f",
	"color": "#999999",
	"borderStyle": "white",
	"backgroundColor": "#f5f5f5",
	"position": "bottom",
	"list": [{
		"pagePath": "pages/fitahol/fitahol",
		"text": "课程",
		"iconPath": "images/icons/connection-indicator-black.png",
		"selectedIconPath": "images/icons/connection-indicator.png"
	}, {
		"pagePath": "pages/member/member",
		"text": "学员",
		"iconPath": "images/icons/contacts-black.png",
		"selectedIconPath": "images/icons/contacts.png"
	}, {
		"pagePath": "pages/account/account",
		"text": "我的",
		"iconPath": "images/icons/user-account-black.png",
		"selectedIconPath": "images/icons/user-account.png"
	}]
},

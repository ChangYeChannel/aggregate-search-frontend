<template>
  <div class="index-page">
    <!--搜索框-->
    <a-input-search
      v-model:value="searchText"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <!--控制组件，用于控制页面中各组件之间的间距-->
    <MyDivider></MyDivider>
    <!--标签页-->
    <a-tabs v-model:activeKey="activeKey" @change="onTypeChange">
      <a-tab-pane key="post" tab="帖子">
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
//---------------------导包
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import UserList from "@/components/UserList.vue";
import PictureList from "@/components/PictureList.vue";
import MyDivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import myAxios from "@/plugins/myAxios";

//---------------------变量定义
const pictureList = ref([]); //帖子标签页数据
const postList = ref([]); //帖子标签页数据
const userList = ref([]); //用戶标签页数据
const route = useRoute(); //获取页面路由地址，用于获取页面状态信息，再刷新页面后按照url中的参数修改当前显示的页面
const activeKey = route.params.category; //默认选中打开的tab标签，为url中的tab标签地址
const router = useRouter(); //获取页面路由地址，用于拼装页面状态
const initSearchParams = {
  text: "", //搜索框内容
  pageSize: 10, //总页码
  pageNum: 1, //当前页
}; //页面初始值
const searchParams = ref(initSearchParams); //查询参数，默认为页面初始值
const searchText = ref(route.query.text || "");

//---------------------方法定义
const loadData = (params: any) => {
  const { type } = params;
  const query = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("/search/list", query).then((res: any) => {
    if (type === "post") {
      postList.value = res.dataList;
    } else if (type === "user") {
      userList.value = res.dataList;
    } else if (type === "picture") {
      pictureList.value = res.dataList;
    } else {
      postList.value = res.postList;
      userList.value = res.userList;
      pictureList.value = res.pictureList;
    }
  });
}; //按照搜索框内容和当前选中的tab栏类型执行搜索
const onSearch = (value: string) => {
  console.log(value);
  router.push({
    query: {
      ...searchParams.value,
      text: value,
    },
  }); //当用户点击搜索按钮时，改变url地址，将当前搜索内容追加到url中，键为text，值为当前查询内容
}; //用户点击搜索按钮后执行的方法
const onTypeChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  }); // 当用户点击tab标签栏上的任意标签时，将当前标签key追加到url中
}; //用户点击不同的tab标签后执行的方法

//---------------------组件方法定义
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams, //如果当前用户未传递参数，则使用当前初始变量
    text: route.query.text, //当监听到页面路由发生改变时，将url中的text信息同步到搜索框
    type: route.params.category, //当监听到页面路由发生变化时，将url中的当前页面类型同步到查询变量的type中
  } as any;
  loadData(searchParams.value); //发生变化时，重新加载数据
}); //vue监听方法
</script>

import { createRouter, createWebHistory } from "vue-router";
import loginVue from "@/views/login.vue";
import mainVue from '@/views/main.vue'
import dashboardVue from "@/components/dashboard.vue";
import userGroup from "@/components/userGroup/userGroup.vue"
import addUserGroup from "@/components/userGroup/addUserGroup.vue"
import editUserGroup from "@/components/userGroup/editUserGroup.vue"
import user from '@/components/user/user.vue'
import addUser from '@/components/user/addUser.vue'
import editUser from '@/components/user/editUser.vue'
import editAccount from '@/components/editAccount.vue'
import changePassword from '@/components/changePassword.vue'
import categories from '@/components/category/categories.vue'
import addCategory from '@/components/category/addCategory.vue'
import editCategory from '@/components/category/editCategory.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: loginVue,
    },
    {
      path: "/main",
      name: "main",
      component: mainVue,
      children:[
        {
          path:"profile",
          name:"profile",
          component: editAccount
        },
        {
          path:"newPassword",
          name:"newPassword",
          component: changePassword
        },
        {
          path:"dashboard",
          name:"dashboard",
          component: dashboardVue
        },
        {
          path:"userGroup",
          name:"userGroup",
          component: userGroup
        },
        {
          path:"userGroup/add",
          name:"addUserGroup",
          component: addUserGroup
        },
        {
          path:"userGroup/edit/:id",
          name:"editUserGroup",
          component: editUserGroup
        },
        {
          path:"user",
          name:"viewUser",
          component: user
        },
        {
          path: "user/add",
          name:"addUser",
          component: addUser
        },
        {
          path: "user/edit/:id",
          name:"editUser",
          component: editUser
        },
        {
          path: "categories",
          name: "viewCategories",
          component: categories
        },
        {
          path: "categories/add",
          name: "addCategory",
          component: addCategory
        },
        {
          path: "categories/edit/:id",
          name: "editCategory",
          component: editCategory
        }
      ]
    }
  ],
});

export default router;

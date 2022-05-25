import { createRouter, createWebHistory } from "vue-router";
import loginVue from "@/views/login.vue";
import mainVue from '@/views/main.vue'
import dashboardVue from "@/components/dashboard.vue";
import userGroup from "@/components/userGroup.vue"
import addUserGroup from "@/components/addUserGroup.vue"
import editUserGroup from "@/components/editUserGroup.vue"
import user from '@/components/user.vue'
import addUser from '@/components/addUser.vue'
import editUser from '@/components/editUser.vue'

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
          path:"addUserGroup",
          name:"addUserGroup",
          component: addUserGroup
        },
        {
          path:"editUserGroup/:id",
          name:"editUserGroup",
          component: editUserGroup
        },
        {
          path:"user",
          name:"viewUser",
          component: user
        },
        {
          path: "addUser",
          name:"addUser",
          component: addUser
        },
        {
          path: "editUser/:id",
          name:"editUser",
          component: editUser
        }
      ]
    }
  ],
});

export default router;

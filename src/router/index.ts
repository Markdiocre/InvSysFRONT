import { createRouter, createWebHistory } from "vue-router";
import loginVue from "@/views/login.vue";
import mainVue from '@/views/main.vue'
import dashboardVue from "@/components/dashboard.vue";

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
        }
      ]
    }
  ],
});

export default router;

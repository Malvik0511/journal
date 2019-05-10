import Vue from "vue";
import Router from "vue-router";

import TeacherListView from "./views/TeacherListView";
import TeacherView from "./views/TeacherView";
import NotFoundView from "./views/NotFoundView";
import LoginView from "./views/LoginView";

import { roles } from "./modules/constant";
import store from "./store/index";

Vue.use(Router);

const routes = [
  {
    name: "home",
    path: "/",
    redirect: { name: 'teachers' },
    meta: { requiresAuth: true }
   }, {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: { requiresAuth: false }
  }, {
    name: "teachers",
    path: "/teachers",
    component: TeacherListView,
    meta: { requiresAuth: true }
  }, {
    name: "departure",
    path: "/departure/:id",
    component: TeacherView,
    meta: { requiresAuth: true }
  }, {
    name: "arrival",
    path: "/arrival/:id",
    component: TeacherView,
    meta: { requiresAuth: true }
  }, {
    name: "404",
    path: "/*",
    component: NotFoundView,
    meta: { requiresAuth: true }
  },
];

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
});

router.beforeEach((to, from, next) => {
  let user= store.getters.authUser;
  // если для пути требуется авторизация проверяем загружен ли user
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      store.dispatch("getSessionUser")
          .then(next)
          .catch(() => next({ name: "login" }))
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

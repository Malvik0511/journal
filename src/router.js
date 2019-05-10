import Vue from "vue";
import Router from "vue-router";

import TeacherListView from "./views/TeacherListView";
import TeacherView from "./views/TeacherView";
import NotFoundView from "./views/NotFoundView";
import LoginView from "./views/LoginView";

import { roles } from "./modules/constant";
import store from "./store/index";

const accesses = {
  teacher: [roles.TEACHER],
  admin: [roles.ADMIN],
  all: [roles.TEACHER, roles.ADMIN],
  closed: null
};

Vue.use(Router);

const routes = [
  {
    name: "home",
    path: "/",
    redirect: { name: 'teachers' },
    meta: { requiresAuth: true, access: accesses.all }
   }, {
    name: "login",
    path: "/login",
    component: LoginView,
    meta: { requiresAuth: false, access: accesses.all }
  }, {
    name: "teachers",
    path: "/teachers",
    component: TeacherListView,
    meta: { requiresAuth: true, access: accesses.admin }
  }, {
    name: "departure",
    path: "/departure/:id",
    component: TeacherView,
    meta: { requiresAuth: true, access: accesses.all }
  }, {
    name: "arrival",
    path: "/arrival/:id",
    component: TeacherView,
    meta: { requiresAuth: true, access: accesses.all }
  }, {
    name: "404",
    path: "/*",
    component: NotFoundView,
    meta: { requiresAuth: true, access: accesses.all}
  },
];

const router = new Router({
  mode: "history",
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
});

const forAuth = (to, next, user) => {
  if ("access" in to.meta){
    if (to.meta.access.includes(user)){
      next();
    } else {
      if (to.meta.replace && to.meta.replace[user]){
        next(to.meta.replace[user]);
      } else {
        next({ name: "404" });
      }
    }
  } else {
    next({ name: "404" });
  }
};

router.beforeEach((to, from, next) => {
  let user = store.getters.authUser,
      role = user && user.role;
  // если для пути требуется авторизация проверяем загружен ли user
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      store.dispatch("getSessionUser")
          .then(() => {
            role = user.role;
            forAuth(to, next, role);
          })
          .catch(() => next({ name: "login" }))
    } else {
      forAuth(to, next, role);
    }
  } else {
    next();
  }
});


export default router;

import Vue from "vue";
import Router from "vue-router";

import MainTeacherView from "./views/MainTeacherView";
import TeacherView from "./views/TeacherView";
import NotFoundView from "./views/NotFoundView";
import LoginView from "./views/LoginView";

import { roles } from "./modules/constant";
import store from "./store/index";

import TeacherList from "./components/teacher/TeacherList";
import JournalList from "./components/journal/JournalList"
import TeacherJournalList from "./components/teacher/TeacherJournalList"

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
    path: "/main",
    component: MainTeacherView,
    meta: { requiresAuth: true, access: accesses.admin, replace: { [roles.TEACHER]: { name: "teacher"}} },
    children: [
      {
        name: "teachers",
        path: "",
        component: TeacherList,
        meta: { requiresAuth: true, access: accesses.admin }
      }, {
        name: "journals",
        path: "journals",
        component: JournalList,
        meta: { requiresAuth: true, access: accesses.admin }
      }

    ]
  }, {
    name: "",
    path: "/teacher",
    component: TeacherView,
    meta: { requiresAuth: false, access: accesses.all },
    children: [
      {
        name: "teacher",
        path: "",
        component: TeacherJournalList,
        meta: { requiresAuth: true, access: accesses.admin }
      }, {
        name: "idTeacher",
        path: ":id",
        component: TeacherJournalList,
        meta: { requiresAuth: true, access: accesses.admin }
      }
    ]
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
            role = store.getters.authUser.role;
            forAuth(to, next, role);
          })
          .catch(() => {
            next({ name: "login" })
          })
    } else {
      forAuth(to, next, role);
    }
  } else {
    next();
  }
});


export default router;

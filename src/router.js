import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home.vue";
import Login from "./pages/login.vue";
import Inbox from "./pages/inbox.vue";
import Week from "./pages/week.vue";
import Day from "./pages/day.vue"
import Tags from "./pages/tags.vue";
import Team from "./pages/team.vue";
import SignUp from "./pages/signup";
import myTeams from './pages/myTeams'
import Tasks from './pages/tasks'
import MyProfile from './pages/profile'
import News from './pages/news'
import teamChat from './pages/chats.vue'
import privateChats from './pages/privateChats.vue'
import notifications from './pages/notifications.vue'
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/inbox",
      name: "home",
      component: Home,
      children: [
        {
          path: "inbox",
          name: "inbox",
          component: Inbox
        },
        {
          path: "week",
          name: "week",
          component: Week
        },
        {
          path: "tags",
          name: "tags",
          component: Tags
        },
        {
          path: "creatingTeam",
          name: "creatingTeam",
          component: Team
        },
        {
          path: "myTeams",
          name: "myTeams",
          component: myTeams
        },
        {
          path: "/tasks",
          name: "tasks",
          component: Tasks
        },
        {
          path: "/profile",
          name: "profile",
          component: MyProfile
        },
        {
          path: "/news",
          name: "news",
          component: News
        },
        {
          path: "/day",
          name: "day",
          component: Day
        },
        {
          path: "/teamChats",
          name: "teamChats",
          component: teamChat
        },
        {
          path: "/privateChats",
          name: "privateChats",
          component: privateChats
        },
        {
          path: "/notifications",
          name: "notifications",
          component: notifications
        },
      ],
      beforeEnter: (to, from, next) => {
        if (!localStorage.token) {
          next({ path: "/login" });
        } else {
          next();
        }
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/signUp",
      name: "signup",
      component: SignUp
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

export default router;

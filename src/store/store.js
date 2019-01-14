import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    profile: {
      username: null,
      email: null,
      avatar: null,
      uid: null
    },
    teams: []
  },
  mutations: {
    updateState(state, payload) {
      state.profile = Object.assign(
        {},
        {
          email: payload.email,
          username: payload.username,
          avatar: payload.profile_picture.value,
          uid: payload.uid
        }
      );

      state.teams = payload.teams.team;
      console.log(state.teams)
    }
  },
  actions: {},
  getters: {
    profile: state => state.profile,
    teams: state => state.teams
  }
});

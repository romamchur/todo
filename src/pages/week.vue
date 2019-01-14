<template>
  <v-layout row>
    <v-flex xs12>
      <v-card v-for="(task, index) in tasks" :key="index" class="task">
        <v-layout row>
          <v-flex xs1></v-flex>
          <v-flex xs1>
            <v-icon>{{ taskIcon(task) }}</v-icon>
          </v-flex>
          <v-flex xs3>
            <div>{{ task.name }}</div>
          </v-flex>
          <v-flex xs3>
            <v-icon>mdi-account-group</v-icon>
            <div>{{ task.team }}</div>
          </v-flex>
          <v-flex xs2>
            <v-icon>mdi-calendar-range</v-icon>
            <div>{{ task.date }}</div>
          </v-flex>
          <v-flex xs2></v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tasks: []
    };
  },
  computed: {
    ...mapGetters(["teams"])
  },
  methods: {
    taskIcon(task) {
      return task.main.main ? "mdi-star" : "mdi-star-outline";
    }
  },
  created() {
    this.teams.forEach(team => {
      const filteredTasks = team.tasks.filter(t => {
        const time = new Date(`${t.date}T${t.time}:00Z`).getTime();
        const timeNow = new Date().getTime();

        return time - timeNow < 604800000;
      });

      this.tasks = this.tasks.concat(filteredTasks);
    });

    console.log(this.tasks);
  }
};
</script>

<style scoped lang="less">
.task {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;

  .flex {
    display: flex;
    align-items: center;

    .v-icon {
      margin-right: 6px;
    }
  }
}
</style>

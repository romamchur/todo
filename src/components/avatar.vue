<template>
  <v-menu transition="slide-y-transition" bottom>
    <div class="td-avatar" slot="activator">
      <v-avatar size="48px"> <img :src="profile.avatar" /> </v-avatar>
      <span class="td-avatar__name">{{ profile.username }}</span>
    </div>
  </v-menu>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["profile"])
  }
};
</script>
<style scoped lang="less">
.td-avatar {
  display: flex;
  align-items: center;

  &__name {
    margin-left: 8px;
  }
}
</style>

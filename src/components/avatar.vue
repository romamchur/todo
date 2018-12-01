<template>
    <v-menu
            transition="slide-y-transition"
            bottom
    >
        <div class="td-avatar"  slot="activator">
            <v-avatar size="36px">
                <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="Avatar">
            </v-avatar>

            <span class="td-avatar__name">Roman Mamchur</span>
        </div>
        <v-list>
            <v-list-tile>
                <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </v-menu>

</template>
<script>
    export default {
    }
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
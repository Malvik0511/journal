<template>
    <div class="navigation-add">
        <v-list dark>
            <v-list-tile
                    v-for="item in items"
                    :key="item.title"
                    :to="item.route"
                    active-class=""
                    :class="{'v-list__tile-active primary--text': item.active}">
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
    import "./navigation-add.css"

    export default {
        name: "NavigationAdd",

        data: () => ({}),

        props: {
          nav_list: {
              required: true
          }
        },

        computed: {
            // объект с основным меню
            items() {
                return this.nav_list.filter(item => item);
            },
        },
    };
</script>

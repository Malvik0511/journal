<template>
    <v-progress-circular
            :size="70"
            :width="4"
            color="primary"
            indeterminate
            class = "fixed-center"
    ></v-progress-circular>
</template>

<script>

    export default {
        name: "Loader",
    };
</script>
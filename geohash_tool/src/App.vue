<template>
    <div id="app">
        <Main msg="this is a main component"/>
    </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
    name: 'App',
    components: {
        Main
    }
}
</script>

<style>
html, body {
    overflow: hidden;
    margin: 0;
    text-align: center;
    width: 100%;
    height: 100%;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
    width: 100%;
    height: 100%;
}
</style>

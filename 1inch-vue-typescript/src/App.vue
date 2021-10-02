<template>
  <img
    alt="Moralis logo"
    height="200"
    src="https://moralis.io/wp-content/uploads/2021/06/Moralis-Glass-Favicon.svg"
  />
  <img alt="Vue logo" height="200" src="./assets/logo.png" />
  <img
    alt="1inch logo"
    height="200"
    src="https://www.pngall.com/wp-content/uploads/10/1inch-Crypto-Logo-PNG-Pic.png"
  />
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<template>
  <div id="app">
    <img alt="Plane" src="@/assets/logo.jpg">
    <p>Welcome to the basa data service</p>
    <form novalidate class="md-layout">
      <md-card id="selector-card" class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">Data</div>
        </md-card-header>
        <md-card-content>
          <!-- COLUMN SELECTOR -->
          <md-menu>
            <md-button md-menu-trigger>Columns</md-button>
            <md-menu-content>
              <md-menu-item v-for="(column, index) in columns" :key="index">
                <md-checkbox v-model="selected_columns" :value="column">{{ column }}</md-checkbox> 
              </md-menu-item>
            </md-menu-content>
          </md-menu>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-checkbox v-model="has_from_value">Set from value</md-checkbox>
              <md-field v-if="has_from_value">
                <md-input v-model="from_value"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-checkbox v-model="has_to_value">Set to value</md-checkbox>
              <md-field v-if="has_to_value">
                <md-input v-model="to_value"></md-input>
              </md-field>
            </div>
          </div>
          <div>
            <p>Filter results, see <a href="https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.query.html">this link</a> and <a href="https://www.sharpsightlabs.com/blog/pandas-query/">this guide</a> for more info.</p>
              <md-field>
                <md-input v-model="filter"></md-input>
              </md-field>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button class="md-raised" @click="activatePreview" :disabled="loading">Preview</md-button>
          <md-button class="md-raised" :href="this.downloadUri" :disabled="loading">Export</md-button>
        </md-card-actions>
      </md-card>
    </form>
    <div v-if="preview && !loading" v-html="preview" ></div>
    <md-progress-bar v-if="loading" md-mode="indeterminate"></md-progress-bar>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: function() {
    return {
      columns: [],
      selected_columns: [],
      has_from_value: false,
      from_value: 0,
      has_to_value: false,
      to_value: 1000,
      preview: "",
      filter: "",
      loading: false,
    }
  },
  mounted: async function() {
    this.columns = (await this.$http.get(process.env.VUE_APP_BACKEND_URL + '/columns')).data
  },
  computed: {
    params: function () {
      var params = {}
      if (this.selected_columns.length > 0) params.c = this.selected_columns.join(',')
      if (this.has_from_value) params.s = this.from_value
      if (this.has_to_value) params.e = this.to_value
      if (this.filter.length > 0) params.f = this.filter
      return params
    },
    downloadUri: function() {
      return this.$http.getUri({
        url: process.env.VUE_APP_BACKEND_URL + '/subset',
        params: this.params,
      })
    }
  },
  methods: {
    activatePreview: async function() {
      this.loading = true
      this.preview = (await this.$http.get(process.env.VUE_APP_BACKEND_URL + '/preview', { params: this.params })).data
      this.loading = false
    },
  }
}
</script>

<style>
#selector-card {
  margin-left: auto;
  margin-right: auto;
}
img {
  max-width: 200px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

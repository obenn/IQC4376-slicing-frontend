<template>
  <div id="app">
    <img alt="Plane" src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Ygnairport2006.jpg" />
    <p>Welcome to the basa data service</p>
    <form novalidate class="md-layout">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
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
        </md-card-content>
        <md-card-actions>
          <md-button @click="activatePreview">Preview</md-button>
          <md-button :href="this.downloadUri">Export</md-button>
        </md-card-actions>
      </md-card>
    </form>
    <div v-if="preview.length > 0">
      <md-table>
        <md-table-row>
          <md-table-head v-for="(k, i) in preview_headers" :key="i">
            {{ k }}
          </md-table-head>
        </md-table-row>
        <md-table-row v-for="(row, index) in preview" :key="index">
          <md-table-cell v-for="(k, i) in preview_headers" :key="i">{{row[k]}}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
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
      preview: [],
    }
  },
  mounted: async function() {
    this.columns = (await this.$http.get(process.env.VUE_APP_BACKEND_URL + '/columns')).data
  },
  computed: {
    preview_headers: function() {
      return Object.keys(this.preview[0])
    },
    params: function () {
      var params = {
        columns: this.selected_columns.join(','),
      }
      if (this.has_from_value) params.beginning = this.from_value
      if (this.has_to_value) params.end = this.to_value
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
      this.preview = (await this.$http.get(process.env.VUE_APP_BACKEND_URL + '/preview', { params: this.params })).data
    },
  }
}
</script>

<style>
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

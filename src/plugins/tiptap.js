import Vue from 'vue'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import Vuetify from 'vuetify'
// don't forget to import CSS styles
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'


// Vuetify Object (as described in the Vuetify 2 documentation)
const vuetify = new Vuetify()

// use Vuetify's plugin
Vue.use(Vuetify)

Vue.use(TiptapVuetifyPlugin, {
    // the next line is important! You need to provide the Vuetify Object to this place.
    vuetify, // same as "vuetify: vuetify"
    // optional, default to 'md' (default vuetify icons before v2.0.0)
    iconsGroup: 'mdi'
  })
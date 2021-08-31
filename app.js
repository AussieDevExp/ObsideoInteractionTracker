const app = Vue.createApp({
    data: function() {
      return {
        current_app_version: "0.015",
        all_ghost_types: ["Effigy", "Rusalka", "Demon", "Shade", "Oni", "Yurei", "Mare", "Chimera"],
        all_interactions,
        current_selected_interactions: new Array(),
        tab_list: ["Tracker", "Settings"],
        theme_list: ["Light", "Dark"],
        current_tab: "Tracker",
        current_theme: "Light"
      };
    },
    created() {

    },
    mounted() {

    },
    computed: {

    },
    methods: {
      getAllGhostInteractions(ghost_type) {
        let interaction_list = new Array();
        for (const info of this.all_interactions) {
          if (info[0].length == 0 || info[0].includes(ghost_type.toLowerCase())) interaction_list.push(info[1]);
        }
        return interaction_list;
      },
      getAllPossibleGhostTypes() {
        let possible_ghost_types = new Array();
        for (const ghost_type of this.all_ghost_types) {
          let all_interactions_for_ghost = this.getAllGhostInteractions(ghost_type);
          let filtered_array = all_interactions_for_ghost.filter(interaction => this.current_selected_interactions.includes(interaction));
          if (filtered_array.length == this.current_selected_interactions.length) possible_ghost_types.push(ghost_type);
        }
        return possible_ghost_types;
      },
      getPossibleGhostTypeDisplay() {
        let string = "";
        for (const [idx, ghost_type] of this.getAllPossibleGhostTypes().entries()) {
          string += ghost_type;
          if (idx >= this.getAllPossibleGhostTypes().length - 1) continue;
          string += idx < this.getAllPossibleGhostTypes().length - 2 ? ", " : " and ";
        }
        if (string == "") string += "None";
        string += "."; 
        return string;
      },
      clearAllInteractions() {
        let checkboxes = document.getElementsByClassName("interaction-checkbox");
        let checked_checkboxes = Array.prototype.filter.call(checkboxes, val => val.checked);
        for (let checkbox of checked_checkboxes) {
          checkbox.checked = false;
          this.current_selected_interactions.splice(this.current_selected_interactions.indexOf(checkbox.value), 1);
        }
      }
    },
    template: `
    <div id="app-container" :style="{backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">
    <div id="flex-container" style="display:flex; flex-wrap:wrap; flex-shrink:0;">
      <div style="overflow:auto; text-align:center; margin:10px; display:flex; justify-content:center; flex-wrap:wrap; flex-basis:100%; flex-grow:1;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
        <div style="text-align:center; font-size:20px; flex-basis:100%;">
          <span style="font-weight:bold;">Possible Ghost Type/s:</span> <span>{{getPossibleGhostTypeDisplay()}}</span>
        </div>
        <div style="flex-basis:100%;">
          <span style="font-weight:bold; font-style:italic;">v{{current_app_version}}</span>
        </div>
      </div>
      <div v-if="current_tab=='Tracker'" style="display:inline-flex; flex-basis:100%; flex-direction:column; gap:5px;">
          <div class="can-be-clicked highlighted-lightgray-on-hover" @click="clearAllInteractions" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="{border: '3px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">Clear</div>
          <div style="display:flex; flex-flow:column wrap; flex: 1 1 auto; max-height:80vh; overflow:auto;">
            <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in all_interactions.map(val => val[1])" style="margin:2px; padding:2px; flex: 0 1 2%;" :style="{border: '2px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">
              <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" v-model="current_selected_interactions">
              <label class="can-be-clicked" :for="'interaction'+idx" :style="{fontWeight:current_selected_interactions.includes(interaction) ? 'bold' : 'normal'}">{{interaction}}</label>
            </div>
          </div>
      </div>
      <div v-if="current_tab=='Settings'" style="display:flex; flex-wrap:wrap; flex-basis:100%; flex-direction:row; margin:auto;">
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; gap:3px;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
          Current Theme:
          <select v-model="current_theme">
            <option disabled value="">Select a theme!</option>
            <option v-for="theme in theme_list">{{theme}}</option>
          </select>
        </div>
      </div>
      <div style="display:flex; flex-direction:row; margin:auto; flex-wrap:wrap; place-content:center; padding:10px; flex-basis:100%;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
        <div class="can-be-clicked highlighted-lightgray-on-hover" v-for="tab in tab_list" @click="current_tab=tab" style="margin:3px; border-radius:10px; padding:3px;" :style="{border: '3px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">{{tab}}</div>
      </div>
    </div>
    </div>
    `
});
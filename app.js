const app = Vue.createApp({
    data: function() {
      return {
        current_app_version: "0.017",
        all_ghost_types: ["Effigy", "Rusalka", "Demon", "Shade", "Oni", "Yurei", "Mare", "Chimera"],
        all_interactions,
        current_selected_interactions: new Array(),
        tab_list: ["Tracker", "Settings"],
        theme_list: ["Light", "Dark"],
        sort_method_list: ["Alphabetical", "Categorical"],
        current_tab: "Tracker",
        current_theme: "Light",
        current_sort_method: "Alphabetical"
      };
    },
    created() {},
    mounted() {},
    computed: {},
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
        let possible_ghost_types = this.getAllPossibleGhostTypes();
        string += `<span style='font-weight:bold;'>`;
        if (this.current_selected_interactions.length <= 0) {
          string += `You have not selected an interaction yet. Try selecting one to begin tracking your ghost`;
        } else if (possible_ghost_types.length <= 0) {
          string += `There is not a single ghost type that is possible based on your interaction selections`;
        } else {
          string += `</span><span>You are dealing with ${this.getSingularWordForGhost(possible_ghost_types[0])} `
          for (const [idx, ghost_type] of possible_ghost_types.entries()) {
            string += ghost_type;
            if (idx >= possible_ghost_types.length - 1) continue;
            string += idx < possible_ghost_types.length - 2 ? `, ` : ` or `;
          }
        }
        string += `.</span>` 
        return string;
      },
      clearAllInteractions() {
        let checkboxes = document.getElementsByClassName("interaction-checkbox");
        let checked_checkboxes = Array.prototype.filter.call(checkboxes, val => val.checked);
        for (let checkbox of checked_checkboxes) {
          checkbox.checked = false;
          this.current_selected_interactions.splice(this.current_selected_interactions.indexOf(checkbox.value), 1);
        }
      },
      getSingularWordForGhost(ghost_type) {
        let uses_a = ["Rusalka", "Demon", "Shade", "Yurei", "Mare", "Chimera"];
        let uses_an = ["effigy", "Oni"];
        return uses_a.includes(ghost_type) ? `a` : `an`; 
      },
      getGroupedInteractions() {
        let unique_categories = new Array();
        let final_category_inputs = new Array();
        for (let category of this.all_interactions.map(val => val[2])) {
          if (unique_categories.includes(category)) continue;
          unique_categories.push(category);
        }
        for (let category of unique_categories) {
          final_category_inputs.push([category, this.all_interactions.filter(val => val[2] == category).map(val => val[1])]);
        }
        return final_category_inputs;
      }
    },
    template: `
    <div id="app-container" :style="{backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">
    <div id="flex-container" style="display:flex; flex-wrap:wrap; flex-shrink:0;">
      <div style="overflow:auto; text-align:center; margin:10px; display:flex; justify-content:center; flex-wrap:wrap; flex-basis:100%; flex-grow:1;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
        <div style="text-align:center; font-size:20px; flex-basis:100%;" v-html="getPossibleGhostTypeDisplay()"></div>
        <div style="flex-basis:100%;">
          <span style="font-weight:bold; font-style:italic;">v{{current_app_version}}</span>
        </div>
      </div>
      <div v-if="current_tab=='Tracker'" style="display:inline-flex; flex-basis:100%; flex-direction:column; gap:5px;">
          <div class="can-be-clicked highlighted-lightgray-on-hover" @click="clearAllInteractions" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="{border: '3px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">Clear</div>
          <div v-if="current_sort_method=='Categorical'" style="display:flex; flex-flow:row wrap; overflow:auto; max-height:80vh; max-width:100vw;">
            <div v-for="(interactions, idx2) in getGroupedInteractions()" style="max-height:50%; flex: 1 1 auto; display:flex; flex-direction:column;">
              <div style="flex: 0; text-align:center; font-weight:bold;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">{{interactions[0]}}</div>
              <div style="display:inline-flex; flex-flow:column; flex: 0 1 auto; overflow:auto; max-height:100%;">
                <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in interactions[1].sort()" style="margin:2px; padding:2px;" :style="{border: '2px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">
                  <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx+idx2" :value="interaction" v-model="current_selected_interactions">
                  <label class="can-be-clicked" :for="'interaction'+idx+idx2" :style="{fontWeight:current_selected_interactions.includes(interaction) ? 'bold' : 'normal'}">{{interaction}}</label>
                </div>
              </div>
            </div>
          </div>
          <div v-if="current_sort_method=='Alphabetical'" style="display:flex; flex-flow:column wrap; flex: 1 1 auto; max-height:80vh; overflow:auto; max-width:100vw;">
            <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in all_interactions.map(val => val[1]).sort()" style="margin:2px; padding:2px; flex: 0 1 2%;" :style="{border: '2px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">
              <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" v-model="current_selected_interactions">
              <label class="can-be-clicked" :for="'interaction'+idx" :style="{fontWeight:current_selected_interactions.includes(interaction) ? 'bold' : 'normal'}">{{interaction}}</label>
            </div>
          </div>
      </div>
      <div v-if="current_tab=='Settings'" style="display:flex; flex-wrap:wrap; flex-basis:100%; flex-direction:row; margin:auto; align-items:center; gap:10px;">
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
          Current Theme:
          <select v-model="current_theme">
            <option disabled value="">Select a theme!</option>
            <option v-for="theme in theme_list">{{theme}}</option>
          </select>
        </div>
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
          Current Tracker Sorting Method:
          <select v-model="current_sort_method">
            <option disabled value="">Select a sort method!</option>
            <option v-for="sort_method in sort_method_list">{{sort_method}}</option>
          </select>
        </div>
      </div>
      <div style="display:flex; flex-direction:row; margin:auto; flex-wrap:wrap; place-content:center; padding:10px; flex-basis:100%;" :style="{color: current_theme == 'Light' ? 'black' : 'white'}">
        <div class="can-be-clicked highlighted-lightgray-on-hover" v-for="tab in tab_list" @click="current_tab=tab" style="margin:3px; border-radius:10px; padding:3px;" :style="{border: '3px solid ' + (current_theme == 'Light' ? 'black' : 'white'), color: current_theme == 'Light' ? 'black' : 'white', backgroundColor: current_theme == 'Light' ? 'white' : 'black'}">{{tab}}</div>
      </div>
    </div>
    </div>
    `
}); //flex-flow:column wrap; TODO: figure out a way to wrap but keep category text centered... seems difficult atm.
// flex-flow:row wrap in categorical to wrap the categories.. Might change to this at some point for mobile support. I will just overflow x for now. same with column wrap on each category.
// could add another array to interactions to have them show up differently based on the sorting type... however I would need to refactor the way I check the selected interactions. However, I think I have a pretty simple solution to this if I decide to add it.
// could use grid for alphabetical, will think about it...
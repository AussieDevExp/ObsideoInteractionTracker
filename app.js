const app = Vue.createApp({
    data: function() {
      return {
        current_app_version: "0.019",
        all_ghost_types,
        all_interactions,
        theme_data,
        current_selected_interactions: new Array(),
        tab_list: ["Tracker", "Settings"],
        theme_list: ["Light", "Dark", "Grayscale"],
        sort_method_list: ["Alphabetical", "Categorical"],
        setting_text_list: ["Current Theme", "Current Interaction Sorting Method"],
        setting_disabled_option_text_list: ["Select a theme!", "Select a sorting method!"],
        all_option_values: ['current_theme', 'current_sort_method'],
        current_tab: "Tracker",
        current_theme: "Light",
        current_sort_method: "Alphabetical"
      };
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
        for (const [ghost_type_name, ghost_type_data] of Object.entries(this.all_ghost_types)) {
          let all_interactions_for_ghost = this.getAllGhostInteractions(ghost_type_name);
          let filtered_array = all_interactions_for_ghost.filter(interaction => this.current_selected_interactions.includes(interaction));
          if (filtered_array.length == this.current_selected_interactions.length) possible_ghost_types.push([ghost_type_name.charAt(0).toUpperCase() + ghost_type_name.slice(1), ghost_type_data]);
        }
        return possible_ghost_types;
      },
      getPossibleGhostTypeDisplay() {
        let string = "";
        let possible_ghost_types = this.getAllPossibleGhostTypes();
        string += `<span style="text-align:center; flex-basis:100%;"><span style='font-weight:bold; font-size:20px;'>`;
        if (this.current_selected_interactions.length <= 0) {
          string += `You have not selected an interaction yet. Try selecting one to begin tracking your ghost`;
        } else if (possible_ghost_types.length <= 0) {
          string += `There is not a single ghost type that is possible based on your interaction selections`;
        } else {
          string += `</span><span style="font-size:20px;">You are dealing with ${this.getSingularWordForGhost(possible_ghost_types[0][0])} `;
          for (const [idx, ghost_type] of possible_ghost_types.map(val => val[0]).entries()) {
            string += ghost_type;
            if (idx >= possible_ghost_types.length - 1) continue;
            string += idx < possible_ghost_types.length - 2 ? `, ` : ` or `;
          }
          if (possible_ghost_types.length == 1) string += `.</span><br><span style="font-size:18px;">You will need ${this.getExorcismItemDisplay(possible_ghost_types[0][1])} in order to exorcise this ghost`;
        }
        string += `.</span></span>` 
        return string;
      },
      getExorcismItemDisplay(ghost_type_data) {
        let string = "";
        for (let [idx, exorcism_item] of ghost_type_data.exorcism_items.entries()) {
          string += `${exorcism_item.singular_word} ${exorcism_item.display}`;
          if (idx >= ghost_type_data.exorcism_items.length - 1) continue;
          string += idx < ghost_type_data.exorcism_items.length - 2 ? ', ' : ' and ';
        }
        return string;
      },
      clearAllInteractions() {
        this.current_selected_interactions = new Array();
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
      },
      getAllOptionLists() {
        return [this.theme_list, this.sort_method_list];
      }
    },
    computed: {
      getCurrentThemeData() {
        return this.theme_data[this.current_theme.toLowerCase()];
      }
    },
    template: `
    <div id="app-container" :style="{backgroundColor: getCurrentThemeData.backgroundColor}">
    <div id="flex-container" style="display:flex; flex-wrap:wrap; flex-shrink:0;">
      <div style="overflow:auto; text-align:center; margin:10px; display:flex; justify-content:center; flex-wrap:wrap; flex-basis:100%; flex-grow:1;" :style="{color: getCurrentThemeData.textColor}">
        <div v-html="getPossibleGhostTypeDisplay()"></div>
        <div style="flex-basis:100%;">
          <span style="font-weight:bold; font-style:italic;">v{{current_app_version}}</span>
        </div>
      </div>
      <div v-if="current_tab=='Tracker'" style="display:inline-flex; flex-basis:100%; flex-direction:column; gap:5px;">
          <div class="can-be-clicked highlighted-lightgray-on-hover" @click="clearAllInteractions" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="{border: '3px solid ' + getCurrentThemeData.borderColor, color: getCurrentThemeData.textColor, backgroundColor: getCurrentThemeData.backgroundColor}">Clear All Interactions</div>
          <Categorical :isCorrectSortMethod="current_sort_method=='Categorical'" :currentThemeData="getCurrentThemeData" :categoryData="getGroupedInteractions()" v-model:currentInteractions="current_selected_interactions"></Categorical>
          <Alphabetical :isCorrectSortMethod="current_sort_method=='Alphabetical'" :currentThemeData="getCurrentThemeData" :allInteractionData="all_interactions" v-model:currentInteractions="current_selected_interactions"></Alphabetical>
      </div>
      <div v-if="current_tab=='Settings'" style="display:flex; flex-wrap:wrap; flex-basis:100%; flex-direction:row; margin:auto; align-items:center; gap:10px;">
        <Basic-Setting-Dropdown v-for="(_, idx) in new Array(2)" :optionList="getAllOptionLists()[idx]" :disabledOptionValue="setting_disabled_option_text_list[idx]" :settingMainText="setting_text_list[idx]" :currentThemeData="getCurrentThemeData" v-model:optionValue="this[all_option_values[idx]]" :key="current_theme + idx"></Basic-Setting-Dropdown>
      </div>
      <div style="display:flex; flex-direction:row; margin:auto; flex-wrap:wrap; place-content:center; padding:10px; flex-basis:100%;" :style="{color: getCurrentThemeData.textColor}">
        <div class="can-be-clicked highlighted-lightgray-on-hover" v-for="tab in tab_list" @click="current_tab=tab" style="margin:3px; border-radius:10px; padding:3px;" :style="{border: '3px solid ' + getCurrentThemeData.borderColor, color: getCurrentThemeData.textColor, backgroundColor: getCurrentThemeData.backgroundColor}">{{tab}}</div>
      </div>
    </div>
    </div>
    `
});
const app = Vue.createApp({
    data: function() {
      return {
        current_app_version: "0.021",
        all_ghost_types,
        all_interactions,
        theme_data,
        current_selected_interactions: new Array(),
        tab_list: ["Tracker", "Settings"],
        theme_list: ["Light", "Dark", "Grayscale"],
        sort_method_list: ["Alphabetical", "Categorical"],
        interaction_marker_placements: ["Left", "Right"],
        setting_text_list: ["Current Theme", "Current Interaction Sorting Method", "Current Interaction Marker Placement"],
        setting_disabled_option_text_list: ["Select a theme!", "Select a sorting method!", "Select an interaction marker position!"],
        all_option_values: ['current_theme', 'current_sort_method', 'current_interaction_marker_placement'],
        current_tab: "Tracker",
        current_theme: "Light",
        current_sort_method: "Alphabetical",
        current_interaction_marker_placement: "Left",
        should_show_interaction_markers: true,
        force_rerender: false
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
        this.force_rerender = !this.force_rerender;
      },
      getSingularWordForGhost(ghost_type) {
        let uses_a = ["Rusalka", "Demon", "Shade", "Yurei", "Mare", "Chimera"];
        let uses_an = ["effigy", "Oni"];
        return uses_a.includes(ghost_type) ? `a` : `an`; 
      },
      getAllOptionLists() {
        return [this.theme_list, this.sort_method_list, this.interaction_marker_placements];
      },
      getOptionBools() {
        return [true, true, this.should_show_interaction_markers];
      },
      forceRerender() {
        this.force_rerender = !this.force_rerender;
      },
      changeShowInteractionMarkerOption() {
        this.should_show_interaction_markers = !this.should_show_interaction_markers;
        this.forceRerender();
      }
    },
    computed: {
      getCurrentThemeData() {
        return this.theme_data[this.current_theme.toLowerCase()];
      },
      getSortingMethodData() {
        return {
          "alphabetical": {
            possible_ghost_types: this.getAllPossibleGhostTypes(),
            is_correct_sort_method: this.current_sort_method == 'Alphabetical',
            current_theme_data: this.getCurrentThemeData,
            interaction_data: this.all_interactions,
            show_interaction_markers: this.should_show_interaction_markers,
            interaction_marker_position: this.current_interaction_marker_placement
          },
          "categorical": {
            possible_ghost_types: this.getAllPossibleGhostTypes(),
            is_correct_sort_method: this.current_sort_method == 'Categorical',
            current_theme_data: this.getCurrentThemeData,
            interaction_data: this.all_interactions,
            show_interaction_markers: this.should_show_interaction_markers,
            interaction_marker_position: this.current_interaction_marker_placement 
          }
        };
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
          <Categorical v-model:data="getSortingMethodData['categorical']" v-model:currentInteractions="current_selected_interactions" v-model:reRender="force_rerender" :key="force_rerender"></Categorical>
          <Alphabetical v-model:data="getSortingMethodData['alphabetical']" v-model:currentInteractions="current_selected_interactions" v-model:reRender="force_rerender" :key="force_rerender"></Alphabetical>
      </div>
      <div v-if="current_tab=='Settings'" style="display:flex; flex-wrap:wrap; flex-basis:100%; flex-direction:row; margin:auto; align-items:center; gap:10px;">
        <Basic-Setting-Dropdown v-for="(_, idx) in new Array(getAllOptionLists().length)" :optionList="getAllOptionLists()[idx]" :bool="getOptionBools()[idx]" :disabledOptionValue="setting_disabled_option_text_list[idx]" :settingMainText="setting_text_list[idx]" :currentThemeData="getCurrentThemeData" v-model:optionValue="this[all_option_values[idx]]" v-model:reRender="force_rerender" :key="force_rerender+'setting'+idx"></Basic-Setting-Dropdown>
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="{color: this.getCurrentThemeData.textColor}">
          <div style="flex:1 0 100%;">Show Interaction Markers</div>
          <div style="flex:1 0 100%;">
            <input class="can-be-clicked" type="checkbox" id="x" :value="should_show_interaction_markers" @input="changeShowInteractionMarkerOption" v-model="should_show_interaction_markers">
            <label class="can-be-clicked" for="x">{{should_show_interaction_markers ? "Enabled" : "Disabled"}}</label>
          </div>
        </div>
      </div>
      <div style="display:flex; flex-direction:row; margin:auto; flex-wrap:wrap; place-content:center; padding:10px; flex-basis:100%;" :style="{color: getCurrentThemeData.textColor}">
        <div class="can-be-clicked highlighted-lightgray-on-hover" v-for="tab in tab_list" @click="current_tab=tab" style="margin:3px; border-radius:10px; padding:3px;" :style="{border: '3px solid ' + getCurrentThemeData.borderColor, color: getCurrentThemeData.textColor, backgroundColor: getCurrentThemeData.backgroundColor}">{{tab}}</div>
      </div>
    </div>
    </div>
    `
});
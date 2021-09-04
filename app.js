const app = Vue.createApp({
    data: function() {
      return {
        current_app_version: "0.023",
        all_ghost_types,
        all_interaction_categories,
        all_interaction_ghost_types,
        theme_data,
        current_selected_interactions: new Array(),
        tab_list: ["Tracker", "Settings"],
        theme_list: ["Light", "Dark", "Grayscale"],
        sort_method_list: ["Alphabetical", "Categorical"],
        filtering_methods: ["None", "Interaction Markers", "Visibility"],
        interaction_marker_placements: ["Left", "Right"],
        should_show_found_text: true,
        should_show_probable_ghost_text: true,
        setting_text_list: ["Current Theme", "Current Interaction Sorting Method", "Current Interaction Filtering Method", "Current Interaction Marker Placement"],
        setting_disabled_option_text_list: ["Select a theme!", "Select a sorting method!", "Select an interaction filtering method!", "Select an interaction marker position!"],
        tab: {
          current: "Tracker"
        },
        theme: {
          current: "Light"
        },
        sort_method: {
          current: "Alphabetical"
        },
        interaction_marker_position: {
          current: "Left"
        },
        interaction_filtering_method: {
          current: "Interaction Markers"
        },
        interaction_name_search: {
          current: ""
        },
        ghosts_to_filter: {
          current: new Array()
        },
        force_rerender: false
      };
    },
    methods: {
      getAllGhostInteractions(ghost_type) {
        let interaction_list = new Array();
        for (const inter_info of Object.entries(this.all_interaction_ghost_types)) {
          let ghost_types = Object.keys(inter_info[1].ghost_types);
          if (ghost_types.length == 0 || ghost_types.includes(ghost_type.toLowerCase())) interaction_list.push(inter_info[0]);
        }
        return interaction_list;
      },
      getAllPossibleGhostTypes() {
        let possible_ghost_types = new Array();
        for (const [ghost_type_name, ghost_type_data] of Object.entries(this.all_ghost_types)) {
          let all_interactions_for_ghost = this.getAllGhostInteractions(ghost_type_name);
          let filtered_array = all_interactions_for_ghost.filter(interaction => this.current_selected_interactions.includes(interaction));
          if (filtered_array.length == this.current_selected_interactions.length) possible_ghost_types.push([ghost_type_name, ghost_type_data]);
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
            string += ghost_type.charAt(0).toUpperCase() + ghost_type.slice(1);
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
        let uses_a = ["rusalka", "demon", "shade", "yurei", "mare", "chimera"];
        let uses_an = ["effigy", "oni"];
        return uses_a.includes(ghost_type) ? `a` : `an`; 
      },
      getAllOptionLists() {
        return [this.theme_list, this.sort_method_list, this.filtering_methods, this.interaction_marker_placements];
      },
      getOptionBools() {
        return [true, true, true, this.interaction_filtering_method.current == "Interaction Markers"];
      },
      forceRerender() {
        this.force_rerender = !this.force_rerender;
      },
      changeShowFoundTextOption() {
        this.should_show_found_text = !this.should_show_found_text;
        this.forceRerender();
      },
      changeShowProbableGhostTextOption() {
        this.should_show_probable_ghost_text = !this.should_show_probable_ghost_text;
        this.forceRerender();
      },
      getMostProbableGhostType() {
        let scores = {};
        let score_nos = {
          "common": 4,
          "uncommon": 3,
          "rare": 2,
          "e-rare": 1
        }
        let ghost_types = Object.keys(this.all_ghost_types);
        ghost_types.forEach(val => {
          scores[val] = 0;
        });
        let pairs = Object.entries(this.all_interaction_ghost_types).filter(val => this.current_selected_interactions.includes(val[0])).map(val => [val[0], Object.entries(val[1].ghost_types).map(val => [val[0], val[1].rarity])]);
        pairs.forEach(val => {
          val[1].forEach(val2 => {
            scores[val2[0]] += score_nos[val2[1]];
          })
        });
        let top_score = 0;
        let top_ghosts = new Array();
        let types = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        top_ghosts.push(types[0][0]);
        types.splice(0, 1);
        types.forEach(val => {
          if (val[1] > top_score) top_score = val[1];
          else if (val[1] == top_score) top_ghosts.push(val[0]);
        });
        return top_ghosts;
      },
      getMostProbableGhostTypeDisplay() {
        let string = "";
        if (this.getMostProbableGhostType().length <= 3) {
          string += `Based on your currently selected interactions and the rarities of them in correlation with the ghost types, the estimated ghost type${this.getMostProbableGhostType().length > 1 ? 's' : ''} ${this.getMostProbableGhostType().length > 1 ? 'are' : 'is'} `;
          for (const [idx, data] of this.getMostProbableGhostType().entries()) {
            const capitalised_ghost_name = data.charAt(0).toUpperCase() + data.slice(1);
            if (idx == 0) string += this.getSingularWordForGhost(data) + " ";
            else if (idx == this.getMostProbableGhostType().length - 1) string += " and "
            else string += ", ";
            string += capitalised_ghost_name;
          }
        } else {
          string += "There are currently more than 3 ghost types that are equally possible based on the algorithm. Select/find more interactions to show up to 3 of the most probable ghost types (estimated)"
        }
        string += ".";
        return string;
      }
    },
    computed: {
      getCurrentThemeData() {
        return this.theme_data[this.theme.current.toLowerCase()];
      },
      getSortingMethodData() {
        return {
          "alphabetical": {
            possible_ghost_types: this.getAllPossibleGhostTypes(),
            is_correct_sort_method: this.sort_method.current == 'Alphabetical',
            current_theme_data: this.getCurrentThemeData,
            show_found_text: this.should_show_found_text,
            interaction_marker_position: this.interaction_marker_position.current,
            interaction_filtering_method: this.interaction_filtering_method.current,
            interaction_name_search: this.interaction_name_search.current,
            ghosts_to_filter: this.ghosts_to_filter.current,
            all_ghost_types: Object.keys(this.all_ghost_types),
            interaction_data_categories:this.all_interaction_categories,
            interaction_data_ghost_types:this.all_interaction_ghost_types
          },
          "categorical": {
            possible_ghost_types: this.getAllPossibleGhostTypes(),
            is_correct_sort_method: this.sort_method.current == 'Categorical',
            current_theme_data: this.getCurrentThemeData,
            show_found_text: this.should_show_found_text,
            interaction_marker_position: this.interaction_marker_position.current,
            interaction_filtering_method: this.interaction_filtering_method.current,
            interaction_name_search: this.interaction_name_search.current,
            ghosts_to_filter: this.ghosts_to_filter.current,
            all_ghost_types: Object.keys(this.all_ghost_types),
            interaction_data_categories:this.all_interaction_categories,
            interaction_data_ghost_types:this.all_interaction_ghost_types
          }
        };
      },
      getAllOptionValues() {
        return [[this.theme, 'current'], [this.sort_method, 'current'], [this.interaction_filtering_method, 'current'], [this.interaction_marker_position, 'current']];
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
        <div v-if="should_show_probable_ghost_text">
          {{getMostProbableGhostTypeDisplay()}}
        </div>
      </div>
      <div v-if="tab.current=='Tracker'" style="display:inline-flex; flex-basis:100%; flex-direction:column; gap:5px;">
          <div class="can-be-clicked highlighted-lightgray-on-hover" @click="clearAllInteractions" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="{border: '3px solid ' + getCurrentThemeData.borderColor, color: getCurrentThemeData.textColor, backgroundColor: getCurrentThemeData.backgroundColor}">Clear All Interactions</div>
          <Ghost-Filter :allGhostTypes="Object.keys(all_ghost_types)" :themeData="getCurrentThemeData" v-model:filteredGhostList="ghosts_to_filter.current"></Ghost-Filter>
          <input class="search-box" style="text-align:center; max-width: 150px; border-radius:5px; margin:auto;" :style="{color: getCurrentThemeData.textColor, '--placeholder-color': getCurrentThemeData.textColor, border: '3px solid ' + getCurrentThemeData.borderColor, backgroundColor: getCurrentThemeData.backgroundColor}" v-model="interaction_name_search.current" placeholder="Interaction Name">
          <Alphabetical v-model:data="getSortingMethodData['alphabetical']" v-model:currentInteractions="current_selected_interactions" v-model:reRender="force_rerender" :key="[force_rerender, interaction_name_search.current]"></Alphabetical>
          <Categorical v-model:data="getSortingMethodData['categorical']" v-model:currentInteractions="current_selected_interactions" v-model:reRender="force_rerender" :key="[force_rerender, interaction_name_search.current]"></Categorical>
      </div>
      <div v-if="tab.current=='Settings'" style="display:flex; flex-wrap:wrap; flex-basis:100%; flex-direction:row; margin:auto; align-items:center; gap:10px;">
        <Basic-Setting-Dropdown v-for="(_, idx) in new Array(getAllOptionLists().length)" :optionList="getAllOptionLists()[idx]" :bool="getOptionBools()[idx]" :disabledOptionValue="setting_disabled_option_text_list[idx]" :settingMainText="setting_text_list[idx]" :currentThemeData="getCurrentThemeData" v-model:optionValue="getAllOptionValues[idx][0][getAllOptionValues[idx][1]]" v-model:reRender="force_rerender" :key="force_rerender+'setting'+idx"></Basic-Setting-Dropdown>
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="{color: this.getCurrentThemeData.textColor}">
          <div style="flex:1 0 100%;">
            <input class="can-be-clicked" type="checkbox" id="x1" :value="should_show_found_text" @input="changeShowFoundTextOption" v-model="should_show_found_text">
            <label class="can-be-clicked" for="x1">{{(should_show_found_text ? "Hide" : "Show") + " Interactions Upon Ghost Identification"}}</label>
          </div>
        </div>
        <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="{color: this.getCurrentThemeData.textColor}">
          <div style="flex:1 0 100%;">
            <input class="can-be-clicked" type="checkbox" id="x2" :value="should_show_found_text" @input="changeShowProbableGhostTextOption" v-model="should_show_probable_ghost_text">
            <label class="can-be-clicked" for="x2">{{(should_show_probable_ghost_text ? "Show" : "Hide") + " The Estimated Ghost Type/s"}}</label>
          </div>
        </div>
      </div>
      <div style="display:flex; flex-direction:row; margin:auto; flex-wrap:wrap; place-content:center; padding:10px; flex-basis:100%;" :style="{color: getCurrentThemeData.textColor}">
        <div class="can-be-clicked highlighted-lightgray-on-hover" v-for="tab_name in tab_list" @click="tab.current=tab_name" style="margin:3px; border-radius:10px; padding:3px;" :style="{border: '3px solid ' + getCurrentThemeData.borderColor, color: getCurrentThemeData.textColor, backgroundColor: getCurrentThemeData.backgroundColor}">{{tab_name}}</div>
      </div>
    </div>
    </div>
    `
});
app.component('Alphabetical', {
  props: ['data', 'currentInteractions', 'reRender'],
  emits: ['update:currentInteractions', 'update:reRender'],
  data() {
    return {
      ...this.data
    }
  },
  created() {
    this.getInteractionMarkerStrings();
    this.initialiseScopedStyling();
  },
  methods: {
    updateCurrentInteractions(value) {
      let copy_of_current_interactions = [...this.currentInteractions];
      if (copy_of_current_interactions.includes(value)) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(value), 1);
      else copy_of_current_interactions.push(value);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
      this.$emit('update:reRender', !this.reRender);
    },
    getGhostTypesForInteraction(inter_name) {
      let ghost_types_for_inter = Object.keys(this.interaction_data_ghost_types[inter_name].ghost_types);
      return ghost_types_for_inter.length != 0 ? ghost_types_for_inter : this.all_ghost_types;
    },
    getInteractionMarkerStrings() {
      let couples = {};
      Object.values(this.interaction_data_categories).flat().forEach(val => {
        couples[val] = (this.possible_ghost_types.length != 0 && this.all_possible_interactions.some(val2 => val2 == val && this.currentInteractions.length > 0)) && this.interaction_filtering_method == "Interaction Markers" ? '>!<' : '';
      });
      this.interaction_and_marker_couples = {};
      Object.entries(couples).forEach(val => {
        this.interaction_and_marker_couples[val[0]] = `${(this.interaction_marker_position == "Left" ? "<b>"+val[1]+"</b> " : "")}${val[0]}${(this.interaction_marker_position == "Right" ? " <b>"+val[1]+"</b>" : "")}`
      });
    },
    initialiseScopedStyling() {
      this.interaction_container_styling = {
        border: '2px solid ' + this.current_theme_data.borderColor, 
        color: this.current_theme_data.textColor, 
        backgroundColor: this.current_theme_data.backgroundColor
      };
      this.interaction_text_styling = {};
      Object.values(this.interaction_data_categories).flat().forEach(inter_name => (
        this.interaction_text_styling[inter_name] = {
          fontWeight: this.currentInteractions.includes(inter_name) ? 'bold' : 'normal'
        }
      ));
    }
  },
  computed: {
    notice_messages() {
      return [
        [
          this.possible_ghost_types.length == 1 && this.show_found_text,
          "You have discovered your ghost, therefore all of the interactions have been hidden. Good job!"
        ],
        [
          this.possible_ghost_types.length == 0 && this.interaction_filtering_method == 'Visibility',
          "You have switched to visibility mode when no results have been received. Please clear and try again!"
        ],
        [
          this.interaction_name_search.length != 0 && this.filtered_interaction_list.length == 0,
          "Your search matched 0 interactions. Please try again!"
        ]
      ];
    },
    current_notice_message() {
      return this.notice_messages
        .filter(notice_message_data => notice_message_data[0])
        .map(notice_message_data => notice_message_data[1])
        .filter((_, notice_message_no) => notice_message_no == 0)[0];
    },
    filtered_interaction_list() {
      return (Object.values(this.interaction_data_categories).flat().filter(val => this.interaction_filtering_method == "Visibility" ? this.all_possible_interactions.includes(val) || this.currentInteractions.length == 0 : true)).filter(val => val.toLowerCase().replace(/\s+/g, '').includes(this.interaction_name_search.toLowerCase().replace(/\s+/g, ''))).filter(val => this.ghosts_to_filter.length != 0 ? this.ghosts_to_filter.some(val3 => (!this.possible_ghost_types.includes(val3) ? this.getGhostTypesForInteraction(val).includes(val3) : true)) : true).sort();
    },
    all_possible_interactions() {
      return Object.entries(this.interaction_data_ghost_types).map(val => [val[0], Object.keys(val[1].ghost_types)])
      .filter(val => (val[1].length == 0 && this.possible_ghost_types.length != 0) || this.possible_ghost_types
        .some(val2 => val[1]
          .includes(val2[0].toLowerCase())
        )
      ).map(val => val[0]);
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:column wrap; flex: 1 1 auto; overflow:auto; max-width:100vw;" :style="{maxHeight: show_obsideo_banner ? '50vh' : '70vh'}">
    <div style="text-align:center; font-weight:bold; max-height:100%;" :style="{color:current_theme_data.textColor}">
      {{current_notice_message}}
    </div>
    <div v-if="!current_notice_message" style="display:flex; flex-flow:column wrap; max-height:100%;">
      <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in filtered_interaction_list" style="margin:2px; padding:2px;" :style="interaction_container_styling">
        <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
        <label class="can-be-clicked" :for="'interaction'+idx" :style="interaction_text_styling[interaction]" v-html="interaction_and_marker_couples[interaction]"></label>
      </div>
    </div>
  </div>
  `
});

app.component('Categorical', {
  props: ['data', 'currentInteractions', 'reRender'],
  emits: ['update:currentInteractions', 'update:reRender'],
  data() {
    return {
      ...this.data
    }
  },
  created() {
    this.getInteractionMarkerStrings();
    this.initialiseScopedStyling();
  },
  methods: {
    updateCurrentInteractions(value) {
      let copy_of_current_interactions = [...this.currentInteractions];
      if (copy_of_current_interactions.includes(value)) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(value), 1);
      else copy_of_current_interactions.push(value);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
      this.$emit('update:reRender', !this.reRender);
    },
    clearCategoryInteractions(category_no) {
      let checkboxes = document.getElementsByClassName("interaction-checkbox");
      let checked_checkboxes = Array.prototype.filter.call(checkboxes, val => val.checked && this.getGroupedInteractions()[category_no][1].includes(val.value));
      let copy_of_current_interactions = [...this.currentInteractions];
      for (let checkbox of checked_checkboxes) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(checkbox.value), 1);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
      this.$emit('update:reRender', !this.reRender);
    },
    getGhostTypesForInteraction(inter_name) {
      let ghost_types_for_inter = Object.keys(this.interaction_data_ghost_types[inter_name].ghost_types);
      return ghost_types_for_inter.length != 0 ? ghost_types_for_inter : this.all_ghost_types;
    },
    getAllPossibleInteractions() {
      console.log(Object.entries(this.interaction_data_ghost_types).map(val => [val[0], Object.keys(val[1].ghost_types)]).filter(val => val[1].length == 0 || this.possible_ghost_types.some(val2 => val[1].includes(val2[0]))).map(val => val[0]))
      return this.currentInteractions.length > 0 && this.possible_ghost_types.length >= 1 ? Object.entries(this.interaction_data_ghost_types).map(val => [val[0], Object.keys(val[1].ghost_types)]).filter(val => val[1].length == 0 || this.possible_ghost_types.some(val2 => val[1].includes(val2[0]))).map(val => val[0]) : new Array();
    },
    getGroupedInteractions() {
      let final_category_inputs = new Array();
      for (let category in this.interaction_data_categories) {
        final_category_inputs.push([category, this.interaction_data_categories[category].filter(val => this.interaction_filtering_method == "Visibility" ? this.all_possible_interactions.includes(val) : true).filter(val => this.filtered_interaction_list.includes(val)).sort()]);
      }
      return final_category_inputs.filter(val => val[1].length > 0);
    },
    initialiseScopedStyling() {
      this.interaction_container_styling = {
        border: '2px solid ' + this.current_theme_data.borderColor, 
        color: this.current_theme_data.textColor, 
        backgroundColor: this.current_theme_data.backgroundColor
      };
      this.interaction_text_styling = {};
      Object.values(this.interaction_data_categories).flat().forEach(inter_name => (
        this.interaction_text_styling[inter_name] = {
          fontWeight: this.currentInteractions.includes(inter_name) ? 'bold' : 'normal'
        }
      ));
      this.clear_button_styling = {
        border: '3px solid ' + this.data.current_theme_data.borderColor, 
        color: this.data.current_theme_data.textColor, 
        backgroundColor: this.data.current_theme_data.backgroundColor
      };
      this.category_name_styling = {
        color: this.data.current_theme_data.textColor
      };
    },
    getInteractionMarkerStrings() {
      let couples = {};
      Object.values(this.interaction_data_categories).flat().forEach(val => {
        couples[val] = (this.possible_ghost_types.length != 0 && this.all_possible_interactions.some(val2 => val2 == val && this.currentInteractions.length > 0)) && this.interaction_filtering_method == "Interaction Markers" ? '>!<' : '';
      });
      this.interaction_and_marker_couples = {};
      Object.entries(couples).forEach(val => {
        this.interaction_and_marker_couples[val[0]] = `${(this.interaction_marker_position == "Left" ? "<b>"+val[1]+"</b> " : "")}${val[0]}${(this.interaction_marker_position == "Right" ? " <b>"+val[1]+"</b>" : "")}`
      });
    }
  },
  computed: {
    notice_messages() {
      return [
        [
          this.possible_ghost_types.length == 1 && this.show_found_text,
          "You have discovered your ghost, therefore all of the interactions have been hidden. Good job!"
        ],
        [
          this.possible_ghost_types.length == 0 && this.interaction_filtering_method == 'Visibility',
          "You have switched to visibility mode when no results have been received. Please clear and try again!"
        ],
        [
          this.interaction_name_search.length != 0 && this.filtered_interaction_list.length == 0,
          "Your search matched 0 interactions. Please try again!"
        ]
      ];
    },
    current_notice_message() {
      return this.notice_messages
        .filter(notice_message_data => notice_message_data[0])
        .map(notice_message_data => notice_message_data[1])
        .filter((_, notice_message_no) => notice_message_no == 0)[0];
    },
    all_possible_interactions() {
      return this.possible_ghost_types.length >= 1 ? Object.entries(this.interaction_data_ghost_types).map(val => [val[0], Object.keys(val[1].ghost_types)]).filter(val => val[1].length == 0 || this.possible_ghost_types.some(val2 => val[1].includes(val2[0]))).map(val => val[0]) : new Array();
    },
    filtered_interaction_list() {
      return (Object.values(this.interaction_data_categories).flat().filter(val => this.interaction_filtering_method == "Visibility" ? this.all_possible_interactions.includes(val) || this.currentInteractions.length == 0 : true)).filter(val => val.toLowerCase().replace(/\s+/g, '').includes(this.interaction_name_search.toLowerCase().replace(/\s+/g, ''))).filter(val => this.ghosts_to_filter.length != 0 ? this.ghosts_to_filter.some(val3 => (!this.possible_ghost_types.includes(val3) ? this.getGhostTypesForInteraction(val).includes(val3) : true)) : true).sort();
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:row wrap; overflow:auto; max-width:100vw; justify-content:center;" :style="{maxHeight: show_obsideo_banner ? '50vh' : '70vh'}">
    <div style="text-align:center; font-weight:bold; max-height:100%;" :style="{color:current_theme_data.textColor}">
      {{current_notice_message}}
    </div>
    <div v-if="!current_notice_message" style="display:flex; flex-flow:row wrap; overflow:auto; justify-content:center; max-height:100%;">
      <div v-for="(interactions, idx2) in getGroupedInteractions()" style="max-height:100%; flex: 1 1 auto; display:flex; flex-direction:column;">
        <div style="flex: 0; text-align:center; font-weight:bold;" :style="category_name_styling">{{interactions[0]}}</div>
        <div class="can-be-clicked" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="clear_button_styling" @click="clearCategoryInteractions(idx2)">Clear Category</div>
        <div style="display:inline-flex; flex-flow:column; flex: 1 1 auto; overflow:auto; max-height:100%;">
          <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in interactions[1].sort()" style="margin:2px; padding:2px;" :style="interaction_container_styling">
            <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx+idx2" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
            <label class="can-be-clicked" :for="'interaction'+idx+idx2" :style="interaction_text_styling[interaction]" v-html="interaction_and_marker_couples[interaction]"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
});

app.component('Basic-Setting-Dropdown', {
  props: ['disabledOptionValue', 'optionList', 'settingMainText', 'currentThemeData', 'optionValue', 'bool', 'reRender'],
  emits: ['update:optionValue', 'update:reRender'],
  data() {
    return {
      main_styling: {
        color: this.currentThemeData.textColor
      }
    }
  },
  methods: {
    changeOptionValue(value) {
      this.$emit('update:optionValue', value);
      this.$emit('update:reRender', !this.reRender);
    }
  },
  template: `
  <div v-if="bool" style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="main_styling">
    {{settingMainText}}:
    <select :value="optionValue" @input="changeOptionValue($event.target.value)">
      <option disabled value="">{{disabledOptionValue}}</option>
      <option v-for="option in optionList">{{option}}</option>
    </select>
  </div>
  `
});

app.component('Ghost-Filter', {
  props: ['allGhostTypes', 'filteredGhostList', 'themeData'],
  emits: ['update:filteredGhostList'],
  data() {
    return {

    }
  },
  methods: {
    updateFilteredGhosts(ghost_name) {
      if (this.filteredGhostList.includes(ghost_name)) this.filteredGhostList.splice(this.filteredGhostList.indexOf(ghost_name), 1);
      else this.filteredGhostList.push(ghost_name);
    }
  },
  computed: {},
  template: `
    <div style="display:flex; width:100%; flex-flow:row wrap;">
      <div class="can-be-clicked" v-for="ghost_type in allGhostTypes" style="flex:1 1; min-width:100px; text-align:center; place-content:center; border:2px solid black; margin:2px;" @click="updateFilteredGhosts(ghost_type)" :style="{border: '3px solid ' + themeData.borderColor, color: themeData.textColor, backgroundColor: filteredGhostList.includes(ghost_type) ? themeData.toggledColor : themeData.backgroundColor}">
        {{ghost_type.charAt(0).toUpperCase() + ghost_type.slice(1)}}
      </div>
    </div>
  `
});
app.component('Alphabetical', {
  props: ['data', 'currentInteractions', 'reRender'],
  emits: ['update:currentInteractions', 'update:reRender'],
  data() {
    return {
      interaction_container_styling: {
        border: '2px solid ' + this.data.current_theme_data.borderColor, 
        color: this.data.current_theme_data.textColor, 
        backgroundColor: this.data.current_theme_data.backgroundColor
      },
      unsorted_interaction_names: this.data.interaction_data.map(val => val[1]),
      sorted_interaction_names: this.data.interaction_data.map(val => val[1]).sort(),
      interaction_text_styling: this.data.interaction_data.map(val => ({fontWeight: this.currentInteractions.includes(val[1]) ? 'bold' : 'normal'})),
      all_possible_interactions: this.getAllPossibleInteractions()
    }
  },
  created() {
    this.interaction_marker_list = this.data.interaction_filtering_method == "Interaction Markers" ? this.sorted_interaction_names.map(val => this.data.possible_ghost_types.length != 0 && this.all_possible_interactions.some(val2 => val2[1] == val && this.currentInteractions.length > 0) ? '>!<' : '') : new Array(this.sorted_interaction_names.length).fill(''); 
    //this.sorted_interaction_names.map(val => '');
  
    let couples = this.sorted_interaction_names.map((val, idx) => [val, this.interaction_marker_list[idx]]);
    this.interaction_and_marker_couples = couples.map(val => `${(this.data.interaction_marker_position == "Left" ? "<b>"+val[1]+"</b> " : "")}${val[0]}${(this.data.interaction_marker_position == "Right" ? " <b>"+val[1]+"</b>" : "")}`);
  },
  methods: {
    updateCurrentInteractions(value) {
      let copy_of_current_interactions = [...this.currentInteractions];
      if (copy_of_current_interactions.includes(value)) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(value), 1);
      else copy_of_current_interactions.push(value);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
      this.$emit('update:reRender', !this.reRender);
    },
    getAllPossibleInteractions() { 
      return this.data.interaction_data.filter(val => (val[0].length == 0 && this.data.possible_ghost_types.length != 0) || this.data.possible_ghost_types.some(val2 => val[0].includes(val2[0].toLowerCase())));
    },
    getFilteredInteractionList() {
      return (this.data.interaction_filtering_method == "Visibility" ? this.data.interaction_data.filter(val => this.all_possible_interactions.map(val => val[1]).includes(val[1]) || this.currentInteractions.length == 0).map(val => val[1]) : this.sorted_interaction_names).filter(val => val.toLowerCase().replace(/ /g, '').includes(this.data.interaction_name_search.toLowerCase().replace(/ /g, ''))); //&& (this.data.interaction_filtering_method == "Visibility" ? true : val[0].length == 0)
      // return this.currentInteractions == 0 || this.possible_ghost_types.length < 2 ? this.sorted_interaction_names : this.sorted_interaction_names.filter(val => this.all_possible_interactions.includes(val) || this.currentInteractions.length == 0);
    },
    getEndInteractionList() {
      return this.getFilteredInteractionList().sort();
      //return this.data.interaction_filtering_method == "Visibility" ? this.getFilteredInteractionList().sort() : this.sorted_interaction_names;
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:column wrap; flex: 1 1 auto; max-height:80vh; overflow:auto; max-width:100vw;">
    <div v-if="data.possible_ghost_types.length == 1 && data.show_found_text" style="text-align:center;" :style="{color: data.current_theme_data.textColor}">
      <b>You have discovered your ghost, therefore all of the interactions have been hidden. Good job!</b>
    </div>
    <div v-else-if="data.possible_ghost_types.length == 0 && data.interaction_filtering_method == 'Visibility'" style="text-align:center;" :style="{color: data.current_theme_data.textColor}">
      <b>You have switched to visibility mode when no results have been received. Please clear and try again!</b>
    </div>
    <div v-else class="highlighted-gray-on-hover" v-for="(interaction, idx) in getEndInteractionList()" style="margin:2px; padding:2px; flex: 0 0 2%;" :style="interaction_container_styling">
      <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
      <label class="can-be-clicked" :for="'interaction'+idx" :style="interaction_text_styling[unsorted_interaction_names.indexOf(interaction)]" v-html="interaction_and_marker_couples[sorted_interaction_names.indexOf(interaction)]"></label>
    </div>
  </div>
  `
}); //getFilteredInteractionList().length == 0

app.component('Categorical', {
  props: ['data', 'currentInteractions', 'reRender'],
  emits: ['update:currentInteractions', 'update:reRender'],
  data() {
    return {
      interaction_container_styling: {
        border: '2px solid ' + this.data.current_theme_data.borderColor, 
        color: this.data.current_theme_data.textColor, 
        backgroundColor: this.data.current_theme_data.backgroundColor
      },
      category_name_styling: {
        color: this.data.current_theme_data.textColor
      },
      clear_button_styling: {
        border: '3px solid ' + this.data.current_theme_data.borderColor, 
        color: this.data.current_theme_data.textColor, 
        backgroundColor: this.data.current_theme_data.backgroundColor
      },
      unsorted_interaction_names: this.data.interaction_data.map(val => val[1]),
      sorted_interaction_names: this.data.interaction_data.map(val => val[1]).sort(),
      interaction_text_styling: this.data.interaction_data.map(val => ({fontWeight: this.currentInteractions.includes(val[1]) ? 'bold' : 'normal'})),
      all_possible_interactions: this.getAllPossibleInteractions()
    }
  },
  created() {
    this.interaction_marker_list = this.data.interaction_data.map(val => [val[1], this.data.interaction_filtering_method == "Interaction Markers" ? (this.data.possible_ghost_types.length != 0 && this.all_possible_interactions.includes(val[1]) ? '>!<' : '') : '']).map(val => `${(this.data.interaction_marker_position == "Left" ? "<b>"+val[1] + "</b> " : "")}${val[0]}${(this.data.interaction_marker_position == "Right" ? " <b>" + val[1]+"</b>" : "")}`);
    //this.data.interaction_filtering_method == "Interaction Markers" && this.all_possible_interactions.includes(val[1]) && this.data.show_interaction_markers ? '>!<' : ''
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
    getAllPossibleInteractions() {
      //let x = this.data.interaction_filtering_method == "Visibility" ? true : this.currentInteractions.length > 0 && this.data.possible_ghost_types.length != 1;
      return this.currentInteractions.length > 0 && this.data.possible_ghost_types.length > 1 ? this.data.interaction_data.filter(val => val[0].length == 0 || this.data.possible_ghost_types.some(val2 => val[0].includes(val2[0].toLowerCase()))).map(val => val[1]) : new Array();
    },
    getGroupedInteractions() {
      let unique_categories = new Array();
      let final_category_inputs = new Array();
      for (let category of this.data.interaction_data.map(val => val[2])) {
        if (unique_categories.includes(category)) continue;
        unique_categories.push(category);
      }
      for (let category of unique_categories) {
        final_category_inputs.push([category, this.data.interaction_data.filter(val => val[2] == category).map(val => val[1]).filter(val => this.data.interaction_filtering_method == "Visibility" ? this.all_possible_interactions.includes(val) || this.currentInteractions.length == 0 : true).filter(val => val.toLowerCase().replace(/ /g, '').includes(this.data.interaction_name_search.toLowerCase().replace(/ /g, '')))]);
        //.filter(val => val.toLowerCase().replace(/ /g, '').includes(this.data.interaction_name_search.toLowerCase().replace(/ /g, '')))
        //(this.data.possible_ghost_types.length > 1 && !this.data.show_found_text) && (this.data.possible_ghost_types.length == 0 || this.data.show_found_text)
      }
      return final_category_inputs.filter(val => val[1].length > 0);
    },
    getFilteredInteractionList() {
      return this.sorted_interaction_names.filter(val => this.all_possible_interactions.includes(val) || this.currentInteractions == 0);
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:row wrap; overflow:auto; max-height:80vh; max-width:100vw; justify-content:center;">
    <div v-if="data.possible_ghost_types.length == 1 && data.show_found_text" style="text-align:center;" :style="{color: data.current_theme_data.textColor}">
      <b>You have discovered your ghost, therefore all of the interactions have been hidden. Good job!</b>
    </div>
    <div v-else-if="data.possible_ghost_types.length == 0 && data.interaction_filtering_method == 'Visibility'" style="text-align:center;" :style="{color: data.current_theme_data.textColor}">
      <b>You have switched to visibility mode when no results have been received. Please clear and try again!</b>
    </div>
    <div v-else style="display:flex; flex-flow:row wrap; overflow:auto; justify-content:center; max-height:100%;">
      <div v-for="(interactions, idx2) in getGroupedInteractions()" style="max-height:100%; flex: 1 1 auto; display:flex; flex-direction:column;">
        <div style="flex: 0; text-align:center; font-weight:bold;" :style="category_name_styling">{{interactions[0]}}</div>
        <div class="can-be-clicked" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="clear_button_styling" @click="clearCategoryInteractions(idx2)">Clear Category</div>
        <div style="display:inline-flex; flex-flow:column; flex: 1 1 auto; overflow:auto; max-height:100%;">
          <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in interactions[1].sort()" style="margin:2px; padding:2px;" :style="interaction_container_styling">
            <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx+idx2" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
            <label class="can-be-clicked" :for="'interaction'+idx+idx2" :style="interaction_text_styling[unsorted_interaction_names.indexOf(interaction)]" v-html="interaction_marker_list[unsorted_interaction_names.indexOf(interaction)]"></label>
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
}); //changeOptionValue($event.target.value)
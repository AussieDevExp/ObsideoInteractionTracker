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
      interaction_text_styling: this.data.interaction_data.map(val => ({fontWeight: this.currentInteractions.includes(val[1]) ? 'bold' : 'normal'})),
      all_possible_interactions: this.getAllPossibleInteractions()
    }
  },
  created() {
    this.interaction_marker_list = this.data.interaction_data.map(val => this.all_possible_interactions.includes(val[1]) && this.data.show_interaction_markers ? '<!>' : '');
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
      return this.currentInteractions.length > 0 && this.data.possible_ghost_types.length > 1 ? this.data.interaction_data.filter(val => this.data.possible_ghost_types.some(val2 => val[0].includes(val2[0].toLowerCase()))).map(val => val[1]) : new Array();
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:column wrap; flex: 1 1 auto; max-height:80vh; overflow:auto; max-width:100vw;">
    <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in data.interaction_data.map(val => val[1]).sort()" style="margin:2px; padding:2px; flex: 0 1 2%;" :style="interaction_container_styling">
      <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
      <label class="can-be-clicked" :for="'interaction'+idx" :style="interaction_text_styling[data.interaction_data.map(val => val[1]).indexOf(interaction)]">{{interaction}} <span style="font-weight:bold;">{{interaction_marker_list[data.interaction_data.map(val => val[1]).indexOf(interaction)]}}</span></label>
    </div>
  </div>
  `
});

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
      interaction_text_styling: this.data.interaction_data.map(val => ({fontWeight: this.currentInteractions.includes(val[1]) ? 'bold' : 'normal'})),
      all_possible_interactions: this.getAllPossibleInteractions()
    }
  },
  created() {
    this.interaction_marker_list = this.data.interaction_data.map(val => this.all_possible_interactions.includes(val[1]) && this.data.show_interaction_markers ? '<!>' : '');
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
      return this.currentInteractions.length > 0 && this.data.possible_ghost_types.length > 1 ? this.data.interaction_data.filter(val => this.data.possible_ghost_types.some(val2 => val[0].includes(val2[0].toLowerCase()))).map(val => val[1]) : new Array();
    },
    getGroupedInteractions() {
      let unique_categories = new Array();
      let final_category_inputs = new Array();
      for (let category of this.data.interaction_data.map(val => val[2])) {
        if (unique_categories.includes(category)) continue;
        unique_categories.push(category);
      }
      for (let category of unique_categories) {
        final_category_inputs.push([category, this.data.interaction_data.filter(val => val[2] == category).map(val => val[1])]);
      }
      return final_category_inputs;
    }
  },
  template: `
  <div v-if="data.is_correct_sort_method" style="display:flex; flex-flow:row wrap; overflow:auto; max-height:80vh; max-width:100vw;">
    <div v-for="(interactions, idx2) in getGroupedInteractions()" style="max-height:50%; flex: 1 1 auto; display:flex; flex-direction:column;">
      <div style="flex: 0; text-align:center; font-weight:bold;" :style="category_name_styling">{{interactions[0]}}</div>
      <div class="can-be-clicked" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="clear_button_styling" @click="clearCategoryInteractions(idx2)">Clear Category</div>
      <div style="display:inline-flex; flex-flow:column; flex: 1 1 auto; overflow:auto; max-height:100%;">
        <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in interactions[1].sort()" style="margin:2px; padding:2px;" :style="interaction_container_styling">
          <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx+idx2" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
          <label class="can-be-clicked" :for="'interaction'+idx+idx2" :style="interaction_text_styling[data.interaction_data.map(val => val[1]).indexOf(interaction)]">{{interaction}} <span style="font-weight:bold;">{{interaction_marker_list[data.interaction_data.map(val => val[1]).indexOf(interaction)]}}</span></label>
        </div>
      </div>
    </div>
  </div>
  `
});

app.component('Basic-Setting-Dropdown', {
  props: ['disabledOptionValue', 'optionList', 'settingMainText', 'currentThemeData', 'optionValue'],
  emits: ['update:optionValue'],
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
    }
  },
  template: `
  <div style="display:flex; margin:auto; flex-wrap:wrap; place-content:center; text-align:center; gap:3px; flex:0 1 100%;" :style="main_styling">
    {{settingMainText}}:
    <select :value="optionValue" @input="changeOptionValue($event.target.value)">
      <option disabled value="">{{disabledOptionValue}}</option>
      <option v-for="option in optionList">{{option}}</option>
    </select>
  </div>
  `
});
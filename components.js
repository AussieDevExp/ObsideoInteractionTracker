app.component('Alphabetical', {
  props: ['isCorrectSortMethod', 'binded_styles', 'currentTheme', 'allInteractionData', 'currentInteractions'],
  emits: ['update:currentInteractions'],
  data() {
    return {
      interaction_container_styling: {
        border: '2px solid ' + (this.currentTheme == 'Light' ? 'black' : 'white'), 
        color: this.currentTheme == 'Light' ? 'black' : 'white', 
        backgroundColor: this.currentTheme == 'Light' ? 'white' : 'black'
      }
    }
  },
  methods: {
    updateCurrentInteractions(value) {
      let copy_of_current_interactions = [...this.currentInteractions];
      if (copy_of_current_interactions.includes(value)) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(value), 1);
      else copy_of_current_interactions.push(value);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
    },
    getInteractionTextStyling(interaction_name) {
      return {
        fontWeight: this.currentInteractions.includes(interaction_name) ? 'bold' : 'normal'
      }
    }
  },
  template: `
  <div v-if="isCorrectSortMethod" style="display:flex; flex-flow:column wrap; flex: 1 1 auto; max-height:80vh; overflow:auto; max-width:100vw;">
    <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in allInteractionData.map(val => val[1]).sort()" style="margin:2px; padding:2px; flex: 0 1 2%;" :style="interaction_container_styling">
      <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
      <label class="can-be-clicked" :for="'interaction'+idx" :style="getInteractionTextStyling(interaction)">{{interaction}}</label>
    </div>
  </div>
  `
});

app.component('Categorical', {
  props: ['isCorrectSortMethod', 'categoryData', 'currentInteractions', 'currentTheme'],
  emits: ['update:currentInteractions'],
  data() {
    return {
      interaction_container_styling: {
        border: '2px solid ' + (this.currentTheme == 'Light' ? 'black' : 'white'), 
        color: this.currentTheme == 'Light' ? 'black' : 'white', 
        backgroundColor: this.currentTheme == 'Light' ? 'white' : 'black'
      },
      category_name_styling: {
        color: this.currentTheme == 'Light' ? 'black' : 'white'
      },
      clear_button_styling: {
        border: '3px solid ' + (this.currentTheme == 'Light' ? 'black' : 'white'), 
        color: this.currentTheme == 'Light' ? 'black' : 'white', 
        backgroundColor: this.currentTheme == 'Light' ? 'white' : 'black'
      }
    }
  },
  methods: {
    updateCurrentInteractions(value) {
      let copy_of_current_interactions = [...this.currentInteractions];
      if (copy_of_current_interactions.includes(value)) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(value), 1);
      else copy_of_current_interactions.push(value);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
    },
    clearCategoryInteractions(category_no) {
      let checkboxes = document.getElementsByClassName("interaction-checkbox");
      let checked_checkboxes = Array.prototype.filter.call(checkboxes, val => val.checked && this.categoryData[category_no][1].includes(val.value));
      let copy_of_current_interactions = [...this.currentInteractions];
      for (let checkbox of checked_checkboxes) copy_of_current_interactions.splice(copy_of_current_interactions.indexOf(checkbox.value), 1);
      this.$emit('update:currentInteractions', copy_of_current_interactions);
    },
    getInteractionTextStyling(interaction_name) {
      return {
        fontWeight: this.currentInteractions.includes(interaction_name) ? 'bold' : 'normal'
      }
    }
  },
  template: `
  <div v-if="isCorrectSortMethod" style="display:flex; flex-flow:row wrap; overflow:auto; max-height:80vh; max-width:100vw;">
    <div v-for="(interactions, idx2) in categoryData" style="max-height:50%; flex: 1 1 auto; display:flex; flex-direction:column;">
      <div style="flex: 0; text-align:center; font-weight:bold;" :style="category_name_styling">{{interactions[0]}}</div>
      <div class="can-be-clicked" style="display:inline-block; border:3px solid black; padding:2px; border-radius:10px; text-align:center; margin:auto;" :style="clear_button_styling" @click="clearCategoryInteractions(idx2)">Clear Category</div>
      <div style="display:inline-flex; flex-flow:column; flex: 1 1 auto; overflow:auto; max-height:100%;">
        <div class="highlighted-gray-on-hover" v-for="(interaction, idx) in interactions[1].sort()" style="margin:2px; padding:2px;" :style="interaction_container_styling">
          <input class="interaction-checkbox can-be-clicked" type="checkbox" :id="'interaction'+idx+idx2" :value="interaction" :checked="currentInteractions.includes(interaction)" @input="updateCurrentInteractions($event.target.value)">
          <label class="can-be-clicked" :for="'interaction'+idx+idx2" :style="getInteractionTextStyling(interaction)">{{interaction}}</label>
        </div>
      </div>
    </div>
  </div>
  `
});

app.component('Basic-Setting-Dropdown', {
  props: ['disabledOptionValue', 'optionList', 'settingMainText', 'currentTheme', 'optionValue'],
  emits: ['update:optionValue'],
  data() {
    return {
      main_styling: {
        color: this.currentTheme == 'Light' ? 'black' : 'white'
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
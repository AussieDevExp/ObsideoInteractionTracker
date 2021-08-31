const app = Vue.createApp({
    data: function() {
      return {
        all_ghost_types: {
          "effigy": [],
          "rusalka": [],
          "demon": [],
          "shade": [],
          "oni": [],
          "yurei": [],
          "mare": [],
          "chimera" []:
        },
        current_selected_interactions: new Array()
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
          let count = 0;
          let all_interactions_for_ghost = this.getAllGhostInteractions(ghost_type)
          let filtered_array = all_interactions_for_ghost.filter(interaction => this.current_selected_interactions.includes(interaction))
          for (const i of all_interactions_for_ghost) {
            if (this.current_selected_interactions.includes(i)) count++;
          }
          if (count == this.current_selected_interactions.length) possible_ghost_types.push(ghost_type); 
        }
        return possible_ghost_types;
      },
      getPossibleGhostTypeDisplay() {
        let string = "";
        for (const [idx, ghost_type] of this.getAllPossibleGhostTypes().entries()) {
          string += ghost_type;
          if (idx < this.getAllPossibleGhostTypes().length - 2) string += ", ";
          else if (idx == this.getAllPossibleGhostTypes().length - 2) string += " and ";
          else string += ".";
        }
        return string;
      }
    },
    template: `
    <div id="app-container">
      <div v-for="(interaction, idx) in all_interactions">
        <input type="checkbox" :id="'interaction'+idx" :value="interaction[1]" v-model="current_selected_interactions">
        <label for="'interaction'+idx">{{interaction[1]}}</label>
      </div>
      <br>
      <div>
        Possible Ghost Type/s: <span>{{getPossibleGhostTypeDisplay()}}</span>
      <div>
    </div>
    `
});
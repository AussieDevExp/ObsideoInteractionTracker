const app = Vue.createApp({
    data: function() {
      return {
        all_ghost_types: ["Effigy", "Rusalka", "Demon", "Shade", "Oni", "Yurei", "Mare", "Chimera"],
        all_interactions: [
          "Flick Light Switches",
          "Turn Radios On/Off",
          "Turn Alarms On/Off",
          "Knock Books Off Bookshelf",
          "Blow Out Candle",
          "Turn Breaker On/Off"
        ],
        current_selected_interactions: new Array()
        /*ghost_types: {
          effigy: {},
          shade: {},
          demon: {},
          
        }*/
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
        if (["effigy", "demon", "oni", "yurei", "chimera"].includes(ghost_type.toLowerCase())) interaction_list.push("Flick Light Switches");
        if (["effigy", "rusalka", "demon", "shade", "oni"].includes(ghost_type.toLowerCase())) interaction_list.push("Turn Radios On/Off"); 
        interaction_list.push("Turn Alarms On/Off");
        if (["effigy", "rusalka", "demon", "shade", "oni", "yurei", "mare"].includes(ghost_type.toLowerCase())) interaction_list.push("Knock Books Off Bookshelf");
        if (["effigy", "rusalka", "shade", "oni", "yurei", "mare"].includes(ghost_type.toLowerCase())) interaction_list.push("Blow Out Candle");
        if (["effigy", "rusalka", "demon", "chimera"].includes(ghost_type.toLowerCase())) interaction_list.push("Turn Breaker On/Off");
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
        <input type="checkbox" :id="'interaction'+idx" :value="interaction" v-model="current_selected_interactions">
        <label for="'interaction'+idx">{{interaction}}</label>
      </div>
      Possible Ghost Type/s: <span>{{getPossibleGhostTypeDisplay()}}</span>
    </div>
    `
});

//Current Ghost Type: <span>{{getAllPossibleGhostTypes()}}</span>
//Possible Ghost Type/s: <span v-for="(ghost_type, idx) in getAllPossibleGhostTypes()">{{ghost_type + (idx != getAllPossibleGhostTypes().length - 1 ? ', ' : '.')}}</span>
//if (ghost_type.toLowerCase() == "effigy" || ghost_type.toLowerCase() == "demon" || ghost_type.toLowerCase() == "oni" || ghost_type.toLowerCase() == "yurei" || ghost_type.toLowerCase() == "chimera")
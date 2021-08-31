const app = Vue.createApp({
    data: function() {
      return {
        all_ghost_types: ["Effigy", "Rusalka", "Demon", "Shade", "Oni", "Yurei", "Mare", "Chimera"],
        all_interactions: [
          [["effigy", "demon", "oni", "yurei", "chimera"], "Flick Light Switches"],
          [["effigy", "rusalka", "demon", "shade", "oni"], "Turn Radios On/Off"],
          [[], "Turn Alarms On/Off"],
          [["effigy", "rusalka", "demon", "shade", "oni", "yurei", "mare"], "Knock Books Off Bookshelf"],
          [["effigy", "rusalka", "shade", "oni", "yurei", "mare"], "Blow Out Candle"],
          [["effigy", "rusalka", "demon", "chimera"], "Turn Breaker On/Off"]
        ],
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
        /*if (["effigy", "demon", "oni", "yurei", "chimera"].includes(ghost_type.toLowerCase())) interaction_list.push("Flick Light Switches");
        if (["effigy", "rusalka", "demon", "shade", "oni"].includes(ghost_type.toLowerCase())) interaction_list.push("Turn Radios On/Off"); 
        interaction_list.push("Turn Alarms On/Off");
        if (["effigy", "rusalka", "demon", "shade", "oni", "yurei", "mare"].includes(ghost_type.toLowerCase())) interaction_list.push("Knock Books Off Bookshelf");
        if (["effigy", "rusalka", "shade", "oni", "yurei", "mare"].includes(ghost_type.toLowerCase())) interaction_list.push("Blow Out Candle");
        if (["effigy", "rusalka", "demon", "chimera"].includes(ghost_type.toLowerCase())) interaction_list.push("Turn Breaker On/Off");*/
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
      Possible Ghost Type/s: <span>{{getPossibleGhostTypeDisplay()}}</span>
    </div>
    `
});
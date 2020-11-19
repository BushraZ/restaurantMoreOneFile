/** x-restaurant component */
Vue.component("x-restaurant", {
  template: "#x-restaurant",
  props: {
    tables: { default: [] }
  },
  data() {
    return {
      numOfPeople: "",
      duration: "",
      fussMessage: ""
    };
  },
  // TODO:
  // mounted() {
  //   if (localStorage.getItem("tables"))
  //     this.tables = JSON.parse(localStorage.getItem("tables"));
  // },
  // watch: {
  //   tables: {
  //     handler() {
  //       localStorage.setItem("tables", JSON.stringify(this.tables));
  //     },
  //     deep: true
  //   }
  // },
  methods: {}
});

/** x-table component  */
Vue.component("x-table", {
  template: "#x-table",
  props: ["element"],
  data() {
    return {
      timeLeft: "00:00",
      endTime: "0"
    };
  },
  computed: {
    start() {
      this.setTime();
    }
  },
  methods: {
    setTime() {
      this.timer(this.element.duration);
    },
    timer(seconds) {
      const now = Date.now();
      const end = now + seconds * 1000;
      this.displayTimeLeft(seconds);
      this.displayEndTime(end);
      this.countdown(end);
    },
    countdown(end) {
      intervalTimer = setInterval(() => {
        const secondsLeft = Math.round((end - Date.now()) / 1000);

        if (secondsLeft === 0) {
          this.endTime = 0;
        }

        if (secondsLeft < 0) {
          clearInterval(intervalTimer);
          if (this.timeLeft === `00:00`) this.reAvailableTable();
          return;
        }
        this.displayTimeLeft(secondsLeft);
      }, 1000);
    },
    displayTimeLeft(secondsLeft) {
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      this.timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
    },
    displayEndTime(timestamp) {
      const end = new Date(timestamp);
      const hour = end.getHours();
      const minutes = end.getMinutes();

      this.endTime = `${hourConvert(hour)}:${zeroPadded(minutes)}`;
    },
    reAvailableTable() {
      this.element.status = 1;
      alert(this.element.fussMessage);
      this.$emit("complete", this.element.id);
    }
  }
});

Vue.component("alert", {
  props: ["message", "show"],
  template: "#alert"
});

function zeroPadded(num) {
  // 4 --> 04
  return num < 10 ? `0${num}` : num;
}

function hourConvert(hour) {
  // 15 --> 3
  return hour % 12 || 12;
}

/** app component  */
new Vue({
  el: "#app",
  data: {
    tables: [
      {
        id: 1,
        capacity: 10,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 2,
        capacity: 8,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 3,
        capacity: 10,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 4,
        capacity: 6,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 5,
        capacity: 2,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 6,
        capacity: 6,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 7,
        capacity: 4,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      },
      {
        id: 8,
        capacity: 12,
        occupied: 0,
        status: 1,
        duration: "00:00",
        fussMessage: ""
      }
    ],
    availableTables: [10, 8, 10, 6, 2, 6, 4, 12],
    numOfPeople: "",
    duration: "",
    fussMessage: ""
  },
  methods: {
    addNewParty() {
      // numOfPeople, duration, fussMessage

      const tempAvailable = this.handleAvailableTables(this.numOfPeople);
      const targetIndex = this.min(tempAvailable, this.numOfPeople);
      //   this.duration = this.convert(this.duration);
      if (targetIndex !== -1) {
        this.tables[targetIndex].status = 0;
        this.tables[targetIndex].duration = this.duration;
        this.tables[targetIndex].occupied = this.numOfPeople;
        this.tables[targetIndex].fussMessage = this.fussMessage;
        this.availableTables[targetIndex] = 0;

        /** TODO: should emit event for countdown target index(target table) */
      }
      /** TODO: else if not found any target (targetIndex=-1) should be await until found target */

      this.resetForm();
    },
    handleAvailableTables(size) {
      let temp = [];
      for (let i = 0; i < this.availableTables.length; i++) {
        if (size <= this.availableTables[i]) temp.push(this.availableTables[i]);
        else temp.push(0);
      }
      return temp;
    },
    min(list, num) {
      let minVal = 12;

      list.map(val => {
        if (val <= minVal && val >= num) {
          minVal = val;
        }
      });

      return list.indexOf(minVal);
    },
    resetForm() {
      this.numOfPeople = "";
      this.duration = "";
      this.fussMessage = "";
    },
    availableOccupiedTable(id) {
      const targetIndex = id - 1;
      console.log("iiiidddddd=", targetIndex, id);
      this.tables[targetIndex].status = 1;
      this.tables[targetIndex].occupied = 0;
      this.tables[targetIndex].fussMessage = "";
      this.tables[targetIndex].duration = "00:00";
      this.availableTables[targetIndex] = this.tables[targetIndex].capacity;
      console.log(this.availableTables, this.tables);
    }
  }
});

const AfficheComponent = {
  props: {
    heure: String,
    city: String,
    tempMin: Number,
    tempMax: Number,
    speedWind: Number,
    tempsPrevu: String,
    icone: String,
  },
  template: `
    <div>
        <h2>La météo sur la ville de {{city}}</h2>
        <p>Heure de prévision : {{heure}}</p>
        <h3>Les températures seront au minimum : {{tempMin}}°C et maximum : {{tempMax}}°C </h3>
        <h3>Le vent soufflera à {{speedWind}} km/heure</h3>
        <h3>Le temps prévu sera {{tempsPrevu}}</h3>
        <img :src="'http://openweathermap.org/img/wn/' + icone + '@2x.png'" />
    </div>
    `,
};

const RootComponent = {
  data() {
    return {
      city: "",
      previ: [],
      tempMax: "",
      tempMin: "",
      wind: "",
      description: "",
      icone: "",
      heure: "",
      long: "",
      lat: "",
    };
  },

  components: {
    affiche: AfficheComponent,
  },

  async mounted() {
    const reponse = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=Antibes,fr&appid=7f7aa853b3e39c89c28ef78afbcbcbd4&units=metric&lang=fr"
    );

    let data = await reponse.json();
    console.log(data);
    this.previ = data.list;
    this.city = data.city;
  },

  methods: {
    maPosition() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;

        const retour = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lon=" +
            this.long +
            "&lat=" +
            this.lat +
            "&appid=7524b547972909bbc321d4e184e23f48&units=metric&lang=fr"
        );

        const data = await retour.json();
        this.previ = data.list;
        this.city = data.city;
      });
    },
  },
  template: `
  <header id="titre">
    <h1>Voici votre Méteo en live</h1>
   
  </header>
  <section class="bouton">
  <button id="position" @click="maPosition">Ma position</button>
  </section>
  <div class="presentation">
    <affiche id="prezmeteo" 
      v-for="(item,index) in previ" 
      :tempMin="item.main.temp_min" 
      :city="city.name"
      :tempMax="item.main.temp_max"
      :speedWind="item.wind.speed"
      :tempsPrevu="item.weather[0].description"
      :icone="item.weather[0].icon"
      :heure="item.dt_txt"
    ></affiche>
  </div>
  `,
};

Vue.createApp(RootComponent).mount("#root");

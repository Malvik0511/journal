<template>
    <v-layout class="flight-help" wrap>
        <v-tabs v-model="active"
                color="#235087"
                active-class="flight-help__tab_active"
                dark
                slider-color="yellow">
            <v-tab v-for="(info, n) in infoList"
                   :key="n"
                   ripple>
                {{ info.to }}
            </v-tab>
            <v-tab-item  v-for="(info, n) in infoList"
                        :key="n">
                <v-card flat
                        color="#0E1A2C">
                    <v-card-text>{{ info.text }}</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
    </v-layout>
</template>

<script>
    import "./flightHelp.css";

    export default {
        name: "FlightHelp",

        props:{
            direct:{
                type: String,
                required: true
            }
        },

        computed: {
            infoList(){
                return (
                    this.direct === "arrival" ?
                        [
                            { to: "Прилетающим", text: "По прилёте пассажиры международных рейсов проходят " +
                                    "пограничный и таможенный контроль. Пассажиры внутренних рейсов сразу проходят " +
                                    "в зону выдачи багажа."
                            },
                            { to: "Встречающим", text: "В ожидании пассажира вы можете провести время в общей зоне " +
                                    "аэропорта: купить цветы, посетить магазины или поесть в ресторанах."
                            },
                        ]:
                        [
                            { to: "Вылетающим", text: "Приезжайте в аэропорт заранее, чтобы успеть " +
                                    "зарегистрироваться, сдать багаж и пройти все контроли. Если вы летите " +
                                    "международным рейсом, рекомендуем быть в аэропорту за 3,5 часа до вылета. " +
                                    "Если летите внутренним рейсом — за 2,5 часа."
                            },
                            { to: "Провожающим", text: "Вы можете проводить вылетающего пассажира до аэропорта" +
                                    "и провести с ним время в общей зоне терминала. Помните, что после этого" +
                                    "пассажиру перед вылетом нужно будет успеть пройти контроль и досмотр" +
                                    "- поэтому рекомендуем приезжать в аэропорт заранее."
                            },
                        ]
                )
            }
        },

        data: () => ({
            active: null,
        }),
    };
</script>

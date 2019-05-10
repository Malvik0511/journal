<template>
    <v-form class="auth"
            v-model="authForm.valid"
            @keyup.native.enter="submit">
        <v-flex class = "auth__form-header font-weight-bold"
                text-xs-center>Вход в личный кабинет</v-flex>
        <v-layout justify-center>
            <v-flex xs12>
                <label class = "auth__label">Логин</label>
                <v-text-field v-model="authForm.login"
                              :rules="rules.login"
                              :height = "42"
                              class = "auth__input-field"
                              solo
                              placeholder="Введите логин"></v-text-field>
                <v-layout>
                    <v-flex text-xs-left>
                        <label class = "user-auth__label">Пароль</label>
                    </v-flex>
                </v-layout>
                <v-text-field v-model="authForm.password"
                              :rules="rules.password"
                              :height = "42"
                              class = "auth__input-field"
                              solo
                              type="password"
                              placeholder="Введите пароль"></v-text-field>
                <v-layout justify-center>
                    <v-flex xs12>
                        <v-btn :disabled="!authForm.valid"
                               @click="auth"
                               class = "auth__auth-btn v-btn_background-gradient1"
                               id = "auth-btn"
                               block>Войти</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-form>
</template>

<script>
    export default {
        name: "Auth",

        components: {},

        props: {},

        data: () => ({
            authForm: {
                login: "",
                password: "",
                valid: false,
            },
            rules: {
                login: [v => !!v || ""],
                password: [
                    v => !!v || "",
                    v =>
                        v.search(/[а-яА-ЯёЁ]/g) === -1 || "в пароле не должно быть кириллицы"
                ]
            },
        }),

        created() {
            this.init();
        },

        computed:{
            sessionUser(){
                return this.$store.getters.authUser;
            },

            isLoggedIn(){
                return this.$store.getters.isLoggedIn;
            }
        },

        methods: {

            init(){
                this.$store.dispatch("getSessionUser")
                    .then(this.goHome)
                    //.catch(this.clearStore);
            },

            tryToLogin() {
                if (this.sessionUser && this.isLoggedIn) {
                    this.goHome();
                } else {
                   // this.clearStore();
                }
            },

            clearStore(){
                this.$store.dispatch("clearStore");
            },

            //авторизация
            auth() {
                const { login, password } = this.authForm;

                this.$store.dispatch("logIn", { login, password })
                    .then(this.goHome)
                    .catch(this.showErr);
            },

            goHome(){
                this.$router.push("/");
            },

            showErr(){
                this.$store.dispatch("popupInfoOpen", {
                    text: "Неверный логин или пароль",
                    color: "red"
                });
            }
        }
    };
</script>

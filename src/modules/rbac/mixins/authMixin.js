import store from "../vuex";
export default {
    methods: {
        $_hasAuth (auth) {
            return store.state.global.auth.includes(auth)
        }
    }
}

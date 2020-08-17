import store from "../vuex";
export default {
    ws: {},
    setWs: function (newWs) {
        this.ws = newWs
    },
    methods: {
        $_hasAuth(auth) {
            return store.state.global.auth.includes(auth)
        }
    }
}

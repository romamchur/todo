<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout column>
        <v-flex class="login__question">
          <span>No account?</span>
          <v-btn color="info" dark> Sing up </v-btn>
        </v-flex>
        <v-flex class="login__form-wrapper">
          <v-form ref="form" class="login__form">
            <span class="login__form-title">ToDo</span>
            <v-text-field
              v-model="email"
              label="Email"
              solo
              dark
              :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              solo
              dark
              type="password"
              :rules="[rules.required, rules.min]"
            >
            </v-text-field>

            <v-btn color="info" dark @click="login()"> Login </v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
export default {
  data() {
    return {
      email: null,
      password: null,
      rules: {
        required: value => !!value || "Required.",
        min: v => v && v.length >= 8 || "Min 8 characters.",
        email: v => this.validateEmail(v) || "Please enter valid email."
      }
    };
  },
  methods: {
    validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    login() {

        if(this.$refs.form.validate()) {
            localStorage.token = "generatedToken"
        }
    }
  }
};
</script>
<style scoped lang="less">
.login {
  &__question {
    height: 60px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  &__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-title {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .v-input {
      flex: none;
      width: 416px;
    }
  }
}
</style>

<script>
  import Alert from "../../components/alert.svelte";

  import Cookies from "js-cookie";

  let username = "";
  let password = "";

  let loading = false;

  let field = "";
  let message = "";

  import makePostRequest from "$lib/other/make-post-request";
  import decryptPersonalPrivateKey from "$lib/encryption/decrypt-personal-private-key";

  async function login() {
    loading = true;
    await makePostRequest("/api/auth/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.error === true) {
        field = response.fields[0];
        message = response.data;
      } else {
        console.log(response);
        field = "";
        message = "";

        Cookies.set("token", response.token, {
          expires: 180,
          sameSite: "strict",
        });

        decryptPersonalPrivateKey(response.private_key, password).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );

        window.location.href = "/";
      }
    });

    loading = false;
  }
</script>

<div class="flex flex-col min-h-screen justify-center items-center">
  <div class="form-control w-full max-w-xs">
    <label class="label" for="">
      <span class="label-text">What is your username?</span>
    </label>
    <input
      type="username"
      placeholder="Enter your username"
      class="input input-bordered w-full max-w-xs border-red"
      bind:value={username}
    />
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <label class="label" for="">
      <span class="label-text">Now enter your password</span>
      <a class="label-text-alt underline" href="/reset-password">Forgot?</a>
    </label>
    <input
      type="password"
      placeholder="Enter your password"
      class="input input-bordered w-full max-w-xs"
      bind:value={password}
    />
  </div>

  <div class="form-control w-full max-w-xs mt-7">
    <button
      class="btn btn-outline capitalize"
      on:click={login}
      disabled={loading}
    >
      {#if loading}
        <span class="loading loading-spinner opacity-50" />
      {:else}
        Login
      {/if}
    </button>
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <button
      class="btn btn-ghost capitalize"
      on:click={() => (window.location.href = "/register")}
    >
      Register
    </button>
  </div>

  <Alert {message} {field} />
</div>

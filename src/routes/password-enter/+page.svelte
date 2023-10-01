<script>
  import Alert from "../../components/alert.svelte";

  import Cookies from "js-cookie";

  export let data;

  let password = "";

  let loading = false;

  let field = "";
  let message = "";

  import makePostRequest from "$lib/other/make-post-request";
  import decryptPersonalPrivateKey from "$lib/encryption/decrypt-personal-private-key";

  async function login() {
    loading = true;
    await makePostRequest("/api/auth/login", {
      username: data.username,
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

  <div class="form-control w-full max-w-xs mt-10">
    <label class="label" for="">
      <span class="label-text">Welcome back, <b>{data.username}</span>
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
        Re-Login
      {/if}
    </button>
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <button
      class="btn btn-ghost capitalize"
      on:click={() => (window.location.href = "/logout")}
    >
      Logout
    </button>
  </div>

  <Alert {message} {field} />
</div>

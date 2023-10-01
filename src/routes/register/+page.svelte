<script>
  import Alert from "../../components/alert.svelte";

  import Cookies from "js-cookie";

  let username = "";
  let password1 = "";
  let password2 = "";

  let loading = false;

  let field = "";
  let message = "";

  import generateKeys from "$lib/encryption/generate-keys";
  import decryptPersonalPrivateKey from "$lib/encryption/decrypt-personal-private-key";
  import makePostRequest from "$lib/other/make-post-request";

  async function register() {
    loading = true;

    let { publicKey, privateKey } = await generateKeys(password1);

    await makePostRequest("/api/auth/register", {
      username: username,
      password1: password1,
      password2: password2,
      public_key: publicKey,
      private_key: privateKey,
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

        decryptPersonalPrivateKey(response.private_key, password1).then(
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
      <span class="label-text">What username do you want?</span>
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
      <span class="label-text">Now enter the password you want</span>
    </label>
    <input
      type="password"
      placeholder="Enter your password"
      class="input input-bordered w-full max-w-xs"
      bind:value={password1}
    />
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <label class="label" for="">
      <span class="label-text">Enter the same password again</span>
    </label>
    <input
      type="password"
      placeholder="Enter your password"
      class="input input-bordered w-full max-w-xs"
      bind:value={password2}
    />
  </div>

  <div class="form-control w-full max-w-xs mt-7">
    <button
      class="btn btn-outline capitalize"
      on:click={register}
      disabled={loading}
    >
      {#if loading === true}
        <span class="loading loading-spinner opacity-50" />
      {:else}
        Register
      {/if}
    </button>
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <button
      class="btn btn-ghost capitalize"
      on:click={() => (window.location.href = "/login")}
    >
      Login
    </button>
  </div>

  <Alert {message} {field} />
</div>

<script>
  import Alert from "../../components/alert.svelte";

  import Cookies from "js-cookie";

  let loading = false;

  let field = "";
  let message = "";

  import makePostRequest from "$lib/other/make-post-request";

  async function logout() {
    loading = true;
    await makePostRequest("/api/auth/logout", {}).then((response) => {
      if (response.error === true) {
        field = response.fields[0];
        message = response.data;
      } else {
        console.log(response);
        field = "";
        message = "";

        Cookies.remove("token");

        window.sessionStorage.removeItem("private_key");

        window.location.href = "/login";
      }
    });

    loading = false;
  }
</script>

<div class="flex flex-col min-h-screen justify-center items-center">
  <div class="form-control w-full max-w-xs mt-7">
    <button
      class="btn btn-outline capitalize"
      on:click={logout}
      disabled={loading}
    >
      {#if loading}
        <span class="loading loading-spinner opacity-50" />
      {:else}
        Logout
      {/if}
    </button>
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <button
      class="btn btn-ghost capitalize"
      on:click={() => window.history.back()}
    >
      Cancel
    </button>
  </div>

  <Alert {message} {field} />
</div>

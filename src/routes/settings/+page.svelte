<script>
  import Alert from "../../components/alert.svelte";
  import Navbar from "../../components/navbar.svelte";

  import { user } from "$lib/stores/main";

  import makePostRequest from "$lib/other/make-post-request";

  let user_data = [];

  user.subscribe((data) => {
    user_data = data;
  });

  let show_ids = false;
  let loading = false;

  let field = "";
  let message = "";

  async function changeIDVisibility() {
    show_ids = !show_ids;
  }

  async function update() {
    loading = true;

    await makePostRequest("/api/settings/update", user_data).then(
      (response) => {
        if (response.error === true) {
          field = response.fields[0];
          message = response.data;
        } else {
          field = ""
          message = ""

          console.log(response);
        }
      }
    );

    loading = false;
  }
</script>

<Navbar />

<div class="mt-20 ml-5">
  <div>
    <div class="form-control w-full max-w-xs">
      <div class="form-control w-full max-w-xs">
        <label class="label" for="">
          <span class="label-text">Preferred name</span>
        </label>
        <input
          type="username"
          placeholder="Enter your preferred name"
          class="input input-bordered w-full max-w-xs border-red"
          bind:value={user_data.preferred_name}
        />
      </div>
    </div>

    <div class="form-control w-full max-w-xs mt-3">
      <div class="form-control w-full max-w-xs">
        <label class="label" for="">
          <span class="label-text">Username</span>
        </label>
        <input
          type="username"
          placeholder="Enter your username"
          class="input input-bordered w-full max-w-xs border-red"
          bind:value={user_data.username}
        />
      </div>
    </div>
  </div>

  <div class="form-control w-full max-w-xs mt-3">
    <div class="form-control w-full max-w-xs">
      <label class="label" for="">
        <span class="label-text">Recovery email</span>
      </label>
      <input
        type="username"
        placeholder="Enter a valid email"
        class="input input-bordered w-full max-w-xs border-red"
        bind:value={user_data.recovery_email}
      />
    </div>
  </div>

  <div class="form-control w-full max-w-xs mt-8">
    <button
      class="btn btn-outline capitalize"
      on:click={update}
      disabled={loading}
    >
      {#if loading}
        <span class="loading loading-spinner opacity-50" />
      {:else}
        Update
      {/if}
    </button>
  </div>

  <div class="mt-20">
    {#if show_ids === false}
      <button class="btn btn-outline capitalize" on:click={changeIDVisibility}
        >Click to show ID's</button
      >
    {:else}
      EGLO: {user_data.id}
      <br />
      ENS: {user_data.ens_subscriber_id}
    {/if}
  </div>
</div>

<Alert {message} {field} />

<script>
  import { data_to_load } from "$lib/stores/main";

  export let relationships = [];

  async function setDataToLoad(data) {
    data_to_load.set(data);
  }
</script>

<div class="fixed top-0 left-0 h-screen drawer lg:drawer-open">
  <input id="drawer-1" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center" />
  <div class="drawer-side mt-16">
    <label for="drawer-1" class="drawer-overlay" />
    <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      {#if relationships}
        {#each Object.entries(relationships) as [title, info]}
          <p class="font-bold capitalize text-xl mt-3 mb-3">{title}</p>

          {#each info as data, index}
            <li><button on:click={setDataToLoad}>{data.name}</button></li>
          {/each}
        {/each}
      {/if}
    </ul>
  </div>
</div>

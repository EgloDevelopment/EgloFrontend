<script>
  import Navbar from "../../components/navbar.svelte";
  import MiniSearch from "minisearch";

  import { services } from "$lib/stores/main";

  let search_term = "";
  let search_results = [];

  let miniSearch = new MiniSearch({
    fields: ["name", "description", "url", "tags"],
    storeFields: ["name", "description", "url", "tags"],
  });

  services.subscribe((data) => {
    console.log(data)
    miniSearch.removeAll()
    miniSearch.addAll(data);
  });

  async function searchServices() {
    let results = miniSearch.search(search_term);
    search_results = results;
  }
</script>

<Navbar />

<div class="flex flex-col min-h-screen justify-center items-center">
  <div class="form-control w-full max-w-xs mt-3">
    <label class="label" for="">
      <span class="label-text">Enter a service or tag to search for</span>
    </label>
    <input
      type="text"
      placeholder="A particular service"
      class="input input-bordered w-full max-w-xs"
      bind:value={search_term}
      on:change={searchServices}
    />
  </div>

  <div class="form-control w-full max-w-xs mt-5">
    <button class="btn btn-outline capitalize" on:click={searchServices}>
      Search
    </button>
  </div>

  <div class="mt-10">
    {#each search_results as data, index}
      <a href={data.url}>
        <div class="card w-96 shadow-xl cursor-pointer mt-3 border border-secondary h-20">
          <div class="card-body -mt-6">
            <h2 class="card-title">{data.name}</h2>
            <p>{data.description}</p>
          </div>
        </div>
      </a>
    {/each}
  </div>
</div>

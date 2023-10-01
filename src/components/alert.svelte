<script>
    export let field = "";
    export let message = "";
    export let type = "";
  </script>
  
  {#if message !== "" && field !== ""}
    <div class="toast toast-end">
      <div class={"cursor-not-allowed alert alert-" + type}>
        <span><b class="capitalize">{field.replace(/_/g, ' ')}</b>: {message}</span>
      </div>
    </div>
  {/if}
  
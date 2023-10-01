<script>
  import { notifications } from "$lib/stores/main";
  import { user } from "$lib/stores/main";

  import makePostRequest from "$lib/other/make-post-request";

  let user_notifications = [];
  let user_data = [];

  console.log(window.location.pathname);

  notifications.subscribe((data) => {
    user_notifications = data;
  });

  user.subscribe((data) => {
    user_data = data;
  });

  async function refreshNotifications() {
    await makePostRequest("/ens/get-notifications", {
      subscriber_id: user_data.ens_subscriber_id,
    }).then((response) => {
      notifications.set(response);
    });
  }

  async function readNotification(notification_id) {
    await makePostRequest("/ens/read-notification", {
      subscriber_id: user_data.ens_subscriber_id,
      notification_id: notification_id,
    }).then(() => {
      refreshNotifications();
    });
  }

  async function deleteNotification(notification_id) {
    await makePostRequest("/ens/delete-notification", {
      subscriber_id: user_data.ens_subscriber_id,
      notification_id: notification_id,
    }).then(() => {
      refreshNotifications();
    });
  }
</script>

<div class="fixed top-0 left-0 z-50 navbar bg-base-100 bg-base-300 h-8">
  <div class="flex-1">
    {#if window.location.pathname === "/"}
      <label
        for="drawer-1"
        class="btn btn-ghost drawer-button lg:hidden capitalize"
        ><box-icon
          name="menu-alt-left"
          color="grey"
          size="sm"
          class="max-h-5"
        /></label
      >
    {:else}
      <a href="/" class="btn btn-ghost drawer-button capitalize"
        ><box-icon
          name="arrow-back"
          color="grey"
          size="sm"
          class="max-h-5"
        /></a
      >
    {/if}
  </div>
  <div class="flex-none">
    <a
      tabindex="0"
      class="btn btn-ghost btn-circle m-1"
      href="/service-browser"
    >
      <box-icon
        type="solid"
        name="search-alt-2"
        color="grey"
        size="sm"
        class="max-h-5"
      />
    </a>

    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost btn-circle m-1"
        ><box-icon
          type="solid"
          name="bell"
          color="grey"
          size="sm"
          class="max-h-5"
        /></label
      >
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box bg-base-100 border border-secondary w-[20rem] max-h-[34rem] overflow-y-auto overflow-x-hidden block whitespace-normal"
      >
        {#if user_notifications.length > 0}
          {#each user_notifications as notification, index}
            <li class="block">
              {#if notification.read === false}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="flex flex-col items-start w-full"
                  on:click={readNotification(notification.id)}
                  on:keypress={readNotification(notification.id)}
                >
                  <p class="text-md font-bold">
                    {notification.title}
                  </p>
                  <p class="font-normal break-words">
                    {notification.text}
                  </p>
                </div>
              {:else}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="flex flex-col items-start w-full opacity-25"
                  on:click={deleteNotification(notification.id)}
                  on:keypress={deleteNotification(notification.id)}
                >
                  <p class="text-md font-bold">
                    {notification.title}
                  </p>
                  <p class="font-normal break-words">
                    {notification.text}
                  </p>
                </div>
              {/if}
            </li>
            <br />
          {/each}
        {:else}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="text-md font-bold hover:bg-base-100 text-center p-6 select-none"
          >
            <p>No notifications</p>
          </div>
        {/if}
      </ul>
    </div>

    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost btn-circle m-1">
        <box-icon
          type="solid"
          name="user"
          color="grey"
          size="sm"
          class="max-h-5"
        /></label
      >
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box bg-base-100 border border-secondary w-36"
      >
        <li><a href="/settings">Settings</a></li>
        <li><a href="/logout">Logout</a></li>
      </ul>
    </div>
  </div>
</div>

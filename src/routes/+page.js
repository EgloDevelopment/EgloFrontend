import checkLoggedIn from "$lib/auth/check-logged-in"
import makePostRequest from "$lib/other/make-post-request"

import { notifications } from "$lib/stores/main"
import { user } from "$lib/stores/main"
import { services } from "$lib/stores/main"

export async function load() {
  checkLoggedIn()

  let user_data = await makePostRequest("/api/user-data/get-profile-from-token")
  let user_notifications = await makePostRequest("/ens/get-notifications", {subscriber_id: user_data.ens_subscriber_id})
  let available_services = await makePostRequest("/api/data/get-services")

  notifications.set(user_notifications)
  user.set(user_data)
  services.set(available_services)
}

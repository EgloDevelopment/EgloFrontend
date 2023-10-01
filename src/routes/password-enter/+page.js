import makePostRequest from "$lib/other/make-post-request"

export async function load() {
  let data = await makePostRequest("/api/user-data/get-profile-from-token")

  return data
}

import { atom } from "jotai";

const sidebarState = atom(true);

const sidebarPage = atom("FriendsAndGroups");

const showAddFriend = atom(false)
const showLogout = atom(false)
const showNews = atom(true)

export { sidebarState, sidebarPage, showAddFriend, showLogout, showNews };

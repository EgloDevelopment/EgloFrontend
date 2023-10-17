import { atom } from "jotai";

const sidebarState = atom(true);

const sidebarPage = atom("FriendsAndGroups");

const showAddFriend = atom(false)
const showLogout = atom(false)
const showNews = atom(true)
const showPurchase = atom(false)

const chatData = atom({})

export { sidebarState, sidebarPage, showAddFriend, showLogout, showNews, showPurchase, chatData };

import { atom } from "jotai";
import { useState } from "react";

const sidebarState = atom(true);
const sidebarPage = atom("FriendsAndGroups");

const showAddFriend = atom(false);
const showLogout = atom(false);
const showNews = atom(true);
const showPurchase = atom(false);

const chatData = atom({ active: false });

const showFileUpload = atom(false);
const fileToUpload = atom([]);

const showFileDownload = atom(false)
const fileToDownload = atom([])

const showUserProfile = atom(false)
const userToView = atom({ active: false })

const showError = atom(false)
const error = atom("")

const showEncrypted = atom(false)

const showRemoveFriend = atom(false)
const friendToRemove = atom("")

const refreshFriends = atom(false)
const refreshGroups = atom(false)
const refreshServers = atom(false)

const showCreateGroup = atom(false)

const cachedFriends = atom([])
const cachedGroups = atom([])

const showLeaveGroup = atom(false)
const showDeleteGroup = atom(false)
const showGroupSettings = atom(false)
const groupID = atom({active: false})

export {
  sidebarState,
  sidebarPage,
  showAddFriend,
  showLogout,
  showNews,
  showPurchase,
  chatData,
  showFileUpload,
  fileToUpload,
  showFileDownload,
  fileToDownload,
  showUserProfile,
  userToView,
  showError,
  error,
  showEncrypted,
  showRemoveFriend,
  friendToRemove,
  refreshFriends,
  refreshGroups,
  refreshServers,
  showCreateGroup,
  cachedFriends,
  cachedGroups,
  showLeaveGroup,
  showDeleteGroup,
  showGroupSettings,
  groupID
};

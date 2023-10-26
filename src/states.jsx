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
  friendToRemove
};

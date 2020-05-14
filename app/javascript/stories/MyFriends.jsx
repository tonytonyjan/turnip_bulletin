import React from "react";
import { action } from "@storybook/addon-actions";
import MyFriends from "components/MyFriends";

export default { title: "MyFriends" };

const props = {
  friends: [],
  onDeleteFriend: action("onDeleteFriend"),
  onAddFriend: action("onAddFriend"),
  onMount: action("onMount"),
  onClickAddFriend: action("onClickAddFriend"),
  onSubmit: action("onSubmit"),
};

export const withoutData = () => <MyFriends {...props} />;
export const withData = () => (
  <MyFriends
    {...props}
    friends={Array.apply(null, { length: 20 }).map((e, i) => ({
      island: `island ${i}`,
      resident: `resident ${i}`,
    }))}
  />
);

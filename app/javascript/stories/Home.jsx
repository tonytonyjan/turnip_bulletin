import React from "react";
import Home from "components/Home";
import { withKnobs, boolean, text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

export default { title: "Home", decorators: [withKnobs] };

const props = {
  priceRecords: [],
  expiredPriceRecords: [],
  onAddPrice: action("onAddPrice"),
  onMount: action("onMount"),
  onClickSend: action("onClickSend"),
  onClickRefresh: action("onClickRefresh"),
  onSubmit: action("onSubmit"),
};

export const withoutData = () => (
  <Home {...props} disabled={boolean("Disabled", false)} />
);

export const withData = () => {
  const disabled = boolean("Disabled", false);
  const records = [
    {
      id: "1",
      island: text("Island Name", "卡加布列島"),
      resident: text("Resident Name", "七彩衣的鳥"),
      price: 123,
      time: text("Meta Text", "5 分鐘後逾期"),
      text: text("Text", "一句話"),
    },
  ];
  return (
    <Home
      {...props}
      disabled={disabled}
      priceRecords={records}
      expiredPriceRecords={records}
    />
  );
};

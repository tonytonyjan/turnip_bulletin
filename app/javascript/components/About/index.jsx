import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import "./style";

export default ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, []);
  return (
    <div className="about">
      <Typography variant="h4" component="h1">
        使用
      </Typography>
      <ul>
        <Typography variant="body1" component="li">
          在<b>「設定」</b>輸入自己的島名和名字
        </Typography>
        <Typography variant="body1" component="li">
          請好友在他們的<b>「好友名單」</b>裡輸入你的島名和你的名字
        </Typography>
        <Typography variant="body1" component="li">
          在<b>「即時菜價」</b>提報自己的菜價，好友將會看的到你更新的即時菜價
        </Typography>
      </ul>
      <Typography variant="h4" component="h1">
        安裝到手機
      </Typography>
      <Typography>
        用 chrome 或 safari 開啟後將網站新增至手機桌面即可完成安裝。
      </Typography>
      <Typography variant="h4" component="h1">
        意見回饋
      </Typography>
      <Typography>
        <a href="mailto:tonytonyjan@gmail.com?subject=%5B動森股友會%5D%20意見回饋">
          tonytonyjan@gmail.com
        </a>
      </Typography>
      <Typography>
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://tonytonyjan.net"
        >
          https://tonytonyjan.net
        </a>
      </Typography>
    </div>
  );
};

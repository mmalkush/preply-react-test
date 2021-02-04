// @flow
import React, { useRef, useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import OnlineStatusMock from "./OnlineStatusMock";
import "./App.css";

/*
Feel free to edit this all. If you don't need the HoC, go remove it.
If you wish to save the state somewhere else, go for it.
Just keep rendering <OnlineStatusMock />
*/

const withOnlineStatus = (WrappedComponent) =>
  function (props) {
    const [isOnline, setIsOnline] = useState(false);

    return (
      <>
        <OnlineStatusMock onIsOnlineChange={setIsOnline} />
        <WrappedComponent {...props} isOnline={isOnline} />
      </>
    );
  };

type AppProps = {
  isOnline: boolean,
};

function App(props: AppProps) {
  const onlineState = useRef(props.isOnline);
  const lastOfflineTime = useRef(props.isOnline ? null : Date.now());
  const notificationTimeout = useRef(null);
  const statusUpdateDelta = 1000;
  const offlineUpdateDelta = 1000;

  useEffect(() => {
    if (props.isOnline !== onlineState.current) {
      onlineState.current = props.isOnline;

      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);

      let hideNotification = false;
      const nowTime = Date.now();

      if (props.isOnline) {
        lastOfflineTime.current = nowTime;
      } else {
        // hide notification for fast offline->online->offline case
        hideNotification = lastOfflineTime.current && nowTime - lastOfflineTime.current < offlineUpdateDelta;
      }

      if (!hideNotification) {
        notificationTimeout.current = setTimeout(() => {
          NotificationManager.info(props.isOnline ? "Online" : "Offline");
        }, statusUpdateDelta);
      }
    }
  });

  return (
    <div className={props.isOnline ? "online" : "offline"}>
      {props.isOnline ? "Online" : "Offline"}
      <NotificationContainer />
    </div>
  );
}

export default withOnlineStatus(App);

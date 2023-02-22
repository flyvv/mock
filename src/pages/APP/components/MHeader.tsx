import { RedoOutlined, SettingOutlined } from "@ant-design/icons";
import { Switch, Button } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import AppHeader from "./Settings";

export const MHeader = (props: { config: IConfigType }) => {
  const [config, setConfig] = useState<IConfigType>(props.config);

  useEffect(() => {
    chrome.storage.local.set({ config });
  }, [config]);

  return (
    <header className="vline">
      <div className="flex-between mt8 mb8">
        <div className="ml12 ">mock</div>
        <div className="mr12">
        <AppHeader config={config}  />
          <span
            onClick={() => {
              setConfig((s) => ({
                ...s,
                reload: !config.reload ?? false,
              }));
            }}
          >
            <RedoOutlined className="mr8" />
          </span>
          <Switch
            checked={!!config.isOpen}
            onChange={(v) => setConfig((s) => ({ ...s, isOpen: v }))}
          />
        </div>
      </div>
    </header>
  );
};

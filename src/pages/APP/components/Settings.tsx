import { useEffect, useState } from "react";
import { Button, Divider, Form, Modal, Select } from "antd";

import { SettingOutlined } from "@ant-design/icons";

const createDownloadFile = (cstr: string, filename: string) => {
  let doc = URL.createObjectURL(
    new Blob([cstr], { type: "application/octet-binary" })
  );
  chrome.downloads.download({
    url: doc,
    filename,
    conflictAction: "overwrite",
    saveAs: true,
  });
};

interface IProps {
  config: IConfigType;
}

export default function AppHeader(props: IProps) {

  
  const [config, setConfig] = useState<IConfigType>(props.config);

  const [modalVisible, setModalVisible] = useState(
    !props.config?.hostWhiteList?.length < 0
  );

  useEffect(() => {
    chrome.storage.local.set({ config });
  }, [config]);

  const handleExportConfig = () => {
    chrome.storage.local.get().then((res) => {
      let str = "";
      try {
        str = JSON.stringify({ config: res.config, projects: res.projects });
      } catch (error) {}
      createDownloadFile(str, "config");
    });
  };

  console.log(config,'  console.log();');
  return (
    <>
      <Button
      className='mr8'
        icon={<SettingOutlined />}
        onClick={() => {
          setModalVisible(true);
        }}
      />

      <Modal
        visible={modalVisible}
        destroyOnClose
        maskClosable={false}
        onCancel={() => {
          setModalVisible(false);
        }}
        closable={false}
        title="编辑全局配置"
        footer={
          <Button
            type="primary"
            onClick={() => {
              if (
                !config.hostWhiteList?.length &&
                !confirm(
                  "您未输入接口域名白名单，这将导致您的页面http接口不能被正确处理，确认离开？"
                )
              )
                return;
              setConfig((setting) => ({ ...setting }));
              setModalVisible(false);
            }}
          >
            确定
          </Button>
        }
      >
        <Form labelCol={{ span: 8 }}>
          <Form.Item
            label="接口域名白名单"
            tooltip="仅接口域名在白名单中的接口会被插件处理，输入域名 eg:bp.aliexpress.com"
          >
            <Select
              mode="multiple"
              placeholder="务必注意，此项未设置将导致http接口失效"
              value={config?.hostWhiteList}
              onChange={(list) => {
                setConfig((setting) => ({
                  ...setting,
                  hostWhiteList: list,
                }));
              }}
              dropdownRender={(menu) => (
                <div>
                  <Divider style={{ margin: "4px 0" }} />
                  <Button
                    onClick={() => {
                      const hostString = prompt("添加");
                      if (!hostString) return;
                      const list = config?.hostWhiteList
                        ? [...config?.hostWhiteList, hostString]
                        : [hostString];
                      setConfig((setting) => ({
                        ...setting,
                        hostWhiteList: list,
                      }));
                    }}
                  >
                    添加
                  </Button>
                </div>
              )}
            >
              {config?.hostWhiteList?.map((v) => {
                <Select.Option value={v} key={v}>
                  {v}
                </Select.Option>;
              })}
            </Select>
          </Form.Item>

    
          <Form.Item label="默认http提交数据类型">
            <Select
              value={config.defaultRequestContentType}
              style={{ width: 280 }}
              onChange={(val) =>
                setConfig((settings) => ({
                  ...settings,
                  defaultRequestContentType: val,
                }))
              }
            >
              <Select.Option value="application/json">
                application/json
              </Select.Option>
              <Select.Option value="application/x-www-form-urlcncoded">
                application/x-www-form-urlcncoded
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="导出全局配置">
            <Button onClick={handleExportConfig}>点击下载</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

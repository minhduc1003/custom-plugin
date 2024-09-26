import {
  UICompBuilder,
  NameConfig,
  Section,
  withExposingConfigs,
  stringExposingStateControl,
  withDefault,
  StringControl,
  jsonControl,
  styleControl,
} from "lowcoder-sdk";
import { useResizeDetector } from "react-resize-detector";
import styled from "styled-components";
import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
function check(
  value: any,
  types: (
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "object"
    | "null"
    | "undefined"
  )[],
  key?: string,
  arrayItemTransformer?: (value: any, key: string) => any
) {
  const type = typeof value;
  switch (type) {
    case "string":
    case "number":
    case "boolean":
    case "undefined":
      if (types.includes(type)) {
        return value;
      }
      break;
    case "object":
      if (value === null) {
        if (types.includes("null")) {
          return value;
        }
      } else if (Array.isArray(value)) {
        if (types.includes("array")) {
          return value.map((v, index) =>
            arrayItemTransformer?.(v, index.toString())
          );
        }
      } else if (types.includes("object")) {
        return value;
      }
      break;
  }
}
function checkDataNodes(value: any, key?: string): any | undefined {
  return check(value, ["array", "undefined"], key, (node, k) => {
    check(node, ["object"], k);
    check(node["label"], ["string"], "label");
    check(node["hidden"], ["boolean", "undefined"], "hidden");
    check(node["icon"], ["string", "undefined"], "icon");
    check(node["action"], ["object", "undefined"], "action");
    checkDataNodes(node["children"], "children");
    return node;
  });
}

function convertTreeData(data: any) {
  return data === "" ? [] : (checkDataNodes(data) ?? []);
}
const { Header, Content, Footer, Sider } = Layout;
const headerStyle = [
  {
    name: "margin",
    label: "margin",
    margin: "margin",
  },
  {
    name: "padding",
    label: "padding",
    padding: "padding",
  },
  {
    name: "backgroundColor",
    label: "background",
    backgroundColor: "backgroundColor",
  },
  {
    name: "color",
    label: "text color",
    color: "color",
  },
] as const;
const items1 = [
  {
    key: "1",
    label: "nav 1",
  },
  {
    key: "2",
    label: "nav 2",
  },
  {
    key: "3",
    label: "nav 3",
  },
];

const items2: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const StyledMenu = styled(Menu)<{
  $color: string;
}>`
  .ant-menu-item {
    color: ${(props) => props.$color};
  }
`;
let LayoutCompBase = (function () {
  const childrenMap = {
    logo: withDefault(
      StringControl,
      "https://mojomox.com/assets/images/articles/minimalist-logo/minimalist-logos-feat.png"
    ),
    widthLogo: withDefault(StringControl, "50px"),
    headerItem: jsonControl(convertTreeData, items1),
    headerStyles: styleControl(headerStyle, "headerStyle"),
  };
  return new UICompBuilder(childrenMap, (props: any) => {
    console.log(props.headerStyles.backgroundColor);
    return (
      <Layout>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: `${props.headerStyles.backgroundColor}`,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${props.widthLogo}`,
              marginRight: "50px",
            }}
          >
            <img
              style={{
                height: "100%",
                width: "100%",
                objectFit: "fill",
                verticalAlign: "baseline",
              }}
              src={props.logo}
              alt=""
            />
          </div>
          <StyledMenu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={props.headerItem}
            style={{
              flex: 1,
              minWidth: 0,
              backgroundColor: `${props.headerStyles.backgroundColor || "#001529"}`,
            }}
            $color={`${props.headerStyles.color || "#fff"}`}
          />
        </Header>
        <Content>
          <Layout style={{ padding: "24px 0" }}>
            <Sider width={200}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%" }}
                items={items2}
              />
            </Sider>
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              Content
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    );
  })
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name={"Header"}>
            {children.logo.propertyView({
              label: "Logo",
              placeholder: "Insert Link",
            })}
            {children.widthLogo.propertyView({
              label: "Width Logo",
              placeholder: "Insert width",
            })}
            {children.headerStyles.getPropertyView({
              label: "Style",
            })}
            {children.headerItem.propertyView({
              label: "Header Item",
            })}
          </Section>
        </>
      );
    })
    .build();
})();
export default withExposingConfigs(LayoutCompBase, [
  new NameConfig("logo", ""),
  new NameConfig("widthLogo", ""),
  new NameConfig("headerItem", ""),
]);

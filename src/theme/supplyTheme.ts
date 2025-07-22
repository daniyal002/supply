// src/theme.ts
import { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#678098",
  },
  components: {
    Menu: {
      itemSelectedColor: "#fff",
      itemSelectedBg: "#ffffff4f",
      itemHoverBg: "#ffffff4f",
      itemActiveBg: "#678098",
      itemColor: "#fff",
      itemHoverColor: "#fff",
      darkSubMenuItemBg: "#678098",
      colorBgContainer: "#678098",
      popupBg: "#678098",
    },
    Button: {
      colorPrimaryHover: "#678098",
      colorPrimary: "#678098",
      colorPrimaryActive: "#678098",
      colorPrimaryTextHover: "#678098",
      defaultColor: "#678098",
    },
    Table: {
      colorPrimary: "#678098",
      fontSizeIcon:13
    },
    Layout: {
      siderBg: "#678098",
      headerBg: "#fff",
    },
    Dropdown: {
      colorBgElevated: "#fff",
      colorText: "#678098",
    },
    Badge: {
      colorBgBase: "#fff",
      colorText: "#678098",
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2d3a4a", // Темно-серо-синий (антоним к #678098)
    colorText: "#fff",
  },
  components: {
    Menu: {
      itemSelectedColor: "#e6e6e6", // Светло-серый вместо белого
      itemSelectedBg: "#3d4b5c", // Темный фон вместо светлого
      itemHoverBg: "#3d4b5c",
      itemActiveBg: "#1d2939", // Еще более темный акцент
      itemColor: "#e6e6e6",
      itemHoverColor: "#ffffff",
      darkSubMenuItemBg: "#1d2939",
      colorBgContainer: "#1d2939",
      popupBg: "#1d2939",
    },
    Button: {
      colorPrimaryHover: "#1d2939",
      colorPrimary: "#3d4b5c",
      colorPrimaryActive: "#1d2939",
      colorPrimaryTextHover: "#e6e6e6",
      defaultColor: "#fff",
      colorPrimaryText: "#000",
      colorPrimaryBgHover: "#fff",
      defaultBg: "#54575800",
      defaultHoverBg: "#545758",
      textHoverBg: "#fff",
      defaultHoverColor: "#fff",
      defaultHoverBorderColor: "#545758",
      colorLink:"#fff",
      colorTextDisabled:"#fff",
    },
    Table: {
      colorPrimary: "#ff4d4f",
      fixedHeaderSortActiveBg: "#ff4d4f",
      colorBgContainer: "#2d3a4a",
      colorTextHeading: "#fff",
      colorText: "#fff",
      colorIcon: "#fff",
      headerSortHoverBg: "#678098",
      headerFilterHoverBg: "#fff",
      rowHoverBg: "#678098",
      // filterDropdownBg: "#252628",
    // filterDropdownMenuBg:"#fff",
      colorTextDisabled: "#fff",
    },
    Layout: {
      siderBg: "#1d2939", // Темный боковой блок
      headerBg: "#252628", // Почти черный для шапки
    },
    Dropdown: {
      colorBgContainer:"#fff",
      colorBgElevated: "#3d3e40",
      colorText: "#fff",
      colorTextDisabled: "#878686",
    },
    Badge: {
      colorBgBase: "#fff",
      colorText: "#fff",

    },
    Tabs: {
      colorPrimary: "#fff",
      colorPrimaryActive: "#fff",
      itemColor: "#979797",
      inkBarColor: "#678098",
      colorPrimaryHover: "#fff",
      cardBg: "#383838",
      colorBgContainer: "#2d3a4a",
      cardGutter: 2,
      colorBorderSecondary: "#252628",
    },
    DatePicker: {
      colorBgContainer: "#252628",
      colorText: "#fff",
      colorTextPlaceholder: "#fff",
      cellHoverBg: "#1d2939",
      colorBgElevated: "#252628",
      colorTextDisabled: "#ff4d4f",
      colorTextHeading: "#fff",
      colorPrimary: "#98bdeb",
      colorPrimaryTextHover: "#e6e6e6",
      colorIcon: "#fff",
      colorIconHover: "#e6e6e6",
    },
    Pagination: {
      itemActiveBg: "#1d2939",
      colorText: "#fff",
      colorPrimary: "#fff",
      colorBgTextHover: "#678098",
      itemBg: "#252628",
    },
    Select: {
      colorBgContainerDisabled: "gray",
      colorTextPlaceholder: "#afabab",
      optionActiveBg: "#67809887",
      optionSelectedColor: "#000",
      optionSelectedBg: "#fff",
      selectorBg: "#67809887",
      multipleItemBg: "#1d2939",
      colorBgElevated: "#1d2939",
      colorTextDisabled: "#fff",
    },

    Checkbox: {
      colorText: "#fff",
      colorTextDisabled: "#fff",
    },
    Input: {
      colorBgContainer: "#67809887",
      colorTextPlaceholder: "#afabab",
      colorText: "#fff",
      colorBgContainerDisabled: "gray",
      colorTextDisabled: "#fff",
    },
    Modal: {
      contentBg: "#252628",
      titleColor: "#",
      headerBg: "#252628",
    },
  },
};

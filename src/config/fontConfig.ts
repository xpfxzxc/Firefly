// 字体配置
export const fontConfig = {
  enable: true, // 启用自定义字体功能
  preload: true, // 预加载字体文件以提高性能
  selected: ["misans-light", "misans-normal", "misans-medium", "misans-semibold", "misans-bold"], // 当前选择的字体，支持多个字体组合
  fonts: {
    // 小米字体 - MiSans Light
    "misans-light": {
      id: "misans-light",
      name: "MiSans Light",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Light.min.css",
      family: "MiSans",
      weight: 300,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Normal
    "misans-normal": {
      id: "misans-normal",
      name: "MiSans Normal",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
      family: "MiSans",
      weight: 400,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Medium
    "misans-medium": {
      id: "misans-medium",
      name: "MiSans Medium",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Medium.min.css",
      family: "MiSans",
      weight: 500,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Semibold
    "misans-semibold": {
      id: "misans-semibold",
      name: "MiSans Semibold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
      family: "MiSans",
      weight: 600,
      display: "swap" as const,
    },
    // 小米字体 - MiSans Bold
    "misans-bold": {
      id: "misans-bold",
      name: "MiSans Bold",
      src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Bold.min.css",
      family: "MiSans",
      weight: 700,
      display: "swap" as const,
    },
  },
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ], // 全局字体回退
};

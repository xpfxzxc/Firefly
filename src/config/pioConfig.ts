import type { SpineModelConfig, Live2DModelConfig } from "../types/config";

// Spine 看板娘配置（版本 3.8）
export const spineModelConfig: SpineModelConfig = {
  enable: true, // 启用 Spine 看板娘
  model: {
    // Spine模型文件路径
    path: "/pio/models/spine/shiroko/NP0172_spr.json",
  },
  atlas: {
    // Spine模型纹理文件路径
    path: "/pio/models/spine/shiroko/NP0172_spr.atlas",
  },
  premultipliedAlpha: true, // 使用预乘Alpha
  position: {
    // 显示位置 bottom-left，bottom-right，top-left，top-right，注意：在右下角可能会挡住返回顶部按钮
    corner: "bottom-left",
    offsetX: 0, // 距离右边缘0px
    offsetY: 0, // 距离底部0px
  },
  size: {
    width: 625, // 容器宽度
    height: 2150, // 容器高度
    zoom: 0.18, // 容器缩放比例
  },
  viewport: {
    padLeft: 0,
    padRight: 0,
    padTop: 0,
    padBottom: 0,
    x: -300,
    y: -750,
    width: 625,
    height: 2150,
    debugRender: false,
  },
  animations: {
    initial: "Idle_01", // 初始动画
    idle: ["Idle_01"], // 待机动画列表
    idleInterval: 8000, // 待机动画切换间隔（8秒）
    persistent: ["halo_float"] // 持续播放的动画列表
  },
  interactive: {
    enabled: true, // 启用交互功能
    clickAnimations: ["00", "01", "02", "04", "05", "06", "07", "08", "99"], // 点击时随机播放的动画列表
    clickMessages: [ // ---
      "欢迎来到这个小小的空间~",
      "今天也请享受探索的乐趣吧！",
      "发现什么有趣的内容了吗？",
      "要喝杯茶休息一下吗？",
      "希望你能在这里找到需要的信息",
      "阳光正好，是个适合阅读的日子",
      "每个角落都藏着小小惊喜",
      "感谢你的到访，愿你有个美好的一天",
      "这里记录着思考和成长的痕迹",
      "慢慢来，享受这段时光",
    ], // 点击时随机显示的文字消息
    messageDisplayTime: 3000, // 文字显示时间（毫秒）
  },
  responsive: {
    hideOnMobile: true, // 在移动端隐藏
    mobileBreakpoint: 768, // 移动端断点
  },
  zIndex: 1000, // 层级
  opacity: 1.0, // 完全不透明
};

// Live2D 看板娘配置
export const live2dModelConfig: Live2DModelConfig = {
  enable: false, // 启用 Live2D 看板娘
  model: {
    // Live2D模型文件路径
    path: "/pio/models/live2d/snow_miku/model.json",
    // path: "/pio/models/live2d/illyasviel/illyasviel.model.json",
  },
  position: {
    // 显示位置 bottom-left，bottom-right，top-left，top-right，注意：在右下角可能会挡住返回顶部按钮
    corner: "bottom-left", // 显示位置
    offsetX: 0, // 距离边缘20px
    offsetY: 0, // 距离底部20px
  },
  size: {
    width: 135, // 容器宽度
    height: 165, // 容器高度
  },
  interactive: {
    enabled: true, // 启用交互功能
    // motions 和 expressions 将从模型 JSON 文件中自动读取
    clickMessages: [
      "你好！我是Miku~",
      "有什么需要帮助的吗？",
      "今天天气真不错呢！",
      "要不要一起玩游戏？",
      "记得按时休息哦！",
    ], // 点击时随机显示的文字消息
    messageDisplayTime: 3000, // 文字显示时间（毫秒）
  },
  responsive: {
    hideOnMobile: true, // 在移动端隐藏
    mobileBreakpoint: 768, // 移动端断点
  },
};

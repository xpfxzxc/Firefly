import type { AnnouncementConfig } from "../types/config";

export const announcementConfig: AnnouncementConfig = {
  title: "站点说明", // 公告标题
  content: "个人学习和日常零散想法的记录空间，内容随性且不定期更新。", // 公告内容
  closable: false, // 禁止用户关闭公告
  link: {
    enable: false, // 禁用链接
    text: "了解更多", // 链接文本
    url: "/about/", // 链接 URL
    external: false, // 内部链接
  },
};

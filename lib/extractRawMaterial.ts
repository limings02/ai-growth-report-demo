// 从表单数据中提取原始材料
// 这一步把"用户输入"转换成"AI 可处理的结构化素材"
// File 对象不可序列化，只保留 previewUrl

import { GrowthReportFormData, RawMaterial } from "./types";

export function extractRawMaterial(formData: GrowthReportFormData): RawMaterial {
  return {
    childName: formData.childName,
    childAge: formData.childAge,
    reportYear: formData.reportYear,
    parentName: formData.parentName,
    style: formData.style,

    // 照片只保留预览 URL，File 对象留在表单层
    photoUrls: formData.photos.map((p) => p.previewUrl),

    // 只保留有实质内容的问答
    qaList: formData.questions
      .filter((q) => q.answer.trim() !== "")
      .map((q) => ({ question: q.label, answer: q.answer })),

    freeNote: formData.freeNote,
  };
}

import { marked } from "marked";
const DOMPurify = require("dompurify");

const getHtml = async (markdown: string): Promise<string> => {
  return DOMPurify.sanitize(await marked.parseInline(markdown));
};

export default getHtml;

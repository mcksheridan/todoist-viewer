import { marked } from "marked";
const DOMPurify = require('dompurify');

const getHtml = async (markdown: string) => {
  return DOMPurify.sanitize(await marked.parse(markdown));
}

export default getHtml;

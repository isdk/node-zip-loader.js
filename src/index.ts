import { register } from 'node:module';
import { fileURLToPath } from 'url';
import path from 'path'

const extname = path.extname(import.meta.url)
const hookFilePath = fileURLToPath(new URL('./hook' + extname, import.meta.url));
register(hookFilePath, import.meta.url);

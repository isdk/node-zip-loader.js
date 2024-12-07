import { URL } from 'url';
import type { LoadFnOutput, LoadHookContext, ResolveHookContext, ResolveFnOutput } from 'module'
import AdmZip from 'adm-zip';

export function resolve(specifier: string, context: ResolveHookContext, defaultResolve: (
  specifier: string,
  context?: ResolveHookContext,
) => ResolveFnOutput | Promise<ResolveFnOutput>) {
  const { parentURL = undefined } = context;

  if (specifier.endsWith('.zip')) {
    const resolved = new URL(specifier, parentURL).href;
    return {
      url: resolved,
      format: 'module',
      shortCircuit: true,
    };
  }

  return defaultResolve(specifier, context);
}

export async function load(url: string, context: LoadHookContext, defaultLoad: (url: string, context?: LoadHookContext) => LoadFnOutput | Promise<LoadFnOutput>) {
  const urlObj = new URL(url);
  const filePath = urlObj.pathname;

  if (filePath.endsWith('.zip')) {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    // 解析 URL 中的文件路径
    const hash = urlObj.hash.substring(1) || 'index.js'; // 去掉开头的 '#'

    // 找到指定的文件
    let entryPoint = null;
    for (let entry of zipEntries) {
      if (entry.entryName === hash) {
        entryPoint = entry;
        break;
      }
    }

    if (!entryPoint) {
      throw new Error(`File not found in the ZIP file: ${hash}`);
    }

    // 解压指定文件到内存
    const data = entryPoint.getData().toString('utf8');

    return {
        format: 'module',
        source: data,
        shortCircuit: true,
      };
  }

  return defaultLoad(url, context);
}
import path from 'path'
import { URL } from 'url'
import type { LoadFnOutput, LoadHookContext, ResolveHookContext, ResolveFnOutput } from 'module'
import AdmZip from 'adm-zip'

export function resolve(specifier: string, context: ResolveHookContext, defaultResolve: (
  specifier: string,
  context?: ResolveHookContext,
) => ResolveFnOutput | Promise<ResolveFnOutput>) {

  const { parentURL = undefined } = context;
  let urlObj = getUrl(specifier);

  if (urlObj?.protocol === 'zip:') {
    if (urlObj.pathname.startsWith('./')) {
      if (parentURL) {
        const parentObj = new URL(parentURL);
        const absPath = path.resolve(path.dirname(parentObj.pathname), urlObj.pathname)
        // Can not modify the custom protocol pathname
        urlObj.href = urlObj.protocol + absPath + urlObj.hash
      }
    }
    const resolved = urlObj.href;
    return {
      url: resolved,
      format: 'module',
      shortCircuit: true,
      importAttributes: {
        ...context.importAttributes,
        parentURL: parentURL,
      }
    };
  }

  return defaultResolve(specifier, context);
}

export async function load(url: string, context: LoadHookContext, defaultLoad: (url: string, context?: LoadHookContext) => LoadFnOutput | Promise<LoadFnOutput>) {
  const urlObj = new URL(url);

  if (urlObj.protocol === 'zip:') {
    const filePath = urlObj.pathname;
    // throw new Error('Not implemented ' + filePath);
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    const hash = urlObj.hash.substring(1) || 'index.js'; // remove the first char '#'

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

    const data = entryPoint.getData().toString('utf8');

    return {
        format: 'module',
        source: data,
        shortCircuit: true,
      };
  }

  return defaultLoad(url, context);
}

function getUrl(s: string, base?: string) {
  try {
    return new URL(s, base);
  } catch (error) {
  }
}

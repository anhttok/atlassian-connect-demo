export function getMeta(metaName: string): string | undefined {
    return document.querySelector(`meta[name=${metaName}]`)?.getAttribute('content') || undefined;
}

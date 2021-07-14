/// <reference types="node" />
export interface DirEntries {
    dirs: string[];
    files: string[];
}
export declare type DefaultErrorTypes = Error | NodeJS.ErrnoException;
export declare type ErrorCallback<ErrorTypes = DefaultErrorTypes> = (error: ErrorTypes, result?: null | undefined) => void;
export declare type Callback<Type, ErrorTypes = DefaultErrorTypes> = ((error: null | undefined, result: Type) => void) & ErrorCallback<ErrorTypes>;
export declare const listDir: (dir: string, { filterDir, filterFile, }?: {
    filterDir?: ((dir: string) => boolean) | undefined;
    filterFile?: ((file: string) => boolean) | undefined;
}) => Promise<DirEntries>;
export declare const listFiles: (dir: string, { recursive, filterDir, filterFile, }?: {
    recursive?: boolean | undefined;
    filterDir?: ((dir: string) => boolean) | undefined;
    filterFile?: ((file: string, dir: string, path: string) => boolean) | undefined;
}) => Promise<string[]>;
//# sourceMappingURL=list.d.ts.map
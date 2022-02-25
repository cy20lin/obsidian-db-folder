import { App } from "obsidian";

export function obtainCurrentFolder(app: App): string {
    const file = app.workspace.getActiveFile();
    // obtain folder to check
    if(!file){
        return null;
    }
    return file.path.split("/").slice(0,-1).join("/")+"/";
}

export function obtainTFilesFromTFolder(app: App, folderPath: string): any[] {
    const files: any[] = [];
    // TODO improve this filter?
    let id = 0;
    app.vault.getFiles().forEach(file => {
        if(file.path.startsWith(folderPath)){
            const aFile = {
                id: ++id,
                title: `[[${file.basename}]]`
            }
            files.push(aFile);
        }
    });
    return files;
}
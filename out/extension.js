"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vscode = require("vscode");
function activate(context) {
    let disposable = vscode.commands.registerCommand('graphie.generate', () => __awaiter(this, void 0, void 0, function* () {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }
        const rootPath = workspaceFolders[0].uri.fsPath;
        const nodes = [];
        const edges = [];
        function scanFiles(dir) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const files = yield fs.promises.readdir(dir, { withFileTypes: true });
                    for (const file of files) {
                        const fullPath = path.join(dir, file.name);
                        // Skip node_modules directory
                        if (file.isDirectory() && file.name === 'node_modules') {
                            console.log(`Skipping directory: ${fullPath}`);
                            continue;
                        }
                        if (file.isDirectory()) {
                            console.log(`Entering directory: ${fullPath}`);
                            yield scanFiles(fullPath);
                        }
                        else if (file.name.endsWith('.ts')) {
                            console.log(`Scanning file: ${fullPath}`);
                            try {
                                const content = yield fs.promises.readFile(fullPath, 'utf-8');
                                analyzeFile(content, fullPath, nodes, edges);
                            }
                            catch (err) {
                                console.log(`Error reading file ${fullPath}: ${err}`);
                            }
                        }
                    }
                }
                catch (err) {
                    console.log(`Error scanning directory ${dir}: ${err}`);
                }
            });
        }
        function analyzeFile(content, filePath, nodes, edges) {
            console.log(`Analyzing file: ${filePath}`);
            try {
                const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
                function visit(node) {
                    if (ts.isClassDeclaration(node) && node.name) {
                        const className = node.name.text;
                        console.log(`Found class: ${className}`);
                        let nodeType = null;
                        // Safely access decorators
                        let decorators;
                        if ('getDecorators' in ts && typeof ts.getDecorators === 'function') {
                            decorators = ts.getDecorators(node) || [];
                        }
                        else {
                            decorators = node.decorators;
                        }
                        if (!decorators || decorators.length === 0) {
                            console.log(`No decorators found for class ${className}`);
                        }
                        else {
                            for (const decorator of decorators) {
                                const decoratorText = decorator.getText(sourceFile);
                                console.log(`Found decorator: ${decoratorText}`);
                                if (decoratorText.includes('@Component')) {
                                    nodeType = 'component';
                                    nodes.push({ id: className, label: className, type: 'component' });
                                    console.log(`Added node: ${className} (component)`);
                                }
                                else if (decoratorText.includes('@Injectable')) {
                                    nodeType = 'service';
                                    nodes.push({ id: className, label: className, type: 'service' });
                                    console.log(`Added node: ${className} (service)`);
                                }
                                else if (decoratorText.includes('@NgModule')) {
                                    nodeType = 'module';
                                    nodes.push({ id: className, label: className, type: 'module' });
                                    console.log(`Added node: ${className} (module)`);
                                }
                                else if (decoratorText.includes('@Pipe')) {
                                    nodeType = 'pipe';
                                    nodes.push({ id: className, label: className, type: 'pipe' });
                                    console.log(`Added node: ${className} (pipe)`);
                                }
                                else if (decoratorText.includes('@Directive')) {
                                    nodeType = 'directive';
                                    nodes.push({ id: className, label: className, type: 'directive' });
                                    console.log(`Added node: ${className} (directive)`);
                                }
                            }
                        }
                        if (nodeType) {
                            for (const member of node.members) {
                                if (ts.isConstructorDeclaration(member)) {
                                    for (const param of member.parameters) {
                                        if (param.type && ts.isTypeReferenceNode(param.type)) {
                                            const depName = param.type.typeName.getText(sourceFile);
                                            console.log(`Found dependency: ${depName} for ${className}`);
                                            if (nodes.some(n => n.id === depName)) {
                                                edges.push({ from: className, to: depName, label: 'uses' });
                                                console.log(`Added edge: ${className} -> ${depName}`);
                                            }
                                            else {
                                                console.log(`Dependency ${depName} not found in nodes for ${className}`);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ts.forEachChild(node, visit);
                }
                ts.forEachChild(sourceFile, visit);
            }
            catch (err) {
                console.log(`Error analyzing file ${filePath}: ${err}`);
            }
        }
        yield scanFiles(rootPath);
        console.log(`Final Nodes: ${JSON.stringify(nodes)}`);
        console.log(`Final Edges: ${JSON.stringify(edges)}`);
        if (nodes.length === 0) {
            vscode.window.showWarningMessage('No Angular components, services, modules, pipes, or directives found.');
        }
        const panel = vscode.window.createWebviewPanel('graphie', 'Graphie', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent(nodes, edges, context, panel);
    }));
    context.subscriptions.push(disposable);
}
function getWebviewContent(nodes, edges, context, panel) {
    const webview = panel.webview;
    const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webview', 'vis-network.min.js')));
    const styleUri = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'webview', 'vis-network.min.css')));
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Graphie</title>
      <link href="${styleUri}" rel="stylesheet" type="text/css"/>
      <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900&display=swap" rel="stylesheet">
      <style>
        *{font-family: 'Satoshi', sans-serif;}
        #graph { width: 100%; height: 100vh; border: 1px solid lightgray; }
        .message { padding: 26px; font-size: 16px; color: #333; }
      </style>
    </head>
    <body>
      ${nodes.length === 0 ? '<div class="message">No Angular constructs found. Ensure your project has valid @Component, @Injectable, @NgModule, @Pipe, or @Directive decorators.</div>' : ''}
      <div id="graph"></div>
      <script src="${scriptUri}"></script>
      <script>
        console.log('Webview loaded');
        const nodes = new vis.DataSet(${JSON.stringify(nodes)});
        const edges = new vis.DataSet(${JSON.stringify(edges)});
        const container = document.getElementById('graph');
        console.log('Container:', container);
        const data = { nodes, edges };
        const options = {
          nodes: {
            shape: 'box',
            font: { size: 16 },
            color: { background: '#ffffff', border: '#000000', highlight: { background: '#383838', border: '#000' } }
          },
          edges: { arrows: 'to' },
          layout: { hierarchical: { direction: 'UD', sortMethod: 'directed' } }
        };
        try {
          new vis.Network(container, data, options);
          console.log('Graph rendered successfully');
        } catch (err) {
          console.error('Error rendering graph:', err);
        }
      </script>
    </body>
    </html>
  `;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
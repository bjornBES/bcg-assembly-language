import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from your VSCode Extension!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

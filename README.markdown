# Graphie: Visualize Your Angular Architecture 🌐

**Graphie** is a powerful VS Code extension that transforms your Angular project into an interactive dependency graph. Effortlessly explore components, services, modules, pipes, and directives with a clear, hierarchical visualization powered by `vis-network`. 🚀

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🛠 **Comprehensive Scanning** | Detects Angular constructs (`@Component`, `@Injectable`, `@NgModule`, `@Pipe`, `@Directive`) in your `.ts` files. |
| 🔗 **Dependency Mapping** | Visualizes relationships via constructor injection, showing how services and components interact. |
| 📊 **Interactive Graph** | Renders a hierarchical graph with zoom, pan, and node highlighting using `vis-network`. |
| 🔔 **User-Friendly Feedback** | Displays a clear message if no Angular constructs are found, guiding users to check their project setup. |
---

## 🛠️ Installation

1. **Open VS Code** and navigate to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
2. **Search for `Graphie`** in the Marketplace.
3. **Click Install** to add Graphie to your VS Code environment.

Alternatively, install manually:
- Download the `.vsix` file from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=<your-publisher-name>.graphie) or GitHub releases.
- In VS Code, go to Extensions view > `...` > Install from VSIX, and select the file.

---

## 🚀 How to Use

Follow these simple steps to visualize your Angular project:

1. **Open Your Angular Project** 📂  
   - In VS Code, open the workspace containing your Angular project (e.g., `Y:\Projects\my-angular-app`).
   - Ensure `@angular/core` is installed (`npm install @angular/core` in the project directory).

2. **Run the Graphie Command** ⚙️  
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
   - Type and select `Graphie: Generate Angular Graph`.

3. **Explore the Graph** 📈  
   - A webview panel titled `Graphie` will open, displaying your project’s structure.
   - Interact with the graph: click nodes to highlight, zoom, or pan.
   - If no constructs are found, a message will guide you to verify your project’s decorators.

4. **Debug Issues** 🐞  
   - Check the Output panel (View > Output, select “Extension Host”) for logs.
   - Ensure `.ts` files have valid Angular decorators (e.g., `@Component`, `@Injectable`).

---

## 📋 Requirements

- **VS Code**: Version 1.80.0 or higher.
- **Angular Project**: Must include valid Angular decorators (`@Component`, `@Injectable`, `@NgModule`, `@Pipe`, `@Directive`).
- **Node.js**: Required for development and compilation (not for end-users).

---

## 🐞 Known Issues

- **Empty Graph**: If the webview shows “No Angular constructs found...”, verify:
  - Your project has valid Angular decorators.
  - `@angular/core` is installed (`npm install @angular/core`).
  - The workspace is set to the Angular project root.
- **Performance**: Large projects may scan slowly; Graphie excludes `node_modules` to mitigate this.
- Report issues on [GitHub](https://github.com/<your-username>/<your-repo>).

---

## 🤝 Contributing

We welcome contributions! To get started:
1. Fork the repository on [GitHub](https://github.com/yashraj-shitole/Graphie.git).
2. Clone your fork: `git clone https://github.com/yashraj-shitole/Graphie.git`.
3. Install dependencies: `npm install`.
4. Make changes and test: `npm run compile` and `F5` in VS Code.
5. Submit a pull request.

---

## 📜 License

[MIT License](LICENSE) © <your-name> <year>

---

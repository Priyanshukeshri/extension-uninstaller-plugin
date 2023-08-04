import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

let panel: any;

export function activate(context: vscode.ExtensionContext) {
	// Register the 'showExtensions' command
	const showExtensionsCommand = vscode.commands.registerCommand(
		"extension-uninstaller.plugin-uninstaller",
		() => {
			// Get the list of installed extensions
			const extensions = vscode.extensions.all.map((extension) => {
				return {
					name: extension.packageJSON.name,
					version: extension.packageJSON.version,
					description: extension.packageJSON.description,
					id: extension.packageJSON.id,
					publisher: extension.packageJSON.publisher,
					iconUrl: getExtensionIconUri(extension),
				};
			});

			// Create and show the webview panel
			panel = vscode.window.createWebviewPanel(
				"extensionList",
				"Installed Extensions",
				vscode.ViewColumn.One,
				{
					enableScripts: true, // Allow scripts in the webview
				}
			);

			// Set the webview content
			panel.webview.html = getWebviewContent(extensions, context.extensionPath);

			panel.webview.onDidReceiveMessage((message: { command?: any; extensionId?: any; }) => {
				if (message.command === 'removeExtension') {
					const { extensionId } = message;
					// console.log(`Remove extension with ID: ${extensionId}`);
					askForUninstallConfirmation(extensionId);
				  }
			  });
		}
	);

	context.subscriptions.push(showExtensionsCommand);
}

function askForUninstallConfirmation(extensionId: string) {
	vscode.window
	  .showInformationMessage(`Do you want to uninstall the extension with ID ${extensionId}?`, 'Yes', 'No')
	  .then((choice) => {
		if (choice === 'Yes') {
		  // Uninstall the extension
		  uninstallExtensionById(extensionId);
		}
	  });
  }

function uninstallExtensionById(extensionId: string) {
	vscode.commands
	  .executeCommand("workbench.extensions.uninstallExtension", extensionId)
	  .then(
		() => {
		  vscode.window.showInformationMessage(`Extension '${extensionId}' has been uninstalled.`);
		},
		(error) => {
		  vscode.window.showErrorMessage(`Failed to uninstall extension: ${error}`);
		}
	  );
}   

function getWebviewContent(extensions: any[], extensionPath: string) {
	// Generate the HTML content for the webview
	const extensionsWithIcon = extensions.filter(
		(extension) => extension.iconUrl !== ""
	);
	const extensionList = extensionsWithIcon
		.map(
			(extension) => `
		<div class="nft">
		  <div class="main">
			<img class="tokenImage" src="${extension.iconUrl}" alt="${extension.name}" />
			<h2>${extension.name}</h2>
			<p class="description">${extension.description}</p> 
			<div class="tokenInfo">
			  <div class="price">
				<ins>◘</ins>
				<p>${extension.version}</p>
			  </div>
			  <div class="duration">
				<ins>◷</ins>
				<p>${extension.publisher}</p>
			  </div>
			</div>
			<hr />
			<div class="creator">
			  <div class="wrapper">
				  <p><ins>Creator</ins> ${extension.id}</p>	
				  <button class="removeButton" data-extension-id="${extension.id}">Remove</button>
			  </div>
			</div>
		  </div>
		</div>
	  `
		)
		.join("");

	return `
	<!DOCTYPE html>
	<html>
	<head>
	  <title>Installed Extensions</title>
	  <style>
	  body {
			margin: 0;
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
			  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
			  sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			color: #eee;
			user-select: none;
		  }
		  /* ... Paste the CSS styles here ... */
  
		  /* Additional Styles */
		  body {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 80vh;
			background-color:#404241;
		  }
  
		  /* Center the content */
		  .nft {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			margin: 2rem;
			flex: 0 0 calc(33.33% - 4rem);
			max-width: 350px;
			background-color: #404241;
			background: linear-gradient(0deg, rgba(40,44,52,1) 0%, rgba(17,0,32,.5) 100%);
			box-shadow: 0 7px 20px 5px #00000088;
			border-radius: .7rem;
			backdrop-filter: blur(7px);
			-webkit-backdrop-filter: blur(7px);
			overflow: hidden;
			transition: .5s all;
		  }
  
		  /* Add padding around the main content */
		  .nft .main {
			padding: 1.5rem;
		  }
  
		  /* Add a hover effect to the extension cards */
		  .nft:hover {
			box-shadow: 0 7px 20px 5px #00000088;
			transform: translateY(-5px);
		  }
  
		  /* Increase the font size for the extension name */
		  .nft h2 {
			font-size: 1.1rem;
			margin: 0.5rem 0;
		  }
  
		  /* Adjust the font size for the description and creator */
		  .nft .description,
		  .nft .creator {
			font-size: 0.7rem;
		  }
  
		  /* Style the token price and duration */
		  .nft .tokenInfo {
			display: flex;
			justify-content: space-between;
			align-items: center;
		  }
  
		  /* Style the price and duration icons */
		  .nft .tokenInfo ins {
			font-size: 0.7rem;
			margin-right: 0.2rem;
		  }
  
		  /* Adjust the font size for the version */
		  .nft .price p {
			font-size: 0.9rem;
		  }
  
		  /* Adjust the font size for the creator */
		  .nft .creator ins {
			font-size: 0.7rem;
		  }
		  .nft hr{
			width: 100%;
			border-bottom: 2px solid #88888855;
			margin-top: 0;
		  }
		  /* Set a maximum width for the token images */
		  .nft .tokenImage {
			max-width: 100%;
			height: 200px;
			margin: 0 auto;
			object-fit: cover;
			border-radius: 0.5rem;
		  }
		
		  /* Flexbox properties to wrap the cards after every three */
		  .nft-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		  }
		  .nft .removeButton {
			font-size: 0.7rem;
			padding: 0.3rem 0.7rem;
			margin-top: 0.5rem;
			background-color: #dd3838;
			border: none;
			border-radius: 0.3rem;
			color: #fff;
			cursor: pointer;
			transition: background-color 0.3s ease;
		  }
		  .nft .removeButton:hover {
			background-color: #c62828;
		  }
		  .nft .wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
		  }
		  
		  .nft .wrapper .removeButton {
			margin-top: 0.5rem;
		  }
	  </style>
	</head>
	<body>
	  <div class="nft-container">
		${extensionList}
	  </div>
	  <script>
	  // JavaScript to handle Remove button click
		const vscode = acquireVsCodeApi();
		const removeButtons = document.querySelectorAll('.removeButton');

		removeButtons.forEach((button) => {
		  button.addEventListener('click', () => {
			const extensionId = button.getAttribute('data-extension-id');
			vscode.postMessage({ command: 'removeExtension', extensionId });
		  });
		});

		
	</script>
	</body>
	</html>
	`;
}

function getExtensionIconUri(extension: vscode.Extension<any>): string {
	// Check if the extension has an icon path specified
	const iconPath = extension.packageJSON.icon;
	if (iconPath) {
		const iconUri = vscode.Uri.file(
			path.join(extension.extensionPath, iconPath)
		);
		const iconData = fs.readFileSync(iconUri.fsPath).toString("base64");
		const iconMimeType =
			path.extname(iconPath) === ".svg" ? "image/svg+xml" : "image/png";
		return `data:${iconMimeType};base64,${iconData}`;
	}
	// Return an empty string if no icon path is specified
	return "";
}

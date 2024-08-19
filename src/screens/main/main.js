const { app, BrowserWindow } = require("electron");
const MainScreen = require('../../mainScreen');
const { autoUpdater } = require("electron-updater");

let curWindow;

// Configurações básicas
autoUpdater.autoDownload = false; // Controle manual de download
autoUpdater.autoInstallOnAppQuit = true; // Instalar atualização ao sair do app

function createWindow() {
  curWindow = new MainScreen();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Verificar atualizações na inicialização
  autoUpdater.checkForUpdates();
  curWindow.showMessage(`Verificando atualizações. Versão atual ${app.getVersion()}`);
});

/* Nova atualização disponível */
autoUpdater.on("update-available", (info) => {
  curWindow.showMessage(`Atualização disponível. Versão atual ${app.getVersion()}`);
  
  // Iniciar o download da atualização
  autoUpdater.downloadUpdate()
    .then(() => curWindow.showMessage('Download da atualização iniciado.'))
    .catch(err => curWindow.showMessage(`Erro ao iniciar o download: ${err}`));
});

/* Nenhuma atualização disponível */
autoUpdater.on("update-not-available", (info) => {
  curWindow.showMessage(`Nenhuma atualização disponível. Versão atual ${app.getVersion()}`);
});

/* Download concluído */
autoUpdater.on("update-downloaded", (info) => {
  curWindow.showMessage(`Atualização baixada. Versão atual ${app.getVersion()}`);
  curWindow.showMessage('A atualização será instalada quando o aplicativo for fechado.');

  // Aqui você pode perguntar ao usuário se deseja reiniciar agora ou depois
  // Exemplo:
  // if (userWantsToRestart) {
  //   autoUpdater.quitAndInstall();
  // }
});

/* Erro ao verificar ou baixar atualizações */
autoUpdater.on("error", (err) => {
  curWindow.showMessage(`Erro: ${err.message}`);
});

// Manipulador global de exceções
process.on("uncaughtException", function (err) {
  console.error('Erro não tratado:', err);
  curWindow.showMessage(`Erro não tratado: ${err.message}`);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

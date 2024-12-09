const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { autoUpdater } = require('electron-updater'); // Ajout pour gestion fine des mises à jour
const { updateElectronApp } = require('update-electron-app');

updateElectronApp({
  repo: 'Amine/electron-app', // Remplacez par votre dépôt GitHub
  updateInterval: '1 hour',  // Vérifie les mises à jour toutes les heures
  logger: require('electron-log'), // Pour voir les logs
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // Ajoutez la gestion des mises à jour ici
  autoUpdater.on('update-available', () => {
    console.log('Mise à jour disponible !');
    mainWindow.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('Mise à jour téléchargée. Redémarrage requis.');
    mainWindow.webContents.send('update_downloaded');
  });
};

// Initialisation de l'application
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

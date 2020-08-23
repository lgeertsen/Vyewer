import { app, dialog, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindow.maximize();

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:8888/home`);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on('addLayer', (event, arg) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Video', extensions: ['mp4'] }]
    }).then(result => {
      if(result.canceled) {
        return;
      }
      if(result.filePaths.length > 0) {
        event.sender.send('addLayer', result.filePaths[0]);
      }
    }).catch(err => {
      console.log(err)
    });
  });
})();

app.on('window-all-closed', () => {
  app.quit();
});

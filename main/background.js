import { app, dialog, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { join } from 'path';
import { execFile } from 'child_process';

process.env.FFPROBE_PATH = join(__dirname, '../bin/ffprobe.exe')
const ffprobe = require('ffprobe-client')

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
        const path = result.filePaths[0];
        ffprobe(path)
          .then(data => {
            console.log(data)
            const videoStream = data.streams[0].codec_type == 'video' ? data.streams[0] : data.streams[1];
            const videoData = {
              path: path,
              fps: parseInt(videoStream.r_frame_rate.split('/')[0]),
              length: parseInt(videoStream.nb_frames)
            }
            event.sender.send('addLayer', videoData);
          })
          .catch(err => console.error(err))

      }
    }).catch(err => {
      console.log(err)
    });
  });
})();

app.on('window-all-closed', () => {
  app.quit();
});

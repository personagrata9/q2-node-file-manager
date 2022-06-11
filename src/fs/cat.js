import { basename } from 'path';
import { createReadStream } from 'fs';
import { getAbsolutePath } from '../utils/getAbsolutePath.js';
import { checkDirentExist } from '../utils/checkDirentExist.js';
import { checkFileExist } from '../utils/checkFileExist.js';
import { checkDirentReadable } from '../utils/checkDirentReadable.js';
import { ERROR_MESSAGE, INVALID_INPUT_MESSAGE, PERMISSION_ERROR_MESSAGE } from '../consts/messages.js';

const getFileContent = (filePath) => {
  const rs = createReadStream(filePath, { encoding: 'utf-8' });
  
  return new Promise((resolve, reject) => {
      let content = '';
      
      rs.on('data', (chunk) => content += chunk);
      rs.on('end', () => resolve(content));
      rs.on('error', () => reject(new Error(ERROR_MESSAGE)));
  });
};

export const readFile = async (command, currentDirPath, args) => {
  try {
    if (args.length !== 1) {
      throw new Error(`${INVALID_INPUT_MESSAGE}: command ${command} expects one argument!`);
    } else {
      const filePath = args[0];
      const absoluteFilePath = getAbsolutePath(currentDirPath, filePath);
      const fileName = basename(absoluteFilePath);

      const isFileExist = await checkDirentExist(absoluteFilePath);
      const isFile = await checkFileExist(absoluteFilePath);
      const isFileReadable = await checkDirentReadable(absoluteFilePath);

      if (!isFileExist) {
        throw new Error(`${ERROR_MESSAGE}: ${absoluteFilePath} doesn't exist!`);
      } else if (!isFile) {
        throw new Error(`${ERROR_MESSAGE}: ${fileName} is not a file!`);
      } else if (!isFileReadable) {
        throw new Error(PERMISSION_ERROR_MESSAGE);
      } else {
        const content = await getFileContent(absoluteFilePath);
        if (content) console.log(content);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

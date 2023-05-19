/// <reference types="vite/client" />
import original from '../src/__tests__/outAll/faces_multi/19746.png';
import rc90 from '../src/__tests__/outAll/faces_multi/rc90_19746.png';
import rac90 from '../src/__tests__/outAll/faces_multi/rac90_19746.png';
import r180 from '../src/__tests__/outAll/faces_multi/r180_19746.png';

const originalImage = document.createElement('img');
originalImage.src = original;

const rc90Image = document.createElement('img');
rc90Image.src = rc90;

const rac90Image = document.createElement('img');
rac90Image.src = rac90;

const r180Image = document.createElement('img');
r180Image.src = r180;

document.body.appendChild(originalImage);
document.body.appendChild(rc90Image);
document.body.appendChild(rac90Image);
document.body.appendChild(r180Image);

fetch('./src/__tests__/outAll/faces_multi/_new_annotations.txt').then(
  async (response) => {
    const text = await response.text();
    const annotationsElement = document.createElement('pre');
    const newLines = text.trim().split('\n')
      .filter((line) => {
        const parts = line.split(' ')
        console.log(parts.length -1)
        return parts[0].endsWith('19746.png')
      })
    annotationsElement.innerText = newLines.join('\n');
    document.body.appendChild(annotationsElement);
  },
);

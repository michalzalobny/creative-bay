import * as THREE from 'three';

interface GetVideoFrameTexture {
  width: number;
  height: number;
  video: HTMLVideoElement;
  appendCanvas?: boolean;
}

export const getVideoFrameTexture = (props: GetVideoFrameTexture) => {
  const { height, width, video, appendCanvas } = props;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(video, 0, 0);

    const imgd = ctx.getImageData(0, 0, width, height),
      pix = imgd.data;

    const tolerance = 0.05;
    // Loops through all of the pixels and modifies the components.
    for (let i = 0, n = pix.length; i < n; i += 4) {
      const isPixelBlack =
        pix[i] / 255 < tolerance && pix[i + 1] / 255 < tolerance && pix[i + 2] / 255 < tolerance;
      if (isPixelBlack) {
        // pix[i] = 0; //Red channel
        // pix[i + 1] = 0; //Green channel
        // pix[i + 2] = 0; //Blue channel
        pix[i + 3] = 0; //Alpha channel
      }
    }

    ctx.putImageData(imgd, 0, 0);
  }

  //preview
  if (appendCanvas) {
    canvas.style.position = 'fixed';
    canvas.style.zIndex = '100';
    canvas.style.top = '50%';
    canvas.style.left = '0';
    canvas.style.transformOrigin = 'top left';
    canvas.style.transform = 'scale(0.4) translateY(-50%)';
    document.body.appendChild(canvas);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

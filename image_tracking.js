const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'path/to/your/image.png';

const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');

const detectImage = () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const detector = new AR.Detector();
  
  const markers = detector.detect(imageData);
  
  if (markers.length > 0) {
    // Found the image
    const marker = markers[0];
    const corners = marker.corners;
    
    overlay.style.display = 'block';
    overlay.width = marker.markerWidth;
    overlay.height = marker.markerHeight;
    
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    overlayCtx.save();
    overlayCtx.beginPath();
    overlayCtx.moveTo(corners[0].x, corners[0].y);
    overlayCtx.lineTo(corners[1].x, corners[1].y);
    overlayCtx.lineTo(corners[2].x, corners[2].y);
    overlayCtx.lineTo(corners[3].x, corners[3].y);
    overlayCtx.closePath();
    overlayCtx.clip();
    
    // Calculate the transformation matrix
    const srcPts = [      corners[0].x, corners[0].y,
      corners[1].x, corners[1].y,
      corners[2].x, corners[2].y,
      corners[3].x, corners[3].y
    ];
    const dstPts = [      0, 0,      overlay.width, 0,      overlay.width, overlay.height,      0, overlay.height    ];
    const mat = cv.findHomography(srcPts, dstPts);
    overlayCtx.setTransform(mat[0], mat[1], mat[3], mat[4], mat[6], mat[7]);
    
    // Draw the image onto the overlay canvas
    overlayCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, overlay.width, overlay.height);
    
    overlayCtx.restore();
  } else {
    // Not found
    overlay.style.display = 'none';
  }
  
  requestAnimationFrame(detectImage);
};

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(detectImage);
  })
  .catch((err) => {
    console.error(err);
  });

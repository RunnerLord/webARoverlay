const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://thewowstyle.com/wp-content/uploads/2015/01/nature-images..jpg';

const detectImage = () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const detector = new AR.Detector();
  
  const markers = detector.detect(imageData);
  
  if (markers.length > 0) {
    // Found the image
    console.log('Image found!');
  }
  
  requestAnimationFrame(detectImage);
};

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      requestAnimationFrame(detectImage);
    };
  })
  .catch(err => console.error(err));

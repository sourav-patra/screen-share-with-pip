// Elements
const videoElement = document.getElementById('video');
const button = document.getElementById('button');
const buttonText = document.getElementById('button-text');
const recordIcon = document.getElementById('circle');
const rippleAnimation = 'ripple 1s linear infinite';
const pipButton = document.getElementById('button-pip');
let isShared = false;
let pipEnabled = false;

/**
 * Change PIP Button style when PIP is turned on
 */
const enablePIPUI = () => {
  pipButton.innerText = "Disable PIP";
  pipEnabled = true;
}

/**
 * Change PIP Button style when PIP is turned off
 */
const disablePIPUI = () => {
  pipButton.innerText = "Enable PIP";
  pipEnabled = false;
}

/**
 * Set button text and animation
 * Display video
 */
const setUIOnStartSharing = () => {
  buttonText.innerText = "Stop Sharing";
  button.disabled = false;
  videoElement.hidden = false;
  recordIcon.style.animation = rippleAnimation;
  isShared = true;
  pipButton.style.display = 'block';
}

/**
 * Set Button text and unset animation
 * Hide video
 */
const setUIOnStopSharing = () => {
  videoElement.hidden = true;
  recordIcon.style.removeProperty('animation');
  buttonText.innerText = "Share Screen";
  isShared = false;
  videoElement.srcObject = null;
  pipButton.style.display = 'none';
}

/**
 * Prompt to select media stream, pass to video element, then play
 */
async function selectMediaStream() {
  try {
    button.disabled = true;
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      setUIOnStartSharing();
    }
  } catch (error) {
    // Catch error
    console.error('An error has occurred', error)
  }
}

// Share button event listener
button.addEventListener('click', async () => {
  try {
    if (isShared) {
      /**
       * It stops the stream by getting its track list using MediaStream.getTracks(),
       * then calling each track's stop method. 
       * Once that's done, srcObject is set to null to make sure it's understood by
       * anyone interested that there's no stream connected.
       */
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      // Change the UI of the button
      setUIOnStopSharing();
    } else {
      await selectMediaStream();
    }
  } catch (error) {
    console.error('An error has occured', error);
    setUIOnStopSharing();
  }
});

// PIP Button event listener
pipButton.addEventListener('click', async () => {
  try {
    if (pipEnabled) {
      disablePIPUI();
      // Stop picture in picture 
      await document.exitPictureInPicture();
    } else {
      // Start picture in picture
      await videoElement.requestPictureInPicture();
      enablePIPUI();
    }
    
  } catch (error) {
    console.error('An error has occured', error);
    disablePIPUI();
  }

});

/**
 * Event listener for when the video enters PIP mode
 */
videoElement.addEventListener('enterpictureinpicture', () => {
  enablePIPUI();
});

/**
 * Event listener for when the video exits PIP mode
 */
videoElement.addEventListener('leavepictureinpicture', () => {
  disablePIPUI();
});


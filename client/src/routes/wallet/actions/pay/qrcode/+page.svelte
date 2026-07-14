<script lang="ts">
    let stream = null;
    let videoElement : HTMLVideoElement | null = $state(null);

    async function requestCameraAccess() {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
        });

        if (videoElement) {
            videoElement.srcObject = stream;
        }
    }
</script>

<video bind:this={videoElement}>
    <track kind="captions">
</video>

<button type="button" onclick={requestCameraAccess}>request camera</button>
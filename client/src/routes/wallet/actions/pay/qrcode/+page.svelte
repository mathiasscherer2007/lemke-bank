<script lang="ts">
    import { resolve } from "$app/paths";
    import { onMount } from "svelte";
    import QrScanner from '$lib/qr-scanner/qr-scanner.min';
    import { env } from "$env/dynamic/public";
    import arrowIcon from '$lib/assets/icons/arrow-right.svg';
    import { goto } from "$app/navigation";
    
    import type { RouteId } from "./$types";

    interface QrCodeResult {
        data: string;
        cornerPoints: Array<unknown>;
    }

    let stream: MediaStream | undefined = $state();
    let videoElement: HTMLVideoElement | undefined = $state();
    let streaming = $state(false);

    let qrScanner: QrScanner;

    function checkQrCode(result: QrCodeResult) {
        console.log(result.data)
        if (result.data.startsWith(`${env.PUBLIC_APP_URL}`)) {
            try {
                const qrcodeUrl = new URL(result.data);
                const targetPage = resolve(qrcodeUrl.pathname as RouteId);
                goto(targetPage);
            } catch (error) {
                console.error("Tried resolving URL, but it wasn't a valid route ID.", error);
            }   
        }
    }

    async function requestCameraAccess() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: { ideal: "environment" }, 
                    aspectRatio: { ideal: 1 / 1 },
                    frameRate: {
                        ideal: 15,
                        max: 30
                    }
                }, 
                audio: false 
            });

            if (videoElement) {
                videoElement.srcObject = stream;
                streaming = true;

                qrScanner = new QrScanner(
                    videoElement,
                    (result: QrCodeResult) => checkQrCode(result),
                    {}
                )

                qrScanner.start();
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === "NotFoundError") {
                    alert("Nenhuma câmera encontrada. Conecte uma câmera e tente de novo.");
                    goto(resolve("/wallet/actions/pay"));
                } else if (error.name === "NotAllowedError") {
                    alert("Para escanear um QRCode, precisamos do acesso à câmera. Edite suas permissões e tente novamente.");
                    requestCameraAccess();
                }
            }
        }
    }

    onMount(() => {
        requestCameraAccess();

        return () => {
            try {
                qrScanner.stop();
            } catch (error) {
                console.warn("Tried stopping QRScanner, but couldn't do so.", error);
            }

            stream?.getTracks()[0].stop();
        }
    })
</script>

<!-- for mobile -->
<a href={resolve('/wallet/actions/pay')} class="flex aspect-square h-10 items-center text-lg lg:hidden">
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
  cancelar
</a>
<div class="flex-1 flex items-center justify-center">
    <div class="flex flex-col gap-5 lg:bg-black/3 lg:dark:bg-black/20 rounded-lg p-5 ">
        <span class="camera lg:w-100 aspect-square dark:bg-black/20 dark:text-[#313130] {streaming ? "active" : ""}">
            <video
                bind:this={videoElement}
                autoplay
                playsinline
                class="rounded aspect-square"
            >
                <track kind="captions" />
            </video>
        </span>
        <h2 class="font-stacksans text-center text-2xl">Escaneie um QRCode de pagamento</h2>
    </div>
</div>

<style>
    .camera {
        --camera-svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 17.5q1.875 0 3.188-1.312T16.5 13t-1.312-3.187T12 8.5T8.813 9.813T7.5 13t1.313 3.188T12 17.5m0-2q-1.05 0-1.775-.725T9.5 13t.725-1.775T12 10.5t1.775.725T14.5 13t-.725 1.775T12 15.5M4 21q-.825 0-1.412-.587T2 19V7q0-.825.588-1.412T4 5h3.15L8.4 3.65q.275-.3.663-.475T9.875 3h4.25q.425 0 .813.175t.662.475L16.85 5H20q.825 0 1.413.588T22 7v12q0 .825-.587 1.413T20 21z'/%3E%3C/svg%3E");
        position: relative;
    }

    .camera::after {
        content: "";
        position: absolute;
        inset: 0;
        margin: auto;
        width: 64px;
        height: 64px;

        background-color: currentColor;

        mask: var(--camera-svg) center / contain no-repeat;
        -webkit-mask: var(--camera-svg) center / contain no-repeat;
    }

    .camera.active::after {
        display: none;
    }
</style>

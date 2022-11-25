import Notify from "simple-notify";

export function notifySuccess(title: string, message: string) {
    new Notify({
        status: 'success',
        title: title,
        text: message,
        effect: 'fade',
        speed: 500,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 5000,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right bottom'
    });
}
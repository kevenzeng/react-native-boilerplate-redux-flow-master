import { Toast } from "native-base";

// Usage: toaster.showToast('Printing Info.');

export const toaster = {
    showToast: (message, duration = 3000) => {
        Toast.show({
            text: message,
            duration,
            position: "top",
            textStyle: { textAlign: "center" },
            buttonText: "好的",
        });
    },
};

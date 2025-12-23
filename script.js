let quantizedData, metaData;

function quantizeFile() {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
        const bytes = new Uint8Array(reader.result);

        let min = Math.min(...bytes);
        let max = Math.max(...bytes);
        let levels = 16;

        quantizedData = bytes.map(v =>
            Math.round(((v - min) / (max - min)) * (levels - 1))
        );

        metaData = { min, max, levels };

        document.getElementById("originalSize").innerText =
            "Original Size: " + (file.size / 1024).toFixed(2) + " KB";

        document.getElementById("quantizedSize").innerText =
            "Quantized Size: " + (quantizedData.length / 1024).toFixed(2) + " KB";

        document.getElementById("ratio").innerText =
            "Compression Ratio: " + (file.size / quantizedData.length).toFixed(2) + ":1";
    };

    reader.readAsArrayBuffer(file);
}

function reconstructFile() {
    if (!quantizedData || !metaData) return;

    const { min, max, levels } = metaData;

    const reconstructed = quantizedData.map(q =>
        ((q / (levels - 1)) * (max - min)) + min
    );

    const blob = new Blob([new Uint8Array(reconstructed)], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reconstructed_file";
    link.click();
}

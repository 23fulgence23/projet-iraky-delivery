// Réduit une photo à 1600 px maximum et la convertit en JPEG léger
export default function compresserImage(file, max = 1600, qualite = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * ratio);
      c.height = Math.round(img.height * ratio);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(
        (b) => (b
          ? resolve(new File([b], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }))
          : reject(new Error("compression"))),
        "image/jpeg", qualite
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("illisible")); };
    img.src = url;
  });
}

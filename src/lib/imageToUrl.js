export async function ImageToURL(file) {
  if (file) {
    try {
      console.log("Original file size:", file.size);

      // Resize the image and get the base64 URL
      const resizedImage = await resizeImage(file);

      console.log("Resized image base64 size:", resizedImage.length);

      return resizedImage;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error; // Re-throw the error to handle it where the function is called
    }
  } else {
    throw new Error("No file provided.");
  }
}
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const base64Url = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality parameter
          resolve(base64Url);
        } catch (error) {
          reject(new Error("Failed to convert canvas to base64"));
        }
      };
      img.onerror = (error) => {
        reject(new Error("Image loading error: " + error.message));
      };
    };

    reader.onerror = (error) => {
      reject(new Error("FileReader error: " + error.message));
    };

    reader.readAsDataURL(file);
  });
}

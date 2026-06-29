export const uploadImageToImgbb = async (file) => {
  const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!file) return null;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      { method: 'POST', body: formData }
    );
    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Image upload failed');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};
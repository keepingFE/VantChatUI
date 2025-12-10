export function useUpload(editor, props, imageDialog, videoDialog) {
  // 处理图片上传
  const handleImageUpload = async (file) => {
    if (!props.uploadImage) {
      editor.value.chain().focus().setImage({ src: file.content }).run();
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false };
      return;
    }

    try {
      imageDialog.value.uploading = true;
      const url = await props.uploadImage(file.file);
      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run();
      }
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false };
    } catch (e) {
      console.error('图片上传失败:', e);
      imageDialog.value.uploading = false;
    }
  };

  // 处理视频上传
  const handleVideoUpload = async (file) => {
    if (!props.uploadVideo) {
      const objectUrl = URL.createObjectURL(file.file);
      editor.value.chain().focus().setNativeVideo({ src: objectUrl }).run();
      videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false };
      return;
    }

    try {
      videoDialog.value.uploading = true;
      const url = await props.uploadVideo(file.file);
      if (url) {
        editor.value.chain().focus().setNativeVideo({ src: url }).run();
      }
      videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false };
    } catch (e) {
      console.error('视频上传失败:', e);
      videoDialog.value.uploading = false;
    }
  };

  // 处理文件选择
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (props.uploadImage) {
      try {
        const url = await props.uploadImage(file);
        if (url) {
          editor.value.chain().focus().setImage({ src: url }).run();
        }
      } catch (err) {
        console.error('图片上传失败:', err);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        editor.value.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return {
    handleImageUpload,
    handleVideoUpload,
    handleFileSelect,
  };
}

export function useUpload(editor, props, imageDialog, videoDialog, fileDialog) {
  // 上传控制器，用于取消上传（为每种类型维护独立的控制器）
  const uploadControllers = {
    image: null,
    video: null,
    file: null,
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // 检查文件大小
  const checkFileSize = (file, maxSize, fileType) => {
    if (maxSize && file.size > maxSize) {
      const maxSizeStr = formatFileSize(maxSize);
      const fileSizeStr = formatFileSize(file.size);
      alert(`${fileType}大小超出限制！\n当前文件: ${fileSizeStr}\n最大限制: ${maxSizeStr}`);
      return false;
    }
    return true;
  };

  // 取消上传
  const cancelUpload = () => {
    // 取消所有正在进行的上传
    Object.keys(uploadControllers).forEach(key => {
      if (uploadControllers[key]) {
        uploadControllers[key].abort();
        uploadControllers[key] = null;
      }
    });
  };

  // 处理图片上传
  const handleImageUpload = async (file) => {
    // 检查文件大小
    if (!checkFileSize(file.file, props.maxImageSize, '图片')) {
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    if (!props.uploadImage) {
      // 不使用 file.content (base64)，改用 ObjectURL 避免大文件卡顿
      const objectUrl = URL.createObjectURL(file.file);
      editor.value.chain().focus().setImage({ src: objectUrl }).run();
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    try {
      imageDialog.value.uploading = true;
      imageDialog.value.progress = 0;
      
      // 创建取消控制器
      uploadControllers.image = new AbortController();
      
      const url = await props.uploadImage(file.file, {
        signal: uploadControllers.image.signal,
        onProgress: (percent) => {
          imageDialog.value.progress = percent;
        }
      });
      
      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run();
      }
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      uploadControllers.image = null;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('图片上传已取消');
      } else {
        console.error('图片上传失败:', e);
        alert('图片上传失败: ' + (e.message || '未知错误'));
      }
      imageDialog.value.uploading = false;
      imageDialog.value.progress = 0;
      uploadControllers.image = null;
    }
  };

  // 处理视频上传
  const handleVideoUpload = async (file) => {
    // 检查文件大小
    if (!checkFileSize(file.file, props.maxVideoSize, '视频')) {
      videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    if (!props.uploadVideo) {
      const objectUrl = URL.createObjectURL(file.file);
      editor.value.chain().focus().setNativeVideo({ src: objectUrl }).run();
      videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    try {
      videoDialog.value.uploading = true;
      videoDialog.value.progress = 0;
      
      // 创建取消控制器
      uploadControllers.video = new AbortController();
      
      const url = await props.uploadVideo(file.file, {
        signal: uploadControllers.video.signal,
        onProgress: (percent) => {
          videoDialog.value.progress = percent;
        }
      });
      
      if (url) {
        editor.value.chain().focus().setNativeVideo({ src: url }).run();
      }
      videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false, progress: 0 };
      uploadControllers.video = null;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('视频上传已取消');
      } else {
        console.error('视频上传失败:', e);
        alert('视频上传失败: ' + (e.message || '未知错误'));
      }
      videoDialog.value.uploading = false;
      videoDialog.value.progress = 0;
      uploadControllers.video = null;
    }
  };

  // 处理文件选择（已废弃，保留以兼容旧代码）
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小（使用正确的限制）
    if (!checkFileSize(file, props.maxImageSize, '图片')) {
      e.target.value = '';
      return;
    }

    if (props.uploadImage) {
      try {
        const url = await props.uploadImage(file);
        if (url) {
          editor.value?.chain().focus().setImage({ src: url }).run();
        }
      } catch (err) {
        console.error('图片上传失败:', err);
        alert('图片上传失败: ' + (err.message || '未知错误'));
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        editor.value?.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // 处理文件上传（文档、压缩包等）
  const handleFileUpload = async (file) => {
    // 检查文件大小
    if (!checkFileSize(file.file, props.maxFileSize, '文件')) {
      fileDialog.value = { show: false, tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    const fileName = file.file.name;
    const fileSize = formatFileSize(file.file.size);
    
    if (!props.uploadFile) {
      // 如果没有提供上传函数，创建本地链接
      const objectUrl = URL.createObjectURL(file.file);
      const fileLink = `<p>📎 <a href="${objectUrl}" download="${fileName}" target="_blank" rel="noopener noreferrer">${fileName}</a> (${fileSize})</p>`;
      editor.value.chain().focus().insertContent(fileLink).run();
      fileDialog.value = { show: false, tab: 0, fileList: [], uploading: false, progress: 0 };
      return;
    }

    try {
      fileDialog.value.uploading = true;
      fileDialog.value.progress = 0;
      
      // 创建取消控制器
      uploadControllers.file = new AbortController();
      
      const url = await props.uploadFile(file.file, {
        signal: uploadControllers.file.signal,
        onProgress: (percent) => {
          fileDialog.value.progress = percent;
        }
      });
      
      if (url) {
        const fileLink = `<p>📎 <a href="${url}" target="_blank" rel="noopener noreferrer">${fileName}</a> (${fileSize})</p>`;
        editor.value.chain().focus().insertContent(fileLink).run();
      }
      fileDialog.value = { show: false, tab: 0, fileList: [], uploading: false, progress: 0 };
      uploadControllers.file = null;
    } catch (e) {
      if (e.name === 'AbortError') {
        console.log('文件上传已取消');
      } else {
        console.error('文件上传失败:', e);
        alert('文件上传失败: ' + (e.message || '未知错误'));
      }
      fileDialog.value.uploading = false;
      fileDialog.value.progress = 0;
      uploadControllers.file = null;
    }
  };

  return {
    handleImageUpload,
    handleVideoUpload,
    handleFileUpload,
    handleFileSelect,
    cancelUpload,
  };
}

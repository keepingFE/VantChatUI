import { ref } from 'vue';

export function useCommands(editor) {
  const linkDialog = ref({ show: false, url: '', text: '' });
  const imageDialog = ref({ show: false, url: '', tab: 0, fileList: [], uploading: false });
  const videoDialog = ref({ show: false, code: '', tab: 0, fileList: [], uploading: false });
  const fileDialog = ref({ show: false, tab: 0, fileList: [], uploading: false });
  const tableDialog = ref({ show: false, rows: 3, cols: 3, withHeader: true, headers: '', defaultContent: '' });

  // 判断当前状态
  const isActive = (name) => {
    if (!editor.value) return false;
    const activeMap = {
      bold: () => editor.value.isActive('bold'),
      italic: () => editor.value.isActive('italic'),
      underline: () => editor.value.isActive('underline'),
      strike: () => editor.value.isActive('strike'),
      heading: () => editor.value.isActive('heading'),
      bulletList: () => editor.value.isActive('bulletList'),
      orderedList: () => editor.value.isActive('orderedList'),
      link: () => editor.value.isActive('link'),
      alignLeft: () => editor.value.isActive({ textAlign: 'left' }),
      alignCenter: () => editor.value.isActive({ textAlign: 'center' }),
      alignRight: () => editor.value.isActive({ textAlign: 'right' }),
    };
    return activeMap[name]?.() || false;
  };

  // 执行命令
  const execCommand = (name) => {
    if (!editor.value) return;
    const commands = {
      bold: () => editor.value.chain().focus().toggleBold().run(),
      italic: () => editor.value.chain().focus().toggleItalic().run(),
      underline: () => editor.value.chain().focus().toggleUnderline().run(),
      strike: () => editor.value.chain().focus().toggleStrike().run(),
      heading: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
      bulletList: () => editor.value.chain().focus().toggleBulletList().run(),
      orderedList: () => editor.value.chain().focus().toggleOrderedList().run(),
      link: () => { linkDialog.value = { show: true, url: '', text: '' }; },
      image: () => { imageDialog.value = { show: true, url: '', tab: 0, fileList: [], uploading: false }; },
      video: () => { videoDialog.value = { show: true, code: '', tab: 0, fileList: [], uploading: false }; },
      file: () => { fileDialog.value = { show: true, tab: 0, fileList: [], uploading: false }; },
      table: () => { tableDialog.value = { show: true, rows: 3, cols: 3, withHeader: true, headers: '', defaultContent: '' }; },
      alignLeft: () => editor.value.chain().focus().setTextAlign('left').run(),
      alignCenter: () => editor.value.chain().focus().setTextAlign('center').run(),
      alignRight: () => editor.value.chain().focus().setTextAlign('right').run(),
      undo: () => editor.value.chain().focus().undo().run(),
      redo: () => editor.value.chain().focus().redo().run(),
    };
    commands[name]?.();
  };

  // 确认链接
  const confirmLink = () => {
    if (linkDialog.value.url) {
      editor.value.chain().focus().setLink({ href: linkDialog.value.url }).run();
    }
  };

  // 确认图片
  const confirmImage = () => {
    if (imageDialog.value.url) {
      editor.value.chain().focus().setImage({ src: imageDialog.value.url }).run();
      imageDialog.value = { show: false, url: '', tab: 0, fileList: [], uploading: false };
    }
  };

  // 确认视频
  const confirmVideo = () => {
    const code = videoDialog.value.code.trim();
    if (!code) return;

    const srcMatch = code.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      editor.value.chain().focus().setIframeVideo({ src: srcMatch[1] }).run();
    } else if (code.startsWith('http')) {
      let embedUrl = code;
      let isNativeVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(code);

      if (!isNativeVideo) {
        if (code.includes('youtube.com/watch')) {
          const videoId = code.match(/v=([^&]+)/)?.[1];
          if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (code.includes('youtu.be/')) {
          const videoId = code.split('youtu.be/')[1]?.split('?')[0];
          if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (code.includes('bilibili.com/video/')) {
          const bvMatch = code.match(/video\/(BV[^/?]+)/);
          if (bvMatch) embedUrl = `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}`;
        }
      }

      if (isNativeVideo) {
        editor.value.chain().focus().setNativeVideo({ src: embedUrl }).run();
      } else {
        editor.value.chain().focus().setIframeVideo({ src: embedUrl }).run();
      }
    }
    videoDialog.value = { show: false, code: '', tab: 0, fileList: [], uploading: false };
  };

  // 确认表格
  const confirmTable = () => {
    const rows = Math.max(1, Math.min(parseInt(tableDialog.value.rows) || 3, 20));
    const cols = Math.max(1, Math.min(parseInt(tableDialog.value.cols) || 3, 10));
    const withHeader = tableDialog.value.withHeader;
    const headers = tableDialog.value.headers.split(/[,，]/).map(h => h.trim()).filter(Boolean);
    const defaultContent = tableDialog.value.defaultContent || '';

    let tableHtml = '<table>';
    if (withHeader) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += `<th><p>${headers[c] || `列${c + 1}`}</p></th>`;
      }
      tableHtml += '</tr>';
    }

    const dataRows = withHeader ? rows - 1 : rows;
    for (let r = 0; r < dataRows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td><p>${defaultContent}</p></td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    editor.value.chain().focus().insertContent(tableHtml).run();
    tableDialog.value = { show: false, rows: 3, cols: 3, withHeader: true, headers: '', defaultContent: '' };
  };

  return {
    linkDialog,
    imageDialog,
    videoDialog,
    fileDialog,
    tableDialog,
    isActive,
    execCommand,
    confirmLink,
    confirmImage,
    confirmVideo,
    confirmTable,
  };
}
